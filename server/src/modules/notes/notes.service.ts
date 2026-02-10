/**
 * Notes Service — preparation notes business logic.
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateNoteDto, UpdateNoteDto } from "./dto";

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    });
  }

  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException("Note not found");
    if (note.userId !== userId) throw new ForbiddenException("Access denied");
    return note;
  }

  async create(userId: string, dto: CreateNoteDto) {
    const note = await this.prisma.note.create({
      data: {
        userId,
        title: dto.title.trim(),
        content: dto.content?.trim() || "",
        tags: dto.tags || [],
        attachments: dto.attachments || [],
        isPinned: dto.isPinned || false,
      },
    });

    this.logger.log(`Note created: ${note.id}`);
    return note;
  }

  async update(userId: string, id: string, dto: UpdateNoteDto) {
    await this.ensureOwnership(userId, id);

    const updated = await this.prisma.note.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.content !== undefined && { content: dto.content.trim() }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.attachments !== undefined && { attachments: dto.attachments }),
        ...(dto.isPinned !== undefined && { isPinned: dto.isPinned }),
      },
    });

    return updated;
  }

  async remove(userId: string, id: string) {
    await this.ensureOwnership(userId, id);
    await this.prisma.note.delete({ where: { id } });
    this.logger.log(`Note deleted: ${id}`);
    return { message: "Note deleted successfully" };
  }

  async togglePin(userId: string, id: string) {
    const note = await this.ensureOwnership(userId, id);
    const updated = await this.prisma.note.update({
      where: { id },
      data: { isPinned: !note.isPinned },
    });
    return updated;
  }

  private async ensureOwnership(userId: string, noteId: string) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException("Note not found");
    if (note.userId !== userId) throw new ForbiddenException("Access denied");
    return note;
  }
}

