export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'

export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
  tier: BadgeTier
  category: 'conversation' | 'pronunciation' | 'vocabulary' | 'streak' | 'milestone'
  requirement: number
  progress?: number
  isUnlocked: boolean
  unlockedAt?: string
}

export interface Achievement {
  id: string
  userId: string
  name: string
  description: string
  iconUrl: string
  category: 'conversation' | 'pronunciation' | 'vocabulary' | 'streak' | 'milestone'
  xpReward: number
  isCompleted: boolean
  progress: number
  maxProgress: number
  completedAt?: string
  badge?: Badge
  createdAt: string
}

export interface Streak {
  id: string
  userId: string
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  streakHistory: {
    date: string
    minutesPracticed: number
    isCompleted: boolean
  }[]
  isAtRisk: boolean
  freezeTokens: number
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  avatarUrl?: string
  xp: number
  level: number
  streak: number
  isCurrentUser: boolean
}

export interface XpTransaction {
  id: string
  userId: string
  amount: number
  reason: string
  category: 'conversation' | 'pronunciation' | 'vocabulary' | 'streak' | 'achievement' | 'bonus' | 'correction'
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface LevelInfo {
  currentLevel: number
  currentXp: number
  xpToNextLevel: number
  totalXp: number
  progress: number
}
