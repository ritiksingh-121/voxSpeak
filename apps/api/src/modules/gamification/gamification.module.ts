import { Module } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { XpService } from './xp.service';
import { AchievementService } from './achievement.service';
import { StreakService } from './streak.service';

@Module({
  providers: [GamificationService, XpService, AchievementService, StreakService],
  exports: [GamificationService, XpService, AchievementService, StreakService],
})
export class GamificationModule {}
