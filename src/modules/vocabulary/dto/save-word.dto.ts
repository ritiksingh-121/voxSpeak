import { IsString, IsOptional, MinLength } from 'class-validator';

export class SaveWordDto {
  @IsString()
  @MinLength(1)
  word: string;

  @IsOptional()
  @IsString()
  definition?: string;

  @IsOptional()
  @IsString()
  exampleSentence?: string;

  @IsOptional()
  @IsString()
  context?: string;
}
