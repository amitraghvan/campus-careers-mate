import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService],
})
export class ChatModule { }