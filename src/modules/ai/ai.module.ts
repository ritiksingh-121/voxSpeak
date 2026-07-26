import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiProcessor } from './ai.processor';
import { LlmService } from './llm.service';
import { QueueModule } from '../../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [AiService, AiProcessor, LlmService],
  exports: [AiService, LlmService],
})
export class AiModule {}
