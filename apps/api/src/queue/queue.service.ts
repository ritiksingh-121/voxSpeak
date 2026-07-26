import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('stt-queue') private sttQueue: Queue,
    @InjectQueue('tts-queue') private ttsQueue: Queue,
    @InjectQueue('ai-queue') private aiQueue: Queue,
    @InjectQueue('analysis-queue') private analysisQueue: Queue,
    @InjectQueue('notification-queue') private notificationQueue: Queue,
  ) {}

  async addSttJob(audioBuffer: Buffer, metadata?: Record<string, any>) {
    const job = await this.sttQueue.add('transcribe', {
      audioBuffer: audioBuffer.toString('base64'),
      metadata,
    });
    this.logger.log(`STT job ${job.id} added`);
    return job;
  }

  async addTtsJob(text: string, voice?: string, metadata?: Record<string, any>) {
    const job = await this.ttsQueue.add('synthesize', {
      text,
      voice: voice || 'en-US-Neural2-D',
      metadata,
    });
    this.logger.log(`TTS job ${job.id} added`);
    return job;
  }

  async addAiJob(prompt: string, context?: any, metadata?: Record<string, any>) {
    const job = await this.aiQueue.add('process', {
      prompt,
      context,
      metadata,
    });
    this.logger.log(`AI job ${job.id} added`);
    return job;
  }

  async addAnalysisJob(conversationId: string, metadata?: Record<string, any>) {
    const job = await this.analysisQueue.add('analyze', {
      conversationId,
      metadata,
    });
    this.logger.log(`Analysis job ${job.id} added for conversation ${conversationId}`);
    return job;
  }

  async addNotificationJob(userId: string, notification: { type: string; title: string; body?: string; data?: any }) {
    const job = await this.notificationQueue.add('send', {
      userId,
      notification,
    });
    this.logger.log(`Notification job ${job.id} added for user ${userId}`);
    return job;
  }
}
