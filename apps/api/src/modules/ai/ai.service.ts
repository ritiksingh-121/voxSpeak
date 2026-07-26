import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from './llm.service';
import { PrismaService } from '../../prisma/prisma.service';
import { conversationPrompt } from './prompts/conversation.prompt';
import { grammarPrompt } from './prompts/grammar.prompt';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private llm: LlmService,
    private prisma: PrismaService,
  ) {}

  async generateResponse(userId: string, conversationId: string, userMessage: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });

    if (!conversation) throw new Error('Conversation not found');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    const messages = conversation.messages.reverse();
    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    const systemPrompt = conversationPrompt({
      userName: user?.name || 'Student',
      difficulty: user?.profile?.proficiencyLevel || 'beginner',
      topic: conversation.topic || undefined,
      nativeLanguage: user?.profile?.nativeLanguage || 'unknown',
      proficiency: user?.profile?.proficiencyLevel || 'beginner',
    });

    const response = await this.llm.chat(systemPrompt, history, userMessage);

    const grammarCheck = await this.llm.chat(
      grammarPrompt(),
      history,
      userMessage,
      true,
    );

    let parsedGrammar: any = {};
    try {
      parsedGrammar = JSON.parse(grammarCheck);
    } catch {
      parsedGrammar = { corrections: [], suggestions: [] };
    }

    await this.recordMistakes(userId, parsedGrammar);

    return {
      content: response,
      metadata: {
        grammar: parsedGrammar,
        model: 'llama3',
      },
    };
  }

  async generateFeedback(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!conversation) throw new Error('Conversation not found');

    const text = conversation.messages.map((m) => `${m.role}: ${m.content}`).join('\n');

    const feedbackPrompt = `You are an English teacher. Analyze this conversation and provide detailed feedback on:
1. Grammar mistakes
2. Vocabulary usage
3. Pronunciation notes
4. Overall fluency score (0-100)
5. Suggestions for improvement

Conversation:
${text}

Provide feedback as a JSON object with keys: grammarMistakes, vocabularyScore, fluencyScore, suggestions, strengths.`;

    const feedback = await this.llm.chatSimple(feedbackPrompt);

    let parsedFeedback: any = {};
    try {
      const cleaned = feedback.replace(/```(json)?\n?/g, '').trim();
      parsedFeedback = JSON.parse(cleaned);
    } catch {
      parsedFeedback = { rawFeedback: feedback };
    }

    const saved = await this.prisma.conversationFeedback.create({
      data: {
        conversationId,
        userId,
        overallScore: parsedFeedback.fluencyScore || 0,
        pronunciationAvg: parsedFeedback.pronunciationAvg || null,
        grammarScore: parsedFeedback.grammarScore || null,
        vocabularyScore: parsedFeedback.vocabularyScore || null,
        fluencyScore: parsedFeedback.fluencyScore || null,
        strengths: JSON.stringify(parsedFeedback.strengths || []),
        weakAreas: JSON.stringify(parsedFeedback.weakAreas || []),
        suggestions: parsedFeedback.suggestions || null,
      },
    });

    return saved;
  }

  private async recordMistakes(userId: string, grammar: any) {
    if (!grammar?.corrections) return;

    for (const correction of grammar.corrections) {
      if (!correction?.word) continue;

      const word = correction.word.toLowerCase();
      const existing = await this.prisma.mistake.findFirst({
        where: { userId, original: word, type: 'grammar' },
      });

      if (existing) {
        await this.prisma.mistake.update({
          where: { id: existing.id },
          data: { count: { increment: 1 } },
        });
      } else {
        await this.prisma.mistake.create({
          data: {
            userId,
            type: 'grammar',
            original: word,
            correction: correction.correct || '',
            category: correction.type || 'grammar',
            count: 1,
          },
        });
      }
    }
  }
}
