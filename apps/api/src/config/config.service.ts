import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get<number>('PORT', 3001));
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'voxspeak-dev-secret');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '7d');
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d');
  }

  get googleClientId(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_ID', '');
  }

  get googleClientSecret(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_SECRET', '');
  }

  get githubClientId(): string {
    return this.configService.get<string>('GITHUB_CLIENT_ID', '');
  }

  get githubClientSecret(): string {
    return this.configService.get<string>('GITHUB_CLIENT_SECRET', '');
  }

  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    return Number(this.configService.get<number>('REDIS_PORT', 6379));
  }

  get redisPassword(): string {
    return this.configService.get<string>('REDIS_PASSWORD', '');
  }

  get minioEndpoint(): string {
    return this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
  }

  get minioPort(): number {
    return Number(this.configService.get<number>('MINIO_PORT', 9000));
  }

  get minioAccessKey(): string {
    return this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
  }

  get minioSecretKey(): string {
    return this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin');
  }

  get minioBucket(): string {
    return this.configService.get<string>('MINIO_BUCKET', 'voxspeak');
  }

  get minioUseSsl(): boolean {
    return this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
  }

  get qdrantUrl(): string {
    return this.configService.get<string>('QDRANT_URL', 'http://localhost:6333');
  }

  get qdrantApiKey(): string {
    return this.configService.get<string>('QDRANT_API_KEY', '');
  }

  get ollamaUrl(): string {
    return this.configService.get<string>('OLLAMA_URL', 'http://localhost:11434');
  }

  get ollamaModel(): string {
    return this.configService.get<string>('OLLAMA_MODEL', 'llama3');
  }

  get corsOrigin(): string[] {
    const origin = this.configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
    return origin.split(',').map((o) => o.trim());
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/voxspeak');
  }
}
