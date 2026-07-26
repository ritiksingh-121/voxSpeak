import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { VoiceModule } from './modules/voice/voice.module';
import { AiModule } from './modules/ai/ai.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { ProgressModule } from './modules/progress/progress.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { QueueModule } from './queue/queue.module';
import { StorageModule } from './storage/storage.module';
import { SearchModule } from './search/search.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppConfigModule,
    AuthModule,
    UsersModule,
    ConversationsModule,
    VoiceModule,
    AiModule,
    VocabularyModule,
    ProgressModule,
    GamificationModule,
    NotificationsModule,
    SubscriptionModule,
    QueueModule,
    StorageModule,
    SearchModule,
    PrismaModule,
  ],
})
export class AppModule {}
