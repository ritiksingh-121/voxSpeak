import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard(
    @Query('period', new DefaultValuePipe('weekly')) period: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @CurrentUser('id') userId: string,
  ) {
    const topUsers = await this.leaderboardService.getTopUsers(period, limit);
    const currentUserRank = await this.leaderboardService.getUserRank(userId, period);
    return { topUsers, currentUserRank };
  }
}
