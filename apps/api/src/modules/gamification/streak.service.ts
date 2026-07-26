import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StreakService {
  private readonly logger = new Logger(StreakService.name);

  constructor(private prisma: PrismaService) {}

  async updateStreak(userId: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let streak = await this.prisma.streak.findUnique({ where: { userId } });
    if (!streak) {
      streak = await this.prisma.streak.create({
        data: { userId, currentCount: 1, longestCount: 1, lastActivity: today, frozenDays: 0 },
      });
      await this.updateProfileStreak(userId, 1, 1);
      return streak;
    }

    const lastActivity = streak.lastActivity ? new Date(streak.lastActivity) : null;
    const lastDate = lastActivity ? new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate()) : null;

    if (lastDate && lastDate.getTime() === today.getTime()) {
      return streak;
    }

    const diffDays = lastDate ? Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : 1;

    if (diffDays === 1) {
      const newCount = streak.currentCount + 1;
      const longest = Math.max(newCount, streak.longestCount);
      streak = await this.prisma.streak.update({
        where: { userId },
        data: { currentCount: newCount, longestCount: longest, lastActivity: today },
      });
      await this.updateProfileStreak(userId, newCount, longest);
    } else if (diffDays === 2 && streak.frozenDays > 0) {
      await this.prisma.streak.update({
        where: { userId },
        data: { frozenDays: { decrement: 1 }, lastActivity: today },
      });
    } else if (diffDays > 1) {
      streak = await this.prisma.streak.update({
        where: { userId },
        data: { currentCount: 1, lastActivity: today },
      });
      await this.updateProfileStreak(userId, 1, streak.longestCount);
    }

    return streak;
  }

  async getStreak(userId: string) {
    const streak = await this.prisma.streak.findUnique({ where: { userId } });
    const hasActivityToday = await this.hasCompletedToday(userId);
    return {
      currentCount: streak?.currentCount ?? 0,
      longestCount: streak?.longestCount ?? 0,
      frozenDays: streak?.frozenDays ?? 0,
      lastActivity: streak?.lastActivity ?? null,
      hasActivityToday,
    };
  }

  async freezeStreak(userId: string) {
    const streak = await this.prisma.streak.findUnique({ where: { userId } });
    if (!streak) throw new Error('No streak to freeze');
    return this.prisma.streak.update({
      where: { userId },
      data: { frozenDays: { increment: 1 } },
    });
  }

  async hasCompletedToday(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await this.prisma.conversation.count({
      where: { userId, createdAt: { gte: today } },
    });
    return count > 0;
  }

  private async updateProfileStreak(userId: string, currentCount: number, longestCount: number) {
    await this.prisma.profile.update({
      where: { userId },
      data: { streakDays: currentCount, longestStreak: longestCount },
    });
  }
}
