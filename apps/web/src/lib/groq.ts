import type { Correction } from '@/types/conversation'

type Role = 'user' | 'assistant' | 'system'

interface GroqMessage {
  role: Role
  content: string
}

interface GroqResponse {
  content: string
  corrections: Correction[]
  score: number
}

let requestCounter = 0

export function nextRequestId(): string {
  requestCounter++
  return `req_${Date.now()}_${requestCounter}`
}

const LOG_PREFIX_GROQ = '\u{1F916}'

export async function groqChat(
  history: { sender: string; content: string }[],
  userMessage: string,
  signal?: AbortSignal,
): Promise<GroqResponse> {
  const messages: GroqMessage[] = history.map((m) => ({
    role: m.sender === 'ai' ? 'assistant' : 'user',
    content: m.content,
  }))

  const lastMsg = messages[messages.length - 1]
  if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== userMessage) {
    messages.push({ role: 'user', content: userMessage })
  } else {
    console.log(`${LOG_PREFIX_GROQ} Skipping duplicate user message (already in history)`)
  }

  console.log(`${LOG_PREFIX_GROQ} LLM Payload:`, {
    messageCount: messages.length,
    lastRole: messages[messages.length - 1]?.role,
    lastContentPreview: messages[messages.length - 1]?.content?.slice(0, 80),
    provider: 'Groq',
  })

  console.log(`${LOG_PREFIX_GROQ} \u2705 Request Started`)
  const startTime = Date.now()

  const response = await fetch('/api/ai/groq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Groq request failed' }))
    console.error(`${LOG_PREFIX_GROQ} \u274C Request Failed:`, err)
    throw new Error(err.error || `Groq request failed (${response.status})`)
  }

  const data = await response.json()
  const score = Math.floor(Math.random() * 20) + 70
  const elapsed = Date.now() - startTime

  console.log(`${LOG_PREFIX_GROQ} \u2705 Request Completed in ${elapsed}ms`)
  console.log(`${LOG_PREFIX_GROQ} \u2705 AI Response: "${data.content?.slice(0, 120)}..."`)

  return {
    content: data.content,
    corrections: [],
    score,
  }
}
