import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);
  private readonly redis: Redis;
  private readonly weeklyKey = 'leaderboard:weekly';
  private readonly monthlyKey = 'leaderboard:monthly';
  private readonly allTimeKey = 'leaderboard:alltime';

  constructor(private config: AppConfigService) {
    this.redis = new Redis({
      host: config.redisHost,
      port: config.redisPort,
      password: config.redisPassword || undefined,
    });
  }

  private getKey(period: string): string {
    switch (period) {
      case 'weekly': return this.weeklyKey;
      case 'monthly': return this.monthlyKey;
      default: return this.allTimeKey;
    }
  }

  async addScore(userId: string, xp: number) {
    const now = Date.now();
    const weekStart = this.getWeekStart();
    const monthStart = this.getMonthStart();

    await Promise.all([
      this.redis.zadd(this.allTimeKey, xp, userId),
      this.redis.zadd(`${this.weeklyKey}:${weekStart}`, xp, userId),
      this.redis.zadd(`${this.monthlyKey}:${monthStart}`, xp, userId),
    ]);

    await Promise.all([
      this.redis.expire(`${this.weeklyKey}:${weekStart}`, 7 * 24 * 60 * 60),
      this.redis.expire(`${this.monthlyKey}:${monthStart}`, 31 * 24 * 60 * 60),
    ]);
  }

  async getTopUsers(period: string, limit: number = 10) {
    const key = this.getKey(period);
    if (period === 'weekly') {
      const weekStart = this.getWeekStart();
      const result = await this.redis.zrevrange(`${this.weeklyKey}:${weekStart}`, 0, limit - 1, 'WITHSCORES');
      return this.formatResults(result, PeriodType.Weekly);
    }
    if (period === 'monthly') {
      const monthStart = this.getMonthStart();
      const result = await this.redis.zrevrange(`${this.monthlyKey}:${monthStart}`, 0, limit - 1, 'WITHSCORES');
      return this.formatResults(result, PeriodType.Monthly);
    }
    const result = await this.redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');
    return this.formatResults(result, PeriodType.AllTime);
  }

  async getUserRank(userId: string, period: string) {
    const key = period === 'weekly'
      ? `${this.weeklyKey}:${this.getWeekStart()}`
      : period === 'monthly'
        ? `${this.monthlyKey}:${this.getMonthStart()}`
        : this.allTimeKey;

    const [rank, score] = await Promise.all([
      this.redis.zrevrank(key, userId),
      this.redis.zscore(key, userId),
    ]);

    return {
      userId,
      rank: rank !== null ? rank + 1 : null,
      score: score ? Number(score) : 0,
      period,
    };
  }

  private formatResults(data: string[], type: PeriodType) {
    const results = [];
    for (let i = 0; i < data.length; i += 2) {
      results.push({
        userId: data[i],
        score: Number(data[i + 1]),
        rank: (i / 2) + 1,
        period: type,
      });
    }
    return results;
  }

  private getWeekStart(): string {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
  }

  private getMonthStart(): string {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    return first.toISOString().split('T')[0];
  }
}

enum PeriodType {
  Weekly = 'weekly',
  Monthly = 'monthly',
  AllTime = 'all',
}
