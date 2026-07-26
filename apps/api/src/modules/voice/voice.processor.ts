import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { VoiceService } from './voice.service';
import axios from 'axios';

interface SttJobData {
  recordingId: string;
  fileUrl: string;
  userId: string;
}

@Processor('stt')
export class VoiceProcessor extends WorkerHost {
  private readonly logger = new Logger(VoiceProcessor.name);

  constructor(private voiceService: VoiceService) {
    super();
  }

  async process(job: Job<SttJobData>): Promise<void> {
    const { recordingId, fileUrl } = job.data;
    this.logger.log(`Processing STT for recording ${recordingId}`);

    try {
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
      const response = await axios.post(`${ollamaUrl}/api/transcribe`, {
        url: fileUrl,
        model: 'whisper',
      });

      const transcription = response.data.text || '';
      const confidence = response.data.confidence || 0;
      const duration = response.data.duration || 0;

      await this.voiceService.updateTranscription(
        recordingId,
        transcription,
        confidence,
        duration,
        { source: 'ollama-whisper', model: 'whisper' },
      );

      this.logger.log(`STT completed for recording ${recordingId}`);
    } catch (error: any) {
      this.logger.error(`STT failed for recording ${recordingId}: ${error.message}`);
      throw error;
    }
  }
}
