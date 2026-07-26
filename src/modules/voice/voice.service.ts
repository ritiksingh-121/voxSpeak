import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../storage/storage.service';
import { QueueService } from '../../queue/queue.service';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private queue: QueueService,
  ) {}

  async uploadAudio(userId: string, file: Express.Multer.File) {
    const key = `recordings/${userId}/${Date.now()}-${file.originalname}`;

    const recording = await this.prisma.voiceRecording.create({
      data: {
        userId,
        filePath: key,
        format: file.mimetype?.split('/')[1] || 'webm',
        durationMs: 0,
        fileSizeBytes: file.size,
      },
    });

    return recording;
  }

  async analyzeAudio(userId: string, recordingId: string) {
    const recording = await this.prisma.voiceRecording.findUnique({
      where: { id: recordingId },
    });

    if (!recording) throw new NotFoundException('Recording not found');
    if (recording.userId !== userId) throw new NotFoundException('Recording not found');

    if (!recording.transcript) {
      throw new NotFoundException('Transcription not ready');
    }

    return {
      transcription: recording.transcript,
      duration: recording.durationMs,
    };
  }

  async updateTranscription(
    recordingId: string,
    transcription: string,
    _confidence: number,
    _duration: number,
    _analysis?: any,
  ) {
    await this.prisma.voiceRecording.update({
      where: { id: recordingId },
      data: {
        transcript: transcription,
        durationMs: _duration,
      },
    });
  }
}
