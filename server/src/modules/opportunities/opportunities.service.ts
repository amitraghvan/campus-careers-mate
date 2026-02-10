/**
 * Opportunities Service — core placement tracking business logic.
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { OpportunityStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RedisService } from "../../common/redis/redis.service";
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
  UpdateStatusDto,
  CreateChecklistItemDto,
  UpdateChecklistItemDto,
  OpportunityQueryDto,
} from "./dto";
import { validateStatusTransition } from "./status-machine";

const CACHE_PREFIX = "opp:";
const CACHE_TTL = 300; // 5 minutes

@Injectable()
export class OpportunitiesService {
  private readonly logger = new Logger(OpportunitiesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  // ── List (paginated, filterable, sortable) ─────

  async findAll(userId: string, query: OpportunityQueryDto) {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const where: Prisma.OpportunityWhereInput = {
      userId,
      ...(status && { status: status as OpportunityStatus }),
      ...(search && {
        OR: [
          { company: { contains: search, mode: "insensitive" as const } },
          { role: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        include: { checklistItems: { orderBy: { sortOrder: "asc" } } },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.opportunity.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  // ── Get by ID ──────────────────────────────────

  async findOne(userId: string, id: string) {
    // Check cache
    const cached = await this.redis.get<unknown>(`${CACHE_PREFIX}${id}`);
    if (cached) return cached;

    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        checklistItems: { orderBy: { sortOrder: "asc" } },
        statusHistory: { orderBy: { changedAt: "desc" }, take: 10 },
      },
    });

    if (!opportunity) throw new NotFoundException("Opportunity not found");
    if (opportunity.userId !== userId) throw new ForbiddenException("Access denied");

    // Cache result
    await this.redis.set(`${CACHE_PREFIX}${id}`, opportunity, CACHE_TTL);

    return opportunity;
  }

  // ── Create ─────────────────────────────────────

  async create(userId: string, dto: CreateOpportunityDto) {
    const opportunity = await this.prisma.opportunity.create({
      data: {
        userId,
        company: dto.company.trim(),
        role: dto.role.trim(),
        status: (dto.status as OpportunityStatus) || OpportunityStatus.WISHLIST,
        deadline: new Date(dto.deadline),
        package: dto.package?.trim() || null,
        notes: dto.notes?.trim() || "",
      },
      include: { checklistItems: true },
    });

    // Invalidate user's dashboard cache
    await this.redis.delByPattern(`dashboard:${userId}:*`);

    this.logger.log(`Opportunity created: ${opportunity.id} (${dto.company})`);
    return opportunity;
  }

  // ── Update ─────────────────────────────────────

  async update(userId: string, id: string, dto: UpdateOpportunityDto) {
    const existing = await this.ensureOwnership(userId, id);

    // If status changed, validate transition
    if (dto.status && dto.status !== existing.status) {
      validateStatusTransition(existing.status, dto.status as OpportunityStatus);
    }

    const updated = await this.prisma.opportunity.update({
      where: { id },
      data: {
        ...(dto.company && { company: dto.company.trim() }),
        ...(dto.role && { role: dto.role.trim() }),
        ...(dto.status && { status: dto.status as OpportunityStatus }),
        ...(dto.deadline && { deadline: new Date(dto.deadline) }),
        ...(dto.package !== undefined && { package: dto.package?.trim() || null }),
        ...(dto.notes !== undefined && { notes: dto.notes?.trim() || "" }),
      },
      include: { checklistItems: { orderBy: { sortOrder: "asc" } } },
    });

    // Record status change
    if (dto.status && dto.status !== existing.status) {
      await this.prisma.statusHistory.create({
        data: {
          opportunityId: id,
          fromStatus: existing.status,
          toStatus: dto.status as OpportunityStatus,
        },
      });
    }

    await this.redis.del(`${CACHE_PREFIX}${id}`);
    await this.redis.delByPattern(`dashboard:${userId}:*`);

    return updated;
  }

  // ── Update Status (dedicated endpoint) ─────────

  async updateStatus(userId: string, id: string, dto: UpdateStatusDto) {
    const existing = await this.ensureOwnership(userId, id);
    validateStatusTransition(existing.status, dto.status as OpportunityStatus);

    const [updated] = await this.prisma.$transaction([
      this.prisma.opportunity.update({
        where: { id },
        data: { status: dto.status as OpportunityStatus },
        include: { checklistItems: { orderBy: { sortOrder: "asc" } } },
      }),
      this.prisma.statusHistory.create({
        data: {
          opportunityId: id,
          fromStatus: existing.status,
          toStatus: dto.status as OpportunityStatus,
        },
      }),
    ]);

    await this.redis.del(`${CACHE_PREFIX}${id}`);
    await this.redis.delByPattern(`dashboard:${userId}:*`);

    this.logger.log(`Status changed: ${existing.status} → ${dto.status} for ${id}`);
    return updated;
  }

  // ── Delete ─────────────────────────────────────

  async remove(userId: string, id: string) {
    await this.ensureOwnership(userId, id);

    await this.prisma.opportunity.delete({ where: { id } });
    await this.redis.del(`${CACHE_PREFIX}${id}`);
    await this.redis.delByPattern(`dashboard:${userId}:*`);

    this.logger.log(`Opportunity deleted: ${id}`);
    return { message: "Opportunity deleted successfully" };
  }

  // ── Checklist Operations ───────────────────────

  async addChecklistItem(userId: string, oppId: string, dto: CreateChecklistItemDto) {
    await this.ensureOwnership(userId, oppId);

    const maxOrder = await this.prisma.checklistItem.aggregate({
      where: { opportunityId: oppId },
      _max: { sortOrder: true },
    });

    const item = await this.prisma.checklistItem.create({
      data: {
        opportunityId: oppId,
        text: dto.text.trim(),
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    await this.redis.del(`${CACHE_PREFIX}${oppId}`);
    return item;
  }

  async updateChecklistItem(
    userId: string,
    oppId: string,
    itemId: string,
    dto: UpdateChecklistItemDto,
  ) {
    await this.ensureOwnership(userId, oppId);

    const item = await this.prisma.checklistItem.findFirst({
      where: { id: itemId, opportunityId: oppId },
    });
    if (!item) throw new NotFoundException("Checklist item not found");

    const updated = await this.prisma.checklistItem.update({
      where: { id: itemId },
      data: {
        ...(dto.text !== undefined && { text: dto.text.trim() }),
        ...(dto.done !== undefined && { done: dto.done }),
      },
    });

    await this.redis.del(`${CACHE_PREFIX}${oppId}`);
    return updated;
  }

  async removeChecklistItem(userId: string, oppId: string, itemId: string) {
    await this.ensureOwnership(userId, oppId);

    await this.prisma.checklistItem.deleteMany({
      where: { id: itemId, opportunityId: oppId },
    });

    await this.redis.del(`${CACHE_PREFIX}${oppId}`);
    return { message: "Checklist item removed" };
  }

  // ── Helpers ────────────────────────────────────

  private async ensureOwnership(userId: string, oppId: string) {
    const opp = await this.prisma.opportunity.findUnique({ where: { id: oppId } });
    if (!opp) throw new NotFoundException("Opportunity not found");
    if (opp.userId !== userId) throw new ForbiddenException("Access denied");
    return opp;
  }
}
