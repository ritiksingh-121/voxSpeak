import api from './api'
import { XpTransaction, Achievement, Streak, LeaderboardEntry, LevelInfo } from '@/types/gamification'
import { ApiResponse, PaginatedResponse } from '@/types/api'

export const gamificationService = {
  async getXpHistory(page = 1, limit = 50): Promise<PaginatedResponse<XpTransaction>> {
    const response = await api.get<PaginatedResponse<XpTransaction>>('/gamification/xp', {
      params: { page, limit },
    })
    return response.data
  },

  async getAchievements(): Promise<Achievement[]> {
    const response = await api.get<ApiResponse<Achievement[]>>('/gamification/achievements')
    return response.data.data
  },

  async getStreak(): Promise<Streak> {
    const response = await api.get<ApiResponse<Streak>>('/gamification/streak')
    return response.data.data
  },

  async getLeaderboard(params?: {
    period?: 'daily' | 'weekly' | 'monthly' | 'allTime'
    limit?: number
  }): Promise<LeaderboardEntry[]> {
    const response = await api.get<ApiResponse<LeaderboardEntry[]>>('/gamification/leaderboard', { params })
    return response.data.data
  },

  async getLevelInfo(): Promise<LevelInfo> {
    const response = await api.get<ApiResponse<LevelInfo>>('/gamification/level')
    return response.data.data
  },

  async claimDailyReward(): Promise<{ xpEarned: number; streak: Streak }> {
    const response = await api.post<ApiResponse<{ xpEarned: number; streak: Streak }>>('/gamification/daily-reward')
    return response.data.data
  },
}

export type GamificationService = typeof gamificationService
