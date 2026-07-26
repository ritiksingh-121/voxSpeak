import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { AppConfigService } from '../config/config.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (config: AppConfigService) => ({
        connection: {
          host: config.redisHost,
          port: config.redisPort,
          password: config.redisPassword || undefined,
        },
      }),
      inject: [AppConfigService],
    }),
    BullModule.registerQueue(
      { name: 'stt-queue' },
      { name: 'tts-queue' },
      { name: 'ai-queue' },
      { name: 'analysis-queue' },
      { name: 'notification-queue' },
    ),
  ],
  providers: [QueueService],
  exports: [QueueService, BullModule],
})
export class QueueModule implements OnModuleInit {
  private readonly logger = new Logger(QueueModule.name);
  onModuleInit() {
    this.logger.log('Queue module initialized with queues: stt, tts, ai, analysis, notification');
  }
}
