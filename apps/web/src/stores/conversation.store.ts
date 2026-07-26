import { create } from 'zustand'
import { Message, InputMode, ConversationFeedback, Conversation } from '@/types/conversation'
import { Score } from '@/types/progress'

interface ConversationState {
  conversations: Map<string, { title: string; lastMessage?: string; updatedAt: string }>
  currentConversationId: string | null
  messages: Message[]
  isRecording: boolean
  isAIThinking: boolean
  inputMode: InputMode
  feedback: ConversationFeedback | null
  liveScore: Score | null
  error: string | null
  audioLevel: number
}

interface ConversationActions {
  setCurrentConversation: (id: string | null) => void
  addMessage: (message: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  setMessages: (messages: Message[]) => void
  appendMessages: (messages: Message[]) => void
  setIsRecording: (isRecording: boolean) => void
  setIsAIThinking: (isAIThinking: boolean) => void
  setInputMode: (mode: InputMode) => void
  setFeedback: (feedback: ConversationFeedback | null) => void
  setLiveScore: (score: Score | null) => void
  setError: (error: string | null) => void
  setAudioLevel: (level: number) => void
  clearMessages: () => void
  updateConversationMeta: (id: string, meta: { title?: string; lastMessage?: string; updatedAt: string }) => void
  removeConversation: (id: string) => void
}

type ConversationStore = ConversationState & ConversationActions

export const useConversationStore = create<ConversationStore>()((set, get) => ({
  conversations: new Map(),
  currentConversationId: null,
  messages: [],
  isRecording: false,
  isAIThinking: false,
  inputMode: 'voice',
  feedback: null,
  liveScore: null,
  error: null,
  audioLevel: 0,

  setCurrentConversation: (id) => {
    if (id && id !== get().currentConversationId) {
      set({ currentConversationId: id, messages: [], feedback: null, liveScore: null, error: null })
    } else {
      set({ currentConversationId: id })
    }
  },

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
    })),

  setMessages: (messages) => set({ messages }),

  appendMessages: (messages) =>
    set((state) => ({
      messages: [...state.messages, ...messages],
    })),

  setIsRecording: (isRecording) => set({ isRecording }),

  setIsAIThinking: (isAIThinking) => set({ isAIThinking }),

  setInputMode: (inputMode) => set({ inputMode }),

  setFeedback: (feedback) => set({ feedback }),

  setLiveScore: (liveScore) => set({ liveScore }),

  setError: (error) => set({ error }),

  setAudioLevel: (audioLevel) => set({ audioLevel }),

  clearMessages: () => set({ messages: [], feedback: null, liveScore: null, error: null }),

  updateConversationMeta: (id, meta) =>
    set((state) => {
      const conversations = new Map(state.conversations)
      const existing = conversations.get(id)
      conversations.set(id, { ...existing, ...meta } as Conversation)
      return { conversations }
    }),

  removeConversation: (id) =>
    set((state) => {
      const conversations = new Map(state.conversations)
      conversations.delete(id)
      return { conversations }
    }),
}))
