import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreatePeerProfileDto } from '../dto/create-peer-profile.dto';

@Injectable()
export class PeerProfileService {
    constructor(private prisma: PrismaService) { }

    async createOrUpdate(userId: string, dto: CreatePeerProfileDto) {
        return this.prisma.peerProfile.upsert({
            where: { userId },
            update: {
                college: dto.college,
                targetJobRoles: dto.targetJobRoles,
                placementStage: dto.placementStage,
                headline: dto.headline,
            },
            create: {
                userId,
                college: dto.college,
                targetJobRoles: dto.targetJobRoles,
                placementStage: dto.placementStage,
                headline: dto.headline,
            },
        });
    }

    async getMyProfile(userId: string) {
        const profile = await this.prisma.peerProfile.findUnique({
            where: { userId },
            include: { user: { select: { name: true, email: true, avatarUrl: true } } },
        });
        return profile;
    }

    async getProfileById(userId: string) {
        const profile = await this.prisma.peerProfile.findUnique({
            where: { userId: userId }, // Note: we look up by userId, not profile ID, as requested
            include: { user: { select: { name: true, email: true, avatarUrl: true } } },
        });
        if (!profile) throw new NotFoundException('Peer profile not found');
        return profile;
    }
}
