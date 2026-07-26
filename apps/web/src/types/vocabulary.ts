export interface VocabularyItem {
  id: string
  userId: string
  word: string
  definition: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun' | 'interjection'
  phonetic?: string
  exampleSentence?: string
  translation?: string
  synonyms?: string[]
  antonyms?: string[]
  tags?: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
  timesReviewed: number
  lastReviewedAt?: string
  masteryLevel: number
  isStarred: boolean
  source?: string
  createdAt: string
  updatedAt: string
}

export interface SaveWordRequest {
  word: string
  definition: string
  partOfSpeech: VocabularyItem['partOfSpeech']
  phonetic?: string
  exampleSentence?: string
  translation?: string
  synonyms?: string[]
  antonyms?: string[]
  tags?: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
  source?: string
}

export interface UpdateWordRequest extends Partial<SaveWordRequest> {
  isStarred?: boolean
  masteryLevel?: number
}
