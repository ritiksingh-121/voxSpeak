"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConversationsService", {
    enumerable: true,
    get: function() {
        return ConversationsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
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
let ConversationsService = class ConversationsService {
    async create(userId, dto) {
        const conversation = await this.prisma.conversation.create({
            data: {
                userId,
                title: dto.title || 'New Conversation',
                mode: dto.mode || 'free',
                topic: dto.topic
            }
        });
        if (dto.initialMessage) {
            await this.prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    role: 'user',
                    content: dto.initialMessage
                }
            });
        }
        return conversation;
    }
    async findAll(userId, pagination) {
        const where = {
            userId
        };
        const [data, total] = await Promise.all([
            this.prisma.conversation.findMany({
                where,
                orderBy: {
                    updatedAt: 'desc'
                },
                skip: pagination.skip,
                take: pagination.limit,
                include: {
                    _count: {
                        select: {
                            messages: true
                        }
                    }
                }
            }),
            this.prisma.conversation.count({
                where
            })
        ]);
        return {
            data,
            meta: {
                total,
                page: pagination.page ?? 1,
                limit: pagination.limit ?? 20,
                totalPages: Math.ceil(total / (pagination.limit ?? 20))
            }
        };
    }
    async findOne(userId, id) {
        const conversation = await this.prisma.conversation.findUnique({
            where: {
                id
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                feedback: true
            }
        });
        if (!conversation) throw new _common.NotFoundException('Conversation not found');
        if (conversation.userId !== userId) throw new _common.ForbiddenException('Access denied');
        return conversation;
    }
    async remove(userId, id) {
        const conversation = await this.prisma.conversation.findUnique({
            where: {
                id
            }
        });
        if (!conversation) throw new _common.NotFoundException('Conversation not found');
        if (conversation.userId !== userId) throw new _common.ForbiddenException('Access denied');
        await this.prisma.conversation.delete({
            where: {
                id
            }
        });
    }
    async addMessage(userId, conversationId, role, content, metadata) {
        const conversation = await this.prisma.conversation.findUnique({
            where: {
                id: conversationId
            }
        });
        if (!conversation) throw new _common.NotFoundException('Conversation not found');
        if (conversation.userId !== userId) throw new _common.ForbiddenException('Access denied');
        return this.prisma.message.create({
            data: {
                conversationId,
                role,
                content,
                metadata: metadata || {}
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(ConversationsService.name);
    }
};
ConversationsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], ConversationsService);

//# sourceMappingURL=conversations.service.js.map