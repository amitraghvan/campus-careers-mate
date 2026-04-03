import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../services/chat.service';

@WebSocketGateway({
  cors: {
    /**
     * Security: Never allow all origins.
     * The actual origin check is performed via the `handleConnection` guard
     * and the allowedOrigins list below from ConfigService.
     * Socket.io still needs a permissive cors setting here so it can
     * accept the upgrade, but we enforce it at the connection level.
     */
    origin: (origin: string, callback: (err: Error | null, allow: boolean) => void) => {
      // Evaluated at gateway init time — see constructor for allowedOrigins.
      callback(null, true); // Per-connection auth is enforced in handleConnection
    },
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly allowedOrigins: string[];

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
    private config: ConfigService,
  ) {
    // Build the origin allowlist once at construction time
    const rawOrigins = this.config.get<string>('CORS_ORIGIN', 'http://localhost:5173');
    this.allowedOrigins = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);
  }

  afterInit(_server: Server) {
    this.logger.log('ChatGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // ── Origin check ────────────────────────────────────────────────
      const origin = client.handshake.headers.origin;
      const isDev = this.config.get<string>('NODE_ENV') === 'development';
      const isLocalhost = origin?.match(/^http:\/\/localhost:\d+$/);

      if (origin && !this.allowedOrigins.includes(origin) && !(isDev && isLocalhost)) {
        this.logger.warn(`WebSocket blocked from unauthorized origin: ${origin}`);
        client.disconnect(true);
        return;
      }

      // ── JWT verification ────────────────────────────────────────────
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn('WebSocket: no token provided, disconnecting.');
        client.disconnect(true);
        return;
      }

      // Security: pin algorithm to HS256 to prevent algorithm-confusion attacks
      // (e.g., alg:none bypass or RS256→HS256 confusion)
      const payload = this.jwtService.verify(token, { algorithms: ['HS256'] });
      client.data.user = payload;

      // Join user's personal room for targeted notifications
      client.join(`user_${payload.sub}`);

      this.logger.debug(`WS connected: clientId=${client.id} userId=${payload.sub}`);
    } catch (e) {
      this.logger.warn(`WS auth failed: ${(e as Error).message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`WS disconnected: clientId=${client.id} userId=${client.data.user?.sub}`);
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
