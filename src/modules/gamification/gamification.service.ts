import { Injectable, Logger } from '@nestjs/common';
import { XpService } from './xp.service';
import { AchievementService } from './achievement.service';
import { StreakService } from './streak.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private xpService: XpService,
    private achievementService: AchievementService,
    private streakService: StreakService,
    private prisma: PrismaService,
  ) {}

  async awardXp(userId: string, amount: number, reason: string) {
    const transaction = await this.xpService.addTransaction(userId, amount, reason);
    const levelInfo = await this.xpService.getLevel(userId);
    const newlyUnlocked = await this.achievementService.check(userId);
    const streak = await this.streakService.updateStreak(userId);

    return { transaction, levelInfo, newlyUnlocked, streak };
  }

  async checkAchievements(userId: string) {
    return this.achievementService.check(userId);
  }

  async getDailyMissions() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const missions = await this.prisma.dailyMission.findMany({
      where: { date: { gte: today, lt: tomorrow } },
    });

    if (missions.length === 0) {
      const defaultMissions = [
        { date: today, title: 'Daily Practice', description: 'Complete one conversation', xpReward: 50, type: 'daily' },
        { date: today, title: 'Vocabulary Builder', description: 'Save 3 new words', xpReward: 30, type: 'daily' },
        { date: today, title: 'Pronunciation Focus', description: 'Complete a pronunciation exercise', xpReward: 40, type: 'daily' },
      ];
      for (const m of defaultMissions) {
        await this.prisma.dailyMission.create({ data: m });
      }
      return defaultMissions;
    }

    return missions;
  }

  async completeMission(userId: string, missionId: string) {
    const mission = await this.prisma.dailyMission.findUnique({ where: { id: missionId } });
    if (!mission) throw new Error('Mission not found');

    await this.xpService.addTransaction(userId, mission.xpReward, `Mission: ${mission.title}`);

    return { mission, xpAwarded: mission.xpReward };
  }
}
