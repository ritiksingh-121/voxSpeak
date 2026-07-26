import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);

  constructor(private prisma: PrismaService) {}

  async getOverview(userId: string) {
    const [profile, conversations, feedbacks, vocabItems, mistakeCount, weakAreas] = await Promise.all([
      this.prisma.profile.findUnique({ where: { userId } }),
      this.prisma.conversation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { durationSecs: true, createdAt: true, xpEarned: true },
      }),
      this.prisma.conversationFeedback.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vocabularyItem.findMany({ where: { userId } }),
      this.prisma.mistake.count({ where: { userId, mastered: false } }),
      this.prisma.weakArea.findMany({ where: { userId }, orderBy: { score: 'asc' } }),
    ]);

    const totalSessions = conversations.length;
    const totalMinutes = Math.floor(conversations.reduce((sum, c) => sum + c.durationSecs, 0) / 60);
    const totalWords = profile?.totalWordsSpoken ?? 0;

    const avgScores = this.calculateAverageScores(feedbacks);
    const weeklyActivity = this.calculateWeeklyActivity(conversations);
    const recentMilestones = await this.getRecentMilestones(userId);
    const weakAreasList = weakAreas.slice(0, 5).map(w => ({ type: w.type, name: w.name, score: w.score }));

    return {
      totalSessions,
      totalMinutes,
      totalWords,
      averageScores: avgScores,
      weeklyActivity,
      weakAreas: weakAreasList,
      recentMilestones,
      level: profile?.level ?? 1,
      xp: profile?.xp ?? 0,
      streakDays: profile?.streakDays ?? 0,
    };
  }

  async getPronunciationStats(userId: string) {
    const feedbacks = await this.prisma.conversationFeedback.findMany({
      where: { userId, pronunciationAvg: { not: null } },
      orderBy: { createdAt: 'asc' },
      select: { pronunciationAvg: true, createdAt: true },
    });

    const scores = feedbacks.map(f => f.pronunciationAvg ?? 0);
    const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const trend = scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0;

    return {
      average: Math.round(average * 100) / 100,
      trend: Math.round(trend * 100) / 100,
      dataPoints: feedbacks.map(f => ({ date: f.createdAt, score: f.pronunciationAvg })),
      totalAssessments: feedbacks.length,
    };
  }

  async getGrammarStats(userId: string) {
    const feedbacks = await this.prisma.conversationFeedback.findMany({
      where: { userId, grammarScore: { not: null } },
      orderBy: { createdAt: 'asc' },
      select: { grammarScore: true, createdAt: true },
    });

    const mistakes = await this.prisma.mistake.groupBy({
      by: ['category'],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const scores = feedbacks.map(f => f.grammarScore ?? 0);
    const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    return {
      average: Math.round(average * 100) / 100,
      dataPoints: feedbacks.map(f => ({ date: f.createdAt, score: f.grammarScore })),
      totalAssessments: feedbacks.length,
      commonMistakes: mistakes.map(m => ({ category: m.category, count: m._count.id })),
    };
  }

  async getVocabularyStats(userId: string) {
    const items = await this.prisma.vocabularyItem.findMany({
      where: { userId },
    });

    const statusCounts = {
      learning: items.filter(i => i.status === 'learning').length,
      reviewing: items.filter(i => i.status === 'reviewing').length,
      mastered: items.filter(i => i.status === 'mastered').length,
    };

    const difficultyCounts = {
      beginner: items.filter(i => i.difficulty === 'beginner').length,
      intermediate: items.filter(i => i.difficulty === 'intermediate').length,
      advanced: items.filter(i => i.difficulty === 'advanced').length,
    };

    return {
      totalWords: items.length,
      statusCounts,
      difficultyCounts,
      averageAccuracy: items.length > 0
        ? items.reduce((sum, i) => {
            const total = i.timesCorrect + i.timesWrong;
            return sum + (total > 0 ? i.timesCorrect / total : 0);
          }, 0) / items.length
        : 0,
    };
  }

  private calculateAverageScores(feedbacks: any[]) {
    if (feedbacks.length === 0) {
      return { pronunciation: 0, grammar: 0, fluency: 0, vocabulary: 0, overall: 0 };
    }

    const sum = { pronunciation: 0, grammar: 0, fluency: 0, vocabulary: 0 };
    for (const f of feedbacks) {
      sum.pronunciation += f.pronunciationAvg ?? 0;
      sum.grammar += f.grammarScore ?? 0;
      sum.fluency += f.fluencyScore ?? 0;
      sum.vocabulary += f.vocabularyScore ?? 0;
    }

    const n = feedbacks.length;
    const avg = {
      pronunciation: Math.round((sum.pronunciation / n) * 100) / 100,
      grammar: Math.round((sum.grammar / n) * 100) / 100,
      fluency: Math.round((sum.fluency / n) * 100) / 100,
      vocabulary: Math.round((sum.vocabulary / n) * 100) / 100,
    };

    return {
      ...avg,
      overall: Math.round((avg.pronunciation + avg.grammar + avg.fluency + avg.vocabulary) / 4 * 100) / 100,
    };
  }

  private calculateWeeklyActivity(conversations: any[]) {
    const days: { date: string; sessions: number; minutes: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayConvs = conversations.filter(c => {
        const cDate = new Date(c.createdAt).toISOString().split('T')[0];
        return cDate === dateStr;
      });
      days.push({
        date: dateStr,
        sessions: dayConvs.length,
        minutes: Math.floor(dayConvs.reduce((sum, c) => sum + c.durationSecs, 0) / 60),
      });
    }
    return days;
  }

  private async getRecentMilestones(userId: string) {
    const milestones: { type: string; label: string; achievedAt: Date }[] = [];

    const achievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { id: 'desc' },
      take: 5,
    });

    for (const ua of achievements) {
      milestones.push({
        type: 'achievement',
        label: ua.achievement.title,
        achievedAt: new Date(),
      });
    }

    return milestones;
  }
}
