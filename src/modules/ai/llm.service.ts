import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private client: AxiosInstance;

  constructor(private config: AppConfigService) {
    this.client = axios.create({
      baseURL: this.config.ollamaUrl,
      timeout: 60000,
    });
  }

  async chat(systemPrompt: string, history: { role: string; content: string }[], userMessage: string, quick: boolean = false): Promise<string> {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map((h) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await this.client.post('/api/chat', {
        model: quick ? 'llama3:8b' : this.config.ollamaModel,
        messages,
        stream: false,
        options: {
          temperature: quick ? 0.3 : 0.7,
          top_p: 0.9,
        },
      });

      return response.data.message?.content || '';
    } catch (error: any) {
      this.logger.error(`Ollama chat failed: ${error.message}`);
      throw new Error(`AI service unavailable: ${error.message}`);
    }
  }

  async chatSimple(prompt: string): Promise<string> {
    try {
      const response = await this.client.post('/api/chat', {
        model: this.config.ollamaModel,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      });

      return response.data.message?.content || '';
    } catch (error: any) {
      this.logger.error(`Ollama simple chat failed: ${error.message}`);
      throw new Error(`AI service unavailable: ${error.message}`);
    }
  }

  async chatStream(
    systemPrompt: string,
    messages: { role: string; content: string }[],
    onToken: (token: string) => void,
  ): Promise<void> {
    try {
      const response = await this.client.post(
        '/api/chat',
        {
          model: this.config.ollamaModel,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          stream: true,
        },
        { responseType: 'stream' },
      );

      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              onToken(parsed.message.content);
            }
          } catch {}
        }
      });
    } catch (error: any) {
      this.logger.error(`Ollama stream failed: ${error.message}`);
      throw new Error(`AI streaming unavailable: ${error.message}`);
    }
  }
}
