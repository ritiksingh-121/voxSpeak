import { Controller, Get } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('overview')
  async getOverview(@CurrentUser('id') userId: string) {
    return this.progressService.getOverview(userId);
  }

  @Get('pronunciation')
  async getPronunciation(@CurrentUser('id') userId: string) {
    return this.progressService.getPronunciationStats(userId);
  }

  @Get('grammar')
  async getGrammar(@CurrentUser('id') userId: string) {
    return this.progressService.getGrammarStats(userId);
  }

  @Get('vocabulary')
  async getVocabulary(@CurrentUser('id') userId: string) {
    return this.progressService.getVocabularyStats(userId);
  }
}
