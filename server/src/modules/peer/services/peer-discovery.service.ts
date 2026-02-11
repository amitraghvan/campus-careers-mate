import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { PeerDiscoveryQueryDto } from '../dto/peer-discovery-query.dto';
import { ConnectionStatus } from '@prisma/client';

@Injectable()
export class PeerDiscoveryService {
    constructor(private prisma: PrismaService) { }

    async discoverPeers(currentUserId: string, query: PeerDiscoveryQueryDto) {
        const { college, role, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        // 1. Get blocked users to exclude
        const blockedConnections = await this.prisma.peerConnection.findMany({
            where: {
                OR: [
                    { requesterId: currentUserId, status: ConnectionStatus.BLOCKED },
                    { receiverId: currentUserId, status: ConnectionStatus.BLOCKED },
                ],
            },
            select: { requesterId: true, receiverId: true },
        });

        const blockedUserIds = blockedConnections.map((c) =>
            c.requesterId === currentUserId ? c.receiverId : c.requesterId,
        );
        const excludeIds = [currentUserId, ...blockedUserIds];

        // 2. Build filter
        const where: any = {
            userId: { notIn: excludeIds },
        };

        if (college) {
            where.college = { contains: college, mode: 'insensitive' };
        }

        if (role) {
            where.targetJobRoles = { has: role };
        }

        // 3. Fetch profiles
        const [profiles, total] = await Promise.all([
            this.prisma.peerProfile.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true, avatarUrl: true } },
                },
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
            }),
            this.prisma.peerProfile.count({ where }),
        ]);

        return {
            data: profiles,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
