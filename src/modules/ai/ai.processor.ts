import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AiService } from './ai.service';

interface AiJobData {
  userId: string;
  conversationId: string;
  message: string;
  type: 'response' | 'feedback' | 'grammar';
}

@Processor('ai')
export class AiProcessor extends WorkerHost {
  private readonly logger = new Logger(AiProcessor.name);

  constructor(private aiService: AiService) {
    super();
  }

  async process(job: Job<AiJobData>): Promise<any> {
    const { userId, conversationId, message, type } = job.data;
    this.logger.log(`Processing AI job ${job.id} type=${type}`);

    try {
      switch (type) {
        case 'response':
          return this.aiService.generateResponse(userId, conversationId, message);
        case 'feedback':
          return this.aiService.generateFeedback(userId, conversationId);
        case 'grammar':
          return this.aiService.generateResponse(userId, conversationId, message);
        default:
          throw new Error(`Unknown AI job type: ${type}`);
      }
    } catch (error: any) {
      this.logger.error(`AI job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}
