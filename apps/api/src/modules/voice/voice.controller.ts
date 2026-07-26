import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('voice')
export class VoiceController {
  constructor(private voiceService: VoiceService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Audio file is required');
    return this.voiceService.uploadAudio(userId, file);
  }

  @Post('analyze')
  async analyze(
    @CurrentUser('id') userId: string,
    @Body() data: { recordingId: string },
  ) {
    if (!data.recordingId) throw new BadRequestException('recordingId is required');
    return this.voiceService.analyzeAudio(userId, data.recordingId);
  }
}
