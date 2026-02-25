import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../services/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust in production
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) { }

  afterInit(server: Server) {
    console.log('ChatGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        console.log('No token provided, disconnecting...');
        client.disconnect();
        return;
      }

      // Verify token
      const payload = this.jwtService.verify(token);
      client.data.user = payload; // Attach user to socket

      // Join user to their own room for targeted messages
      client.join(`user_${payload.sub}`);

      console.log(`Client connected: ${client.id}, User: ${payload.sub}`);
    } catch (e) {
      console.error('WebSocket connection failed:', (e as Error).message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.data.user?.userId}`);
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    const userId = client.data.user.userId;
    const isMember = await this.chatService.validateMembership(userId, conversationId);

    if (!isMember) {
      // client.emit('error', 'Forbidden'); // Optional: emit error
      return { event: 'error', message: 'Forbidden' };
    }

    await client.join(`conversation:${conversationId}`);
    return { event: 'joined', conversationId };
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; content: string },
  ) {
    const userId = client.data.user.userId;
    const { message, recipientId } = await this.chatService.sendMessage(
      userId,
      payload.conversationId,
      payload.content,
    );

    // Emit to conversation room (for active chatters)
    this.server
      .to(`conversation:${payload.conversationId}`)
      .emit('message:receive', message);

    // Emit notification to recipient (if they are online but not in room)
    this.server.to(`user:${recipientId}`).emit('message:notify', message);

    return message;
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    const userId = client.data.user.userId;

    // Mark messages as read in the database
    await this.chatService.markAsRead(userId, conversationId);

    // Notify the other participant that messages were read
    client.to(`conversation:${conversationId}`).emit('message:read:update', {
      conversationId,
      readerId: userId,
    });
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    const userId = client.data.user.userId;
    client.to(`conversation:${conversationId}`).emit('typing:start', { userId, conversationId });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    const userId = client.data.user.userId;
    client.to(`conversation:${conversationId}`).emit('typing:stop', { userId, conversationId });
  }
}
