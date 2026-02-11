import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ConnectionStatus } from '@prisma/client';

@Injectable()
export class PeerConnectionService {
    constructor(private prisma: PrismaService) { }

    async sendRequest(requesterId: string, receiverId: string) {
        if (requesterId === receiverId) {
            throw new BadRequestException('Cannot connect with yourself');
        }

        // Check if any connection exists
        const existing = await this.prisma.peerConnection.findUnique({
            where: {
                requesterId_receiverId: { requesterId, receiverId },
            },
        });

        if (existing) {
            throw new ConflictException(`Connection request already exists with status: ${existing.status}`);
        }

        // Check strict reverse duplicate
        const reverse = await this.prisma.peerConnection.findUnique({
            where: {
                requesterId_receiverId: { requesterId: receiverId, receiverId: requesterId },
            },
        });

        if (reverse) {
            if (reverse.status === ConnectionStatus.PENDING) {
                throw new ConflictException('This user has already sent you a request. Please accept it.');
            }
            if (reverse.status === ConnectionStatus.ACCEPTED) {
                throw new ConflictException('You are already connected.');
            }
            if (reverse.status === ConnectionStatus.BLOCKED) {
                throw new ConflictException('Cannot connect.');
            }
        }

        return this.prisma.peerConnection.create({
            data: {
                requesterId,
                receiverId,
                status: ConnectionStatus.PENDING,
            },
        });
    }

    async respondToRequest(requestId: string, userId: string, status: ConnectionStatus) {
        if (status !== ConnectionStatus.ACCEPTED && status !== ConnectionStatus.BLOCKED) {
            // REJECTED isn't in enum, maybe delete? Prompt says "Accept / reject request".
            // Usually reject means delete or set to REJECTED.
            // Schema has BLOCKED, ACCEPTED, PENDING.
            // If we implement Reject as "Delete", that works.
            // If we implement Reject as explicit status, I need updating schema for REJECTED if it's not there.
            // The prompt said status (PENDING / ACCEPTED / BLOCKED).
            // So "Reject" likely means delete or just ignore?
            // Or maybe prompt meant BLOCKED as the only negative state?
            // "Accept / reject request" -> Usually Reject logic is delete the request so they can request again later, or keep it as Rejected.
            // I'll implement REJECT as delete for now, or just not support it if not in enum.
            // Wait, let's assume REJECT = delete request
            throw new BadRequestException('Invalid status');
        }

        const request = await this.prisma.peerConnection.findUnique({ where: { id: requestId } });
        if (!request) throw new NotFoundException('Request not found');

        if (request.receiverId !== userId) {
            throw new NotFoundException('Request not found or not for you');
        }

        if (request.status !== ConnectionStatus.PENDING) {
            throw new ConflictException('Request is already processed');
        }

        const updated = await this.prisma.peerConnection.update({
            where: { id: requestId },
            data: { status },
        });

        if (updated.status === ConnectionStatus.ACCEPTED) {
            // Create DB conversation immediately
            // Check if conversation exists (it shouldn't if they weren't connected)
            /*
            await this.prisma.conversation.create({
              data: {
                participantOneId: request.requesterId,
                participantTwoId: request.receiverId
              }
            });
            */
            // Actually I'll do it via upsert or check, just in case.
            // But schema says unique [participantOneId, participantTwoId].
            // We need to ensure consistent ordering of IDs?
            // My schema has `participantOneId` and `participantTwoId`.
            // Unique constraint is `@@unique([participantOneId, participantTwoId])`.
            // But `{p1: A, p2: B}` is different from `{p1: B, p2: A}` unless I enforce order or check both.
            // Prisma doesn't auto-sort.
            // I should enforce p1 < p2 logic or check both.
            // For now, I'll ignore conversation creation here and do it lazily or just rely on the connection existing.
            // The prompt says "One private room per conversation".
            // And "Chat allowed only after ACCEPTED connection".
            // I'll create the conversation now.
            const [p1, p2] = [request.requesterId, request.receiverId].sort();
            // Upsert conversation
            // But wait, schema unique is only one way? Yes.
            // So I must always store sorted.
            // But existing schema definition: `@@unique([participantOneId, participantTwoId])`
            // I'll stick to sorted IDs.
            await this.prisma.conversation.upsert({
                where: {
                    participantOneId_participantTwoId: {
                        participantOneId: p1,
                        participantTwoId: p2
                    }
                },
                create: { participantOneId: p1, participantTwoId: p2 },
                update: {}
            });
        }

        return updated;
    }

    // Helper for rejecting (deleting)
    async rejectRequest(requestId: string, userId: string) {
        const request = await this.prisma.peerConnection.findUnique({ where: { id: requestId } });
        if (!request || request.receiverId !== userId) throw new NotFoundException('Request not found');
        if (request.status !== ConnectionStatus.PENDING) throw new ConflictException('Request already processed');
        return this.prisma.peerConnection.delete({ where: { id: requestId } });
    }

    async getConnections(userId: string) {
        return this.prisma.peerConnection.findMany({
            where: {
                OR: [
                    { requesterId: userId, status: ConnectionStatus.ACCEPTED },
                    { receiverId: userId, status: ConnectionStatus.ACCEPTED }
                ]
            },
            include: {
                requester: { select: { id: true, name: true, avatarUrl: true, college: true } },
                receiver: { select: { id: true, name: true, avatarUrl: true, college: true } }
            }
        });
    }

    async getIncomingRequests(userId: string) {
        return this.prisma.peerConnection.findMany({
            where: { receiverId: userId, status: ConnectionStatus.PENDING },
            include: { requester: { select: { id: true, name: true, avatarUrl: true, college: true } } }
        });
    }
}
