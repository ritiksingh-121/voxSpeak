import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface PhonemeScore {
  phoneme: string
  score: number
  status: 'weak' | 'fair' | 'good' | 'strong'
}

interface WeeklyDay {
  day: string
  value: number
}

interface Milestone {
  title: string
  date: string
  achieved: boolean
}

interface ProgressState {
  sessions: number
  totalMinutes: number
  wordsSpoken: number
  vocabularyCount: number
  pronunciationScore: number
  grammarScore: number
  fluencyScore: number
  weeklyMinutes: number[]
  phonemes: PhonemeScore[]
  pronunciationWeekly: WeeklyDay[]
  milestones: Milestone[]
}

interface ProgressActions {
  incrementSessions: () => void
  addMinutes: (m: number) => void
  setVocabularyCount: (n: number) => void
  markMilestoneAchieved: (title: string) => void
}

type ProgressStore = ProgressState & ProgressActions

const defaultPhonemes: PhonemeScore[] = [
  { phoneme: '/θ/ (think)', score: 45, status: 'weak' },
  { phoneme: '/ð/ (the)', score: 52, status: 'weak' },
  { phoneme: '/ŋ/ (sing)', score: 68, status: 'fair' },
  { phoneme: '/ʒ/ (pleasure)', score: 55, status: 'weak' },
  { phoneme: '/ʃ/ (ship)', score: 82, status: 'good' },
  { phoneme: '/tʃ/ (chip)', score: 78, status: 'good' },
  { phoneme: '/dʒ/ (judge)', score: 85, status: 'good' },
  { phoneme: '/r/ (red)', score: 72, status: 'fair' },
  { phoneme: '/l/ (light)', score: 90, status: 'strong' },
  { phoneme: '/w/ (water)', score: 92, status: 'strong' },
]

const defaultMilestones: Milestone[] = [
  { title: 'First Conversation', date: '2 days ago', achieved: true },
  { title: '10 Conversations', date: '1 week ago', achieved: true },
  { title: '50 min total speaking', date: '3 days ago', achieved: true },
  { title: '100 words learned', date: 'Today', achieved: false },
  { title: '7-day streak', date: 'In progress', achieved: false },
]

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      sessions: 47,
      totalMinutes: 582,
      wordsSpoken: 12400,
      vocabularyCount: 234,
      pronunciationScore: 78,
      grammarScore: 65,
      fluencyScore: 72,
      weeklyMinutes: [45, 60, 30, 80, 55, 90, 40],
      phonemes: defaultPhonemes,
      pronunciationWeekly: [
        { day: 'Mon', value: 72 },
        { day: 'Tue', value: 75 },
        { day: 'Wed', value: 70 },
        { day: 'Thu', value: 78 },
        { day: 'Fri', value: 76 },
        { day: 'Sat', value: 82 },
        { day: 'Sun', value: 78 },
      ],
      milestones: defaultMilestones,

      incrementSessions: () => set((s) => ({ sessions: s.sessions + 1 })),
      addMinutes: (m) => set((s) => ({ totalMinutes: s.totalMinutes + m })),
      setVocabularyCount: (n) => set({ vocabularyCount: n }),
      markMilestoneAchieved: (title) =>
        set((s) => ({
          milestones: s.milestones.map((m) =>
            m.title === title ? { ...m, achieved: true } : m
          ),
        })),
    }),
    {
      name: 'voxspeak-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
