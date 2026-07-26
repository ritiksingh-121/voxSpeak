import api from './api'
import { ProgressOverview, PronunciationProgress, GrammarProgress, VocabularyProgress } from '@/types/progress'
import { ApiResponse } from '@/types/api'

export const progressService = {
  async getProgressOverview(): Promise<ProgressOverview> {
    const response = await api.get<ApiResponse<ProgressOverview>>('/progress/overview')
    return response.data.data
  },

  async getPronunciationProgress(): Promise<PronunciationProgress> {
    const response = await api.get<ApiResponse<PronunciationProgress>>('/progress/pronunciation')
    return response.data.data
  },

  async getGrammarProgress(): Promise<GrammarProgress> {
    const response = await api.get<ApiResponse<GrammarProgress>>('/progress/grammar')
    return response.data.data
  },

  async getVocabularyProgress(): Promise<VocabularyProgress> {
    const response = await api.get<ApiResponse<VocabularyProgress>>('/progress/vocabulary')
    return response.data.data
  },

  async getScoresHistory(days = 30): Promise<{ date: string; scores: Record<string, number> }[]> {
    const response = await api.get<ApiResponse<{ date: string; scores: Record<string, number> }[]>>(
      '/progress/scores-history',
      { params: { days } }
    )
    return response.data.data
  },
}

export type ProgressService = typeof progressService
