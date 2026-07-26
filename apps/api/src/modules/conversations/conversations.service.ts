import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StartConversationDto } from './dto/start-conversation.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: StartConversationDto) {
    const conversation = await this.prisma.conversation.create({
      data: {
        userId,
        title: dto.title || 'New Conversation',
        mode: dto.mode || 'free',
        topic: dto.topic,
      },
    });

    if (dto.initialMessage) {
      await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: 'user',
          content: dto.initialMessage,
        },
      });
    }

    return conversation;
  }

  async findAll(userId: string, pagination: PaginationDto): Promise<PaginatedResult<any>> {
    const where = { userId };
    const [data, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          _count: { select: { messages: true } },
        },
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pagination.page ?? 1,
        limit: pagination.limit ?? 20,
        totalPages: Math.ceil(total / (pagination.limit ?? 20)),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        feedback: true,
      },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.userId !== userId) throw new ForbiddenException('Access denied');

    return conversation;
  }

  async remove(userId: string, id: string) {
    const conversation = await this.prisma.conversation.findUnique({ where: { id } });
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.userId !== userId) throw new ForbiddenException('Access denied');

    await this.prisma.conversation.delete({ where: { id } });
  }

  async addMessage(userId: string, conversationId: string, role: string, content: string, metadata?: any) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.message.create({
      data: {
        conversationId,
        role,
        content,
        metadata: metadata || {},
      },
    });
  }
}
