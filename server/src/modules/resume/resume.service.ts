/**
 * Resume Service — CRUD for AI Resume Builder.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ResumeService {
    constructor(private readonly prisma: PrismaService) { }

    async listResumes(userId: string) {
        return this.prisma.resume.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                title: true,
                atsScore: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getResume(id: string, userId: string) {
        const resume = await this.prisma.resume.findFirst({
            where: { id, userId },
        });
        if (!resume) throw new NotFoundException('Resume not found');
        return resume;
    }

    async createResume(userId: string, title: string, data: any) {
        return this.prisma.resume.create({
            data: {
                userId,
                title: title || 'My Resume',
                data: data || {},
            },
        });
    }

    async updateResume(id: string, userId: string, payload: {
        title?: string;
        data?: any;
        atsScore?: number;
        atsFeedback?: any;
    }) {
        await this.getResume(id, userId); // ensure ownership
        return this.prisma.resume.update({
            where: { id },
            data: {
                ...(payload.title !== undefined && { title: payload.title }),
                ...(payload.data !== undefined && { data: payload.data }),
                ...(payload.atsScore !== undefined && { atsScore: payload.atsScore }),
                ...(payload.atsFeedback !== undefined && { atsFeedback: payload.atsFeedback }),
            },
        });
    }

    async deleteResume(id: string, userId: string) {
        await this.getResume(id, userId);
        await this.prisma.resume.delete({ where: { id } });
        return { success: true };
    }
}
