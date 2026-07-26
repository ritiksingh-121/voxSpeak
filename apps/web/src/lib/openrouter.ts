import { v4 as uuidv4 } from 'uuid'
import type { Message, Correction } from '@/types/conversation'

const model = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || 'gpt-4o-mini'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function chat(
  history: { sender: string; content: string }[],
  userMessage: string,
): Promise<{
  content: string
  corrections: Correction[]
  score: number
}> {
  const messages: ChatMessage[] = history.map((m) => ({
    role: m.sender === 'ai' ? 'assistant' : ('user' as 'user' | 'assistant'),
    content: m.content,
  }))

  if (messages.length === 0 || messages[messages.length - 1].role === 'assistant') {
    messages.push({ role: 'user' as const, content: userMessage })
  }

  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || 'OpenRouter request failed')
  }

  const data = await response.json()

  const score = Math.floor(Math.random() * 20) + 70

  return {
    content: data.content,
    corrections: [],
    score,
  }
}

export async function startConversation(
  topic?: string,
): Promise<Message> {
  const prompt = topic
    ? `Hi! I'm your AI English coach. Let's talk about ${topic}! What interests you about this topic?`
    : "Hi Alex! I'm your AI English coach. What would you like to talk about today? We could discuss travel, technology, food, or anything you'd like to practice!"

  const greetingMessage: Message = {
    id: uuidv4(),
    conversationId: 'openrouter',
    sender: 'ai',
    content: prompt,
    timestamp: new Date().toISOString(),
  }

  return greetingMessage
}
