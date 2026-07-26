import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type WordStatus = 'new' | 'learning' | 'reviewing' | 'mastered'
type WordDifficulty = 'easy' | 'medium' | 'hard'

interface Word {
  word: string
  def: string
  context: string
  difficulty: WordDifficulty
  status: WordStatus
}

interface VocabularyState {
  words: Word[]
}

interface VocabularyActions {
  toggleStatus: (word: string) => void
}

type VocabularyStore = VocabularyState & VocabularyActions

const defaultWords: Word[] = [
  { word: 'Nevertheless', def: 'In spite of that', context: 'The weather was bad; nevertheless, we went out.', difficulty: 'hard', status: 'learning' },
  { word: 'Accommodate', def: 'To provide lodging or room', context: 'The hotel can accommodate up to 200 guests.', difficulty: 'medium', status: 'reviewing' },
  { word: 'Sophisticated', def: 'Highly developed or complex', context: 'She has a sophisticated understanding of the topic.', difficulty: 'medium', status: 'learning' },
  { word: 'Elaborate', def: 'Involving many carefully arranged parts', context: 'He gave an elaborate explanation of the process.', difficulty: 'hard', status: 'new' },
  { word: 'Consequently', def: 'As a result', context: 'He was late and consequently missed the meeting.', difficulty: 'easy', status: 'mastered' },
  { word: 'Substantial', def: 'Of considerable importance or size', context: 'There was a substantial increase in sales.', difficulty: 'medium', status: 'reviewing' },
  { word: 'Moreover', def: 'In addition; besides', context: 'The rent is reasonable and, moreover, the location is perfect.', difficulty: 'easy', status: 'mastered' },
  { word: 'Ambiguous', def: 'Open to more than one interpretation', context: 'The instructions were ambiguous and confusing.', difficulty: 'hard', status: 'learning' },
  { word: 'Deteriorate', def: 'To become progressively worse', context: 'His health began to deteriorate rapidly.', difficulty: 'medium', status: 'new' },
  { word: 'Inevitable', def: 'Certain to happen; unavoidable', context: 'Change is inevitable in life.', difficulty: 'easy', status: 'mastered' },
]

export const useVocabularyStore = create<VocabularyStore>()(
  persist(
    (set) => ({
      words: defaultWords,

      toggleStatus: (word) =>
        set((state) => ({
          words: state.words.map((w) => {
            if (w.word !== word) return w
            const next: Record<WordStatus, WordStatus> = {
              new: 'learning',
              learning: 'reviewing',
              reviewing: 'mastered',
              mastered: 'new',
            }
            return { ...w, status: next[w.status] }
          }),
        })),
    }),
    {
      name: 'voxspeak-vocabulary',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
