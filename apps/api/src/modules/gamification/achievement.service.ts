import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface AchievementDef {
  code: string;
  title: string;
  description: string;
  xpReward: number;
  rarity: string;
  iconUrl?: string;
}

@Injectable()
export class AchievementService {
  private readonly logger = new Logger(AchievementService.name);

  private readonly achievements: AchievementDef[] = [
    { code: 'FirstSteps', title: 'First Steps', description: 'Complete your first conversation', xpReward: 50, rarity: 'common', iconUrl: '/icons/achievements/first-steps.svg' },
    { code: 'Chatterbox', title: 'Chatterbox', description: 'Send 100 messages in conversations', xpReward: 100, rarity: 'common' },
    { code: 'StreakMaster', title: 'Streak Master', description: 'Maintain a 7-day streak', xpReward: 200, rarity: 'rare' },
    { code: 'WordCollector', title: 'Word Collector', description: 'Save 50 vocabulary words', xpReward: 150, rarity: 'uncommon' },
    { code: 'PerfectPronunciation', title: 'Perfect Pronunciation', description: 'Achieve 90%+ pronunciation score in 10 conversations', xpReward: 300, rarity: 'rare' },
    { code: 'GrammarGuru', title: 'Grammar Guru', description: 'Complete 20 conversations with grammar score above 80%', xpReward: 250, rarity: 'uncommon' },
    { code: 'Polyglot', title: 'Polyglot', description: 'Learn 200 vocabulary words', xpReward: 500, rarity: 'epic' },
    { code: 'InterviewAce', title: 'Interview Ace', description: 'Complete 5 mock interview sessions', xpReward: 400, rarity: 'epic' },
    { code: 'Centurion', title: 'Centurion', description: 'Complete 100 conversations', xpReward: 1000, rarity: 'legendary' },
    { code: 'DedicatedLearner', title: 'Dedicated Learner', description: 'Practice for 30 days straight', xpReward: 750, rarity: 'legendary' },
  ];

  constructor(private prisma: PrismaService) {}

  async listAll() {
    return this.achievements;
  }

  async check(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) return [];

    const [conversationCount, messageCount, vocabCount, streak, feedbacks] = await Promise.all([
      this.prisma.conversation.count({ where: { userId } }),
      this.prisma.message.count({ where: { conversation: { userId } } }),
      this.prisma.vocabularyItem.count({ where: { userId } }),
      this.prisma.streak.findUnique({ where: { userId } }),
      this.prisma.conversationFeedback.findMany({ where: { userId } }),
    ]);

    const highPronFeedbacks = feedbacks.filter(f => (f.pronunciationAvg ?? 0) >= 90);
    const highGrammarFeedbacks = feedbacks.filter(f => (f.grammarScore ?? 0) >= 80);
    const interviewConversations = await this.prisma.conversation.count({
      where: { userId, mode: 'interview' },
    });

    const streakCount = streak?.currentCount ?? 0;
    const unlocked = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });
    const unlockedCodes = new Set(unlocked.map(u => u.achievement.code));

    const newlyUnlocked: string[] = [];

    const checks: [string, () => boolean][] = [
      ['FirstSteps', () => conversationCount >= 1],
      ['Chatterbox', () => messageCount >= 100],
      ['StreakMaster', () => streakCount >= 7],
      ['WordCollector', () => vocabCount >= 50],
      ['PerfectPronunciation', () => highPronFeedbacks.length >= 10],
      ['GrammarGuru', () => highGrammarFeedbacks.length >= 20],
      ['Polyglot', () => vocabCount >= 200],
      ['InterviewAce', () => interviewConversations >= 5],
      ['Centurion', () => conversationCount >= 100],
      ['DedicatedLearner', () => streakCount >= 30],
    ];

    for (const [code, predicate] of checks) {
      if (!unlockedCodes.has(code) && predicate()) {
        await this.unlock(userId, code);
        newlyUnlocked.push(code);
      }
    }

    return newlyUnlocked;
  }

  async unlock(userId: string, achievementCode: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { code: achievementCode },
    });
    if (!achievement) {
      this.logger.warn(`Achievement ${achievementCode} not found in DB, will create`);
      const def = this.achievements.find(a => a.code === achievementCode);
      if (!def) throw new Error(`Unknown achievement code: ${achievementCode}`);
      const created = await this.prisma.achievement.create({
        data: {
          code: def.code,
          title: def.title,
          description: def.description,
          xpReward: def.xpReward,
          rarity: def.rarity,
          iconUrl: def.iconUrl,
        },
      });
      await this.prisma.userAchievement.create({
        data: { userId, achievementId: created.id },
      });
      await this.prisma.xpTransaction.create({
        data: { userId, amount: created.xpReward, reason: `Achievement: ${created.title}` },
      });
      await this.prisma.profile.update({
        where: { userId },
        data: { xp: { increment: created.xpReward } },
      });
      return created;
    }

    const existing = await this.prisma.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
    });
    if (existing) return achievement;

    await this.prisma.userAchievement.create({
      data: { userId, achievementId: achievement.id },
    });
    await this.prisma.xpTransaction.create({
      data: { userId, amount: achievement.xpReward, reason: `Achievement: ${achievement.title}` },
    });
    await this.prisma.profile.update({
      where: { userId },
      data: { xp: { increment: achievement.xpReward } },
    });

    this.logger.log(`User ${userId} unlocked achievement: ${achievement.title}`);
    return achievement;
  }
}
