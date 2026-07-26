import { IsString, IsOptional, ValidateIf } from 'class-validator';

export class SendMessageDto {
  @ValidateIf(o => !o.audioUrl)
  @IsString()
  content?: string;

  @ValidateIf(o => !o.content)
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
