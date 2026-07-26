import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SaveWordDto } from './dto/save-word.dto';

interface VocabularyQuery {
  page?: number;
  limit?: number;
  skip?: number;
  search?: string;
  status?: string;
  difficulty?: string;
}

@Injectable()
export class VocabularyService {
  private readonly logger = new Logger(VocabularyService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: VocabularyQuery) {
    const where: any = { userId };

    if (query.search) {
      where.word = { contains: query.search, mode: 'insensitive' };
    }
    if (query.status) where.status = query.status;
    if (query.difficulty) where.difficulty = query.difficulty;

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.vocabularyItem.findMany({
        where,
        orderBy: { lastReviewed: { sort: 'asc', nulls: 'last' } },
        skip,
        take: limit,
      }),
      this.prisma.vocabularyItem.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async save(userId: string, dto: SaveWordDto) {
    const existing = await this.prisma.vocabularyItem.findUnique({
      where: { userId_word: { userId, word: dto.word.toLowerCase().trim() } },
    });
    if (existing) throw new ConflictException('Word already exists in your vocabulary');

    return this.prisma.vocabularyItem.create({
      data: {
        userId,
        word: dto.word.toLowerCase().trim(),
        definition: dto.definition,
        exampleSentence: dto.exampleSentence,
        context: dto.context,
        nextReview: this.calculateNextReview(new Date(), 0),
      },
    });
  }

  async update(userId: string, id: string, dto: Partial<SaveWordDto>) {
    const item = await this.prisma.vocabularyItem.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundException('Vocabulary item not found');

    return this.prisma.vocabularyItem.update({
      where: { id },
      data: {
        ...(dto.word && { word: dto.word.toLowerCase().trim() }),
        ...(dto.definition !== undefined && { definition: dto.definition }),
        ...(dto.exampleSentence !== undefined && { exampleSentence: dto.exampleSentence }),
        ...(dto.context !== undefined && { context: dto.context }),
      },
    });
  }

  async remove(userId: string, id: string) {
    const item = await this.prisma.vocabularyItem.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundException('Vocabulary item not found');
    await this.prisma.vocabularyItem.delete({ where: { id } });
  }

  async getWeakWords(userId: string) {
    const items = await this.prisma.vocabularyItem.findMany({
      where: {
        userId,
        OR: [
          { status: 'learning' },
          { nextReview: { lte: new Date() } },
        ],
      },
      orderBy: { timesWrong: 'desc' },
      take: 20,
    });
    return items;
  }

  async extractFromConversation(userId: string, conversationId: string, words: string[]) {
    const saved: any[] = [];
    for (const word of words) {
      try {
        const item = await this.prisma.vocabularyItem.upsert({
          where: { userId_word: { userId, word: word.toLowerCase().trim() } },
          update: {
            timesEncountered: { increment: 1 },
            context: `Extracted from conversation ${conversationId}`,
          },
          create: {
            userId,
            word: word.toLowerCase().trim(),
            context: `Extracted from conversation ${conversationId}`,
            timesEncountered: 1,
          },
        });
        saved.push(item);
      } catch (e) {
        this.logger.warn(`Failed to save word ${word}: ${e}`);
      }
    }
    return saved;
  }

  async updateSpacedRepetition(userId: string, wordId: string, correct: boolean) {
    const item = await this.prisma.vocabularyItem.findFirst({
      where: { id: wordId, userId },
    });
    if (!item) throw new NotFoundException('Vocabulary item not found');

    const timesCorrect = item.timesCorrect + (correct ? 1 : 0);
    const timesWrong = item.timesWrong + (correct ? 0 : 1);
    const totalAttempts = timesCorrect + timesWrong;

    let status = item.status;
    if (totalAttempts >= 5 && timesCorrect / totalAttempts >= 0.8) {
      status = 'mastered';
    } else if (totalAttempts >= 3 && timesCorrect / totalAttempts >= 0.6) {
      status = 'reviewing';
    }

    const easeFactor = correct ? 2.5 : 0.5;
    const interval = Math.max(1, Math.floor(totalAttempts * easeFactor));
    const nextReview = this.calculateNextReview(new Date(), interval);

    return this.prisma.vocabularyItem.update({
      where: { id: wordId },
      data: {
        timesCorrect,
        timesWrong,
        status,
        lastReviewed: new Date(),
        nextReview,
      },
    });
  }

  private calculateNextReview(from: Date, intervalDays: number): Date {
    const next = new Date(from);
    next.setDate(next.getDate() + intervalDays);
    return next;
  }
}
