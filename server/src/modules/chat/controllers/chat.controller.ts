import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get()
    getConversations(@CurrentUser() user: any) {
        return this.chatService.getUserConversations(user.userId);
    }

    @Get(':conversationId/messages')
    getMessages(
        @CurrentUser() user: any,
        @Param('conversationId') conversationId: string,
        @Query('cursor') cursor?: string,
    ) {
        return this.chatService.getMessages(user.userId, conversationId, 50, cursor);
    }
}
