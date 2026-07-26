import { IsOptional, IsString, IsObject, IsEnum } from 'class-validator';

export enum ConversationDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export class StartConversationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsEnum(ConversationDifficulty)
  difficulty?: ConversationDifficulty;

  @IsOptional()
  @IsObject()
  context?: Record<string, any>;

  @IsOptional()
  @IsString()
  initialMessage?: string;
}
