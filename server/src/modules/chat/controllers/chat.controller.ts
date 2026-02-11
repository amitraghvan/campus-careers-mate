import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get()
    getConversations(@CurrentUser() user: any) {
        return this.chatService.getUserConversations(user.id);
    }

    @Get(':conversationId/messages')
    getMessages(
        @CurrentUser() user: any,
        @Param('conversationId') conversationId: string,
        @Query('cursor') cursor?: string,
    ) {
        return this.chatService.getMessages(user.id, conversationId, 50, cursor);
    }

    @Post(':conversationId/messages')
    sendMessage(
        @CurrentUser() user: any,
        @Param('conversationId') conversationId: string,
        @Body() body: { content: string },
    ) {
        return this.chatService.sendMessage(user.id, conversationId, body.content);
    }
}
