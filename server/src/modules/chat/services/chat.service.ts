import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async sendMessage(senderId: string, conversationId: string, content: string) {
        // Validate conversation and membership
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) throw new NotFoundException('Conversation not found');

        if (conversation.participantOneId !== senderId && conversation.participantTwoId !== senderId) {
            throw new ForbiddenException('You are not a participant in this conversation');
        }

        // Transaction: Create message + Update conversation timestamp
        // Using transaction ensures consistency
        const [message, updatedConversation] = await this.prisma.$transaction([
            this.prisma.message.create({
                data: {
                    senderId,
                    conversationId,
                    content,
                },
                include: {
                    sender: { select: { id: true, name: true, avatarUrl: true } }
                }
            }),
            this.prisma.conversation.update({
                where: { id: conversationId },
                data: { lastMessageAt: new Date() },
                select: { participantOneId: true, participantTwoId: true }
            }),
        ]);

        const recipientId = updatedConversation.participantOneId === senderId
            ? updatedConversation.participantTwoId
            : updatedConversation.participantOneId;

        return { message, recipientId };
    }

    async getMessages(userId: string, conversationId: string, limit = 50, cursor?: string) {
        // Validate membership
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) throw new NotFoundException('Conversation not found');

        if (conversation.participantOneId !== userId && conversation.participantTwoId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        const messages = await this.prisma.message.findMany({
            where: { conversationId },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' }, // Fetch latest first
            include: {
                sender: { select: { id: true, name: true, avatarUrl: true } },
            },
        });

        return messages.reverse(); // Return chronological
    }

    async validateMembership(userId: string, conversationId: string): Promise<boolean> {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            select: { participantOneId: true, participantTwoId: true },
        });

        if (!conversation) return false;

        return (
            conversation.participantOneId === userId ||
            conversation.participantTwoId === userId
        );
    }

    async getUserConversations(userId: string) {
        return this.prisma.conversation.findMany({
            where: {
                OR: [{ participantOneId: userId }, { participantTwoId: userId }],
            },
            orderBy: { lastMessageAt: 'desc' },
            include: {
                participantOne: { select: { id: true, name: true, avatarUrl: true } },
                participantTwo: { select: { id: true, name: true, avatarUrl: true } },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
}
