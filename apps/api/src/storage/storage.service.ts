import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private client: Minio.Client;

  constructor(private config: AppConfigService) {
    this.client = new Minio.Client({
      endPoint: config.minioEndpoint,
      port: config.minioPort,
      useSSL: config.minioUseSsl,
      accessKey: config.minioAccessKey,
      secretKey: config.minioSecretKey,
    });
  }

  async onModuleInit() {
    try {
      await this.ensureBucket(this.config.minioBucket);
      this.logger.log(`Storage service initialized, bucket: ${this.config.minioBucket}`);
    } catch (err) {
      this.logger.warn(`Failed to initialize storage bucket: ${err}`);
    }
  }

  async uploadBuffer(bucket: string, key: string, buffer: Buffer, contentType?: string) {
    await this.ensureBucket(bucket);
    const metaData: Record<string, string> = {};
    if (contentType) metaData['Content-Type'] = contentType;

    return new Promise<string>((resolve, reject) => {
      this.client.putObject(bucket, key, buffer, buffer.length, metaData, (err) => {
        if (err) {
          this.logger.error(`Failed to upload ${key} to ${bucket}: ${err.message}`);
          reject(err);
        } else {
          this.logger.log(`Uploaded ${key} to ${bucket}`);
          resolve(key);
        }
      });
    });
  }

  async getFileUrl(bucket: string, key: string): Promise<string> {
    const exists = await this.client.bucketExists(bucket);
    if (!exists) throw new Error(`Bucket ${bucket} does not exist`);

    return new Promise((resolve, reject) => {
      this.client.presignedGetObject(bucket, key, 24 * 60 * 60, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });
  }

  async deleteFile(bucket: string, key: string) {
    await this.client.removeObject(bucket, key);
    this.logger.log(`Deleted ${key} from ${bucket}`);
  }

  async ensureBucket(bucketName: string) {
    const exists = await this.client.bucketExists(bucketName);
    if (!exists) {
      await this.client.makeBucket(bucketName, 'us-east-1');
      this.logger.log(`Created bucket: ${bucketName}`);
    }
  }
}
