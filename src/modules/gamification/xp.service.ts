import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class XpService {
  private readonly logger = new Logger(XpService.name);

  constructor(private prisma: PrismaService) {}

  async addTransaction(userId: string, amount: number, reason: string, referenceId?: string) {
    const [transaction] = await Promise.all([
      this.prisma.xpTransaction.create({
        data: { userId, amount, reason, referenceId },
      }),
      this.prisma.profile.update({
        where: { userId },
        data: { xp: { increment: amount } },
      }),
    ]);
    this.logger.log(`Awarded ${amount} XP to user ${userId} for ${reason}`);
    return transaction;
  }

  async getHistory(userId: string, days?: number) {
    const where: any = { userId };
    if (days) {
      const since = new Date();
      since.setDate(since.getDate() - days);
      where.createdAt = { gte: since };
    }
    return this.prisma.xpTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTotalXp(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { xp: true, level: true },
    });
    return profile ?? { xp: 0, level: 1 };
  }

  async getLevel(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { level: true, xp: true },
    });
    if (!profile) return { level: 1, xp: 0, xpForNext: 100, progress: 0 };

    const xpForNext = this.xpRequiredForLevel(profile.level + 1);
    const xpForCurrent = this.xpRequiredForLevel(profile.level);
    const progress = xpForNext - xpForCurrent > 0
      ? (profile.xp - xpForCurrent) / (xpForNext - xpForCurrent)
      : 0;

    return {
      level: profile.level,
      xp: profile.xp,
      xpForNext,
      progress: Math.min(Math.max(progress, 0), 1),
    };
  }

  xpRequiredForLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }
}
