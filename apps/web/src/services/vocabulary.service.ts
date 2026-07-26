import api from './api'
import { VocabularyItem, SaveWordRequest, UpdateWordRequest } from '@/types/vocabulary'
import { ApiResponse, PaginatedResponse } from '@/types/api'

export const vocabularyService = {
  async getVocabulary(params?: {
    page?: number
    limit?: number
    search?: string
    tags?: string[]
    difficulty?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<VocabularyItem>> {
    const response = await api.get<PaginatedResponse<VocabularyItem>>('/vocabulary', { params })
    return response.data
  },

  async getWord(id: string): Promise<VocabularyItem> {
    const response = await api.get<ApiResponse<VocabularyItem>>(`/vocabulary/${id}`)
    return response.data.data
  },

  async saveWord(data: SaveWordRequest): Promise<VocabularyItem> {
    const response = await api.post<ApiResponse<VocabularyItem>>('/vocabulary', data)
    return response.data.data
  },

  async updateWord(id: string, data: UpdateWordRequest): Promise<VocabularyItem> {
    const response = await api.put<ApiResponse<VocabularyItem>>(`/vocabulary/${id}`, data)
    return response.data.data
  },

  async deleteWord(id: string): Promise<void> {
    await api.delete(`/vocabulary/${id}`)
  },

  async reviewWord(id: string, score: number): Promise<VocabularyItem> {
    const response = await api.post<ApiResponse<VocabularyItem>>(`/vocabulary/${id}/review`, { score })
    return response.data.data
  },

  async toggleStar(id: string): Promise<VocabularyItem> {
    const response = await api.post<ApiResponse<VocabularyItem>>(`/vocabulary/${id}/star`)
    return response.data.data
  },

  async getStarredWords(): Promise<VocabularyItem[]> {
    const response = await api.get<ApiResponse<VocabularyItem[]>>('/vocabulary/starred')
    return response.data.data
  },
}

export type VocabularyService = typeof vocabularyService
