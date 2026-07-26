import { Module } from '@nestjs/common';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';
import { VoiceProcessor } from './voice.processor';
import { StorageModule } from '../../storage/storage.module';
import { QueueModule } from '../../queue/queue.module';

@Module({
  imports: [StorageModule, QueueModule],
  controllers: [VoiceController],
  providers: [VoiceService, VoiceProcessor],
  exports: [VoiceService],
})
export class VoiceModule {}
