"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConversationsGateway", {
    enumerable: true,
    get: function() {
        return ConversationsGateway;
    }
});
const _websockets = require("@nestjs/websockets");
const _socketio = require("socket.io");
const _common = require("@nestjs/common");
const _conversationsservice = require("./conversations.service");
const _aiservice = require("../ai/ai.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        r = Reflect.decorate(decorators, target, key, desc);
    } else {
        for(var i = decorators.length - 1; i >= 0; i--){
            if (d = decorators[i]) {
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            }
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
        return Reflect.metadata(metadataKey, metadataValue);
    }
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ConversationsGateway = class ConversationsGateway {
    handleConnection(client) {
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
            this.userSockets.get(client.userId).add(client.id);
            this.logger.log(`User ${client.userId} connected [${client.id}]`);
        } catch  {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.userId) {
            const sockets = this.userSockets.get(client.userId);
            if (sockets) {
                sockets.delete(client.id);
                if (sockets.size === 0) this.userSockets.delete(client.userId);
            }
            this.logger.log(`User ${client.userId} disconnected [${client.id}]`);
        }
    }
    async handleJoinRoom(client, data) {
        if (!client.userId) throw new _websockets.WsException('Unauthenticated');
        await client.join(`conversation:${data.conversationId}`);
        return {
            event: 'joined',
            data: {
                room: `conversation:${data.conversationId}`
            }
        };
    }
    async handleLeaveRoom(client, data) {
        await client.leave(`conversation:${data.conversationId}`);
        return {
            event: 'left',
            data: {
                room: `conversation:${data.conversationId}`
            }
        };
    }
    async handleMessage(client, data) {
        if (!client.userId) throw new _websockets.WsException('Unauthenticated');
        const message = await this.conversationsService.addMessage(client.userId, data.conversationId, 'user', data.content);
        this.server.to(`conversation:${data.conversationId}`).emit('message:new', message);
        if (data.content.trim()) {
            try {
                const aiResponse = await this.aiService.generateResponse(client.userId, data.conversationId, data.content);
                const aiMessage = await this.conversationsService.addMessage(client.userId, data.conversationId, 'assistant', aiResponse.content, aiResponse.metadata);
                this.server.to(`conversation:${data.conversationId}`).emit('message:new', aiMessage);
                this.server.to(`conversation:${data.conversationId}`).emit('ai:thinking', {
                    done: true
                });
            } catch (error) {
                this.server.to(`conversation:${data.conversationId}`).emit('ai:error', {
                    message: 'Failed to generate response'
                });
            }
        }
    }
    async handleTypingStart(client, data) {
        client.to(`conversation:${data.conversationId}`).emit('typing:update', {
            userId: client.userId,
            isTyping: true
        });
    }
    async handleTypingStop(client, data) {
        client.to(`conversation:${data.conversationId}`).emit('typing:update', {
            userId: client.userId,
            isTyping: false
        });
    }
    async handleVoiceStream(client, data) {
        if (!client.userId) throw new _websockets.WsException('Unauthenticated');
        this.server.to(`conversation:${data.conversationId}`).emit('voice:stream', {
            userId: client.userId,
            audio: data.audio
        });
    }
    constructor(conversationsService, aiService){
        this.conversationsService = conversationsService;
        this.aiService = aiService;
        this.logger = new _common.Logger(ConversationsGateway.name);
        this.userSockets = new Map();
    }
};
_ts_decorate([
    (0, _websockets.WebSocketServer)(),
    _ts_metadata("design:type", typeof _socketio.Server === "undefined" ? Object : _socketio.Server)
], ConversationsGateway.prototype, "server", void 0);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('join:room'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedSocket === "undefined" ? Object : AuthenticatedSocket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ConversationsGateway.prototype, "handleJoinRoom", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('leave:room'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedSocket === "undefined" ? Object : AuthenticatedSocket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ConversationsGateway.prototype, "handleLeaveRoom", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('message:send'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedSocket === "undefined" ? Object : AuthenticatedSocket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ConversationsGateway.prototype, "handleMessage", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('typing:start'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedSocket === "undefined" ? Object : AuthenticatedSocket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ConversationsGateway.prototype, "handleTypingStart", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('typing:stop'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedSocket === "undefined" ? Object : AuthenticatedSocket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ConversationsGateway.prototype, "handleTypingStop", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('voice:stream'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedSocket === "undefined" ? Object : AuthenticatedSocket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ConversationsGateway.prototype, "handleVoiceStream", null);
ConversationsGateway = _ts_decorate([
    (0, _websockets.WebSocketGateway)({
        namespace: '/conversations',
        cors: {
            origin: '*',
            credentials: true
        }
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _conversationsservice.ConversationsService === "undefined" ? Object : _conversationsservice.ConversationsService,
        typeof _aiservice.AiService === "undefined" ? Object : _aiservice.AiService
    ])
], ConversationsGateway);

//# sourceMappingURL=conversations.gateway.js.map