/**
 * Dashboard Service — aggregated stats & analytics.
 */

import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RedisService } from "../../common/redis/redis.service";

const DASHBOARD_CACHE_TTL = 120; // 2 minutes

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getStats(userId: string) {
    const cacheKey = `dashboard:${userId}:stats`;
    const cached = await this.redis.get<unknown>(cacheKey);
    if (cached) return cached;

    const [
      total,
      byStatus,
      upcomingDeadlines,
      recentActivity,
      checklistProgress,
    ] = await Promise.all([
      // Total count
      this.prisma.opportunity.count({ where: { userId } }),

      // Count by status
      this.prisma.opportunity.groupBy({
        by: ["status"],
        where: { userId },
        _count: { status: true },
      }),

      // Upcoming deadlines (next 14 days)
      this.prisma.opportunity.findMany({
        where: {
          userId,
          deadline: {
            gte: new Date(),
            lte: new Date(Date.now() + 14 * 86400000),
          },
          status: { notIn: ["SELECTED", "REJECTED"] },
        },
        orderBy: { deadline: "asc" },
        take: 5,
        select: {
          id: true,
          company: true,
          role: true,
          status: true,
          deadline: true,
        },
      }),

      // Recent status changes
      this.prisma.statusHistory.findMany({
        where: {
          opportunity: { userId },
        },
        orderBy: { changedAt: "desc" },
        take: 10,
        include: {
          opportunity: {
            select: { company: true, role: true },
          },
        },
      }),

      // Checklist completion rates
      this.prisma.checklistItem.groupBy({
        by: ["done"],
        where: { opportunity: { userId } },
        _count: { done: true },
      }),
    ]);

    // Transform status counts
    const statusBreakdown: Record<string, number> = {};
    for (const item of byStatus) {
      statusBreakdown[item.status] = item._count.status;
    }

    // Checklist stats
    const totalItems = checklistProgress.reduce(
      (sum: number, g: { done: boolean; _count: { done: number } }) => sum + g._count.done,
      0,
    );
    const completedItems =
      checklistProgress.find((g: { done: boolean }) => g.done === true)?._count.done || 0;

    const stats = {
      total,
      statusBreakdown,
      upcomingDeadlines,
      recentActivity,
      checklistProgress: {
        total: totalItems,
        completed: completedItems,
        percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      },
    };

    // Cache
    await this.redis.set(cacheKey, stats, DASHBOARD_CACHE_TTL);
    return stats;
  }

  async getUpcomingDeadlines(userId: string, days = 14) {
    return this.prisma.opportunity.findMany({
      where: {
        userId,
        deadline: {
          gte: new Date(),
          lte: new Date(Date.now() + days * 86400000),
        },
        status: { notIn: ["SELECTED", "REJECTED"] },
      },
      orderBy: { deadline: "asc" },
      include: {
        checklistItems: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  }
}

