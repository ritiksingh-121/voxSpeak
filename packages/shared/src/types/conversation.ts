export enum PracticeMode {
  Free = "free",
  Guided = "guided",
  Roleplay = "roleplay",
  Exam = "exam",
  Pronunciation = "pronunciation",
}

export interface Conversation {
  id: string
  userId: string
  title?: string | null
  mode: string
  topic?: string | null
  status: string
  messageCount: number
  durationSecs: number
  xpEarned: number
  createdAt: string
  updatedAt: string
  messages?: Message[]
  feedback?: ConversationFeedback | null
}

export interface Message {
  id: string
  conversationId: string
  role: string
  content: string
  type?: string | null
  audioUrl?: string | null
  durationMs?: number | null
  pronunciationScore?: number | null
  grammarIssues?: Record<string, unknown> | null
  vocabularySuggestions?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  createdAt?: string
}

export interface ConversationFeedback {
  id: string
  conversationId: string
  userId: string
  overallScore?: number | null
  pronunciationAvg?: number | null
  grammarScore?: number | null
  vocabularyScore?: number | null
  fluencyScore?: number | null
  confidenceScore?: number | null
  strengths: string[]
  weakAreas: string[]
  suggestions?: string | null
  aiNotes?: Record<string, unknown> | null
}

export interface Correction {
  original: string
  corrected: string
  explanation?: string
  category?: string
}
