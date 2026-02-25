import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { PeerDiscoveryQueryDto } from '../dto/peer-discovery-query.dto';
import { ConnectionStatus } from '@prisma/client';

@Injectable()
export class PeerDiscoveryService {
    constructor(private prisma: PrismaService) { }

    async discoverPeers(currentUserId: string, query: PeerDiscoveryQueryDto) {
        const { college, role, page = 1, limit = 50 } = query;
        const skip = (page - 1) * limit;

        // 1. Get blocked user IDs to exclude
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

        // 2. Fetch ALL users except self and blocked
        const userWhere: Record<string, unknown> = {
            id: { notIn: excludeIds },
        };

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where: userWhere,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    college: true,
                    peerProfile: {
                        select: {
                            college: true,
                            headline: true,
                            targetJobRoles: true,
                            placementStage: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.user.count({ where: userWhere }),
        ]);

        // 3. Filter by college / role if query params provided (applied after fetch for simplicity)
        let filtered = users;
        if (college) {
            filtered = filtered.filter(u =>
                (u.peerProfile?.college || u.college || '').toLowerCase().includes(college.toLowerCase())
            );
        }
        if (role) {
            filtered = filtered.filter(u =>
                u.peerProfile?.targetJobRoles?.some(r => r.toLowerCase().includes(role.toLowerCase()))
            );
        }

        // 4. Map to a consistent shape the frontend expects
        const data = filtered.map((u) => ({
            userId: u.id,
            id: u.id,
            user: { id: u.id, name: u.name, avatarUrl: u.avatarUrl },
            name: u.name,
            college: u.peerProfile?.college || u.college || 'Unknown',
            headline: u.peerProfile?.headline || '',
            targetJobRoles: u.peerProfile?.targetJobRoles || [],
        }));

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
