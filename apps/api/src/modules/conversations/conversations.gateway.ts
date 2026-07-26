import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AiService } from '../ai/ai.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  namespace: '/conversations',
  cors: { origin: '*', credentials: true },
})
export class ConversationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ConversationsGateway.name);
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private conversationsService: ConversationsService,
    private aiService: AiService,
  ) {}

  handleConnection(client: AuthenticatedSocket) {
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const jwt = require('jsonwebtoken');
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'voxspeak-dev-secret');
      client.userId = payload.sub;

      if (!this.userSockets.has(client.userId)) {
        this.userSockets.set(client.userId, new Set());
      }
      this.userSockets.get(client.userId)!.add(client.id);
      this.logger.log(`User ${client.userId} connected [${client.id}]`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const sockets = this.userSockets.get(client.userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) this.userSockets.delete(client.userId);
      }
      this.logger.log(`User ${client.userId} disconnected [${client.id}]`);
    }
  }

  @SubscribeMessage('join:room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!client.userId) throw new WsException('Unauthenticated');
    await client.join(`conversation:${data.conversationId}`);
    return { event: 'joined', data: { room: `conversation:${data.conversationId}` } };
  }

  @SubscribeMessage('leave:room')
  async handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    await client.leave(`conversation:${data.conversationId}`);
    return { event: 'left', data: { room: `conversation:${data.conversationId}` } };
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    if (!client.userId) throw new WsException('Unauthenticated');

    const message = await this.conversationsService.addMessage(
      client.userId,
      data.conversationId,
      'user',
      data.content,
    );

    this.server.to(`conversation:${data.conversationId}`).emit('message:new', message);

    if (data.content.trim()) {
      try {
        const aiResponse = await this.aiService.generateResponse(
          client.userId,
          data.conversationId,
          data.content,
        );

        const aiMessage = await this.conversationsService.addMessage(
          client.userId,
          data.conversationId,
          'assistant',
          aiResponse.content,
          aiResponse.metadata,
        );

        this.server.to(`conversation:${data.conversationId}`).emit('message:new', aiMessage);
        this.server.to(`conversation:${data.conversationId}`).emit('ai:thinking', { done: true });
      } catch (error: any) {
        this.server.to(`conversation:${data.conversationId}`).emit('ai:error', {
          message: 'Failed to generate response',
        });
      }
    }
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.to(`conversation:${data.conversationId}`).emit('typing:update', {
      userId: client.userId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.to(`conversation:${data.conversationId}`).emit('typing:update', {
      userId: client.userId,
      isTyping: false,
    });
  }

  @SubscribeMessage('voice:stream')
  async handleVoiceStream(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; audio: string },
  ) {
    if (!client.userId) throw new WsException('Unauthenticated');

    this.server.to(`conversation:${data.conversationId}`).emit('voice:stream', {
      userId: client.userId,
      audio: data.audio,
    });
  }
}
