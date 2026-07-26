export interface AverageScores {
  pronunciation: number
  grammar: number
  fluency: number
  vocabulary: number
  overall: number
}

export interface WeeklyActivity {
  date: string
  sessions: number
  minutes: number
}

export interface WeakArea {
  type: string
  name: string
  score: number
}

export interface Milestone {
  type: 'achievement'
  label: string
  achievedAt: string
}

export interface ProgressOverview {
  totalSessions: number
  totalMinutes: number
  totalWords: number
  averageScores: AverageScores
  weeklyActivity: WeeklyActivity[]
  weakAreas: WeakArea[]
  recentMilestones: Milestone[]
  level: number
  xp: number
  streakDays: number
}

export interface Score {
  overall: number
  pronunciation: number
  grammar: number
  vocabulary: number
  fluency: number
}

export interface PronunciationProgress {
  phonemes: {
    phoneme: string
    accuracy: number
    attempts: number
    examples: string[]
  }[]
  intonationScore: number
  rhythmScore: number
  stressScore: number
  overallAccuracy: number
  commonMistakes: { pattern: string; count: number }[]
}

export interface GrammarProgress {
  categories: {
    category: string
    accuracy: number
    totalAttempts: number
    correctAttempts: number
  }[]
  overallAccuracy: number
  commonErrors: { error: string; correction: string; frequency: number }[]
}

export interface VocabularyProgress {
  totalWords: number
  masteredWords: number
  learningWords: number
  newWords: number
  categoriesBreakdown: { category: string; count: number; mastered: number }[]
  recentWords: {
    word: string
    masteryLevel: number
    lastReviewed: string
  }[]
}
