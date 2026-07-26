export type MessageSender = 'user' | 'ai'
export type InputMode = 'voice' | 'text'

export interface Message {
  id: string
  conversationId: string
  sender: MessageSender
  content: string
  audioUrl?: string
  corrections?: Correction[]
  feedback?: MessageFeedback
  timestamp: string
  isLoading?: boolean
}

export interface Correction {
  id: string
  originalText: string
  correctedText: string
  type: 'grammar' | 'pronunciation' | 'vocabulary' | 'fluency'
  explanation: string
  startIndex: number
  endIndex: number
  severity: 'low' | 'medium' | 'high'
}

export interface MessageFeedback {
  pronunciationScore?: number
  grammarScore?: number
  fluencyScore?: number
  vocabularyScore?: number
  overallScore: number
  suggestions: string[]
  strengths: string[]
}

export interface Conversation {
  id: string
  userId: string
  title: string
  topic?: string
  scenario?: string
  lastMessage?: string
  messageCount: number
  duration?: number
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface ConversationFeedback {
  id: string
  conversationId: string
  overallScore: number
  pronunciationScore: number
  grammarScore: number
  vocabularyScore: number
  fluencyScore: number
  strengths: string[]
  weakAreas: {
    category: string
    description: string
    examples: { original: string; corrected: string }[]
  }[]
  suggestedTopics: string[]
  tips: string[]
}

export interface StartConversationRequest {
  topic?: string
  scenario?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface SendMessageRequest {
  conversationId: string
  content: string
  audioBlob?: Blob
}

export interface TypingStatus {
  conversationId: string
  isTyping: boolean
}
