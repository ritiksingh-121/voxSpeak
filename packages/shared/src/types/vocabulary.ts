export enum VocabularyStatus {
  New = "new",
  Learning = "learning",
  Reviewing = "reviewing",
  Mastered = "mastered",
  Forgotten = "forgotten",
}

export enum DifficultyLevel {
  Beginner = "beginner",
  Elementary = "elementary",
  Intermediate = "intermediate",
  Advanced = "advanced",
  Native = "native",
}

export interface VocabularyItem {
  id: string
  userId: string
  word: string
  definition?: string | null
  exampleSentence?: string | null
  pronunciation?: string | null
  context?: string | null
  difficulty: string
  status: string
  timesEncountered: number
  timesCorrect: number
  timesWrong: number
  lastReviewed?: string | null
  nextReview?: string | null
}
