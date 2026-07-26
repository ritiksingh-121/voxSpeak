export interface Achievement {
  id: string
  code: string
  title: string
  description: string
  iconUrl?: string | null
  xpReward: number
  criteria?: Record<string, unknown> | null
  rarity: string
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  achievement?: Achievement
  unlockedAt?: string
}

export interface Badge {
  id: string
  code: string
  title: string
  description: string
  iconUrl?: string | null
  tier: string
}

export interface Streak {
  id: string
  userId: string
  currentCount: number
  longestCount: number
  lastActivity?: string | null
  frozenDays: number
}

export interface XpTransaction {
  id: string
  userId: string
  amount: number
  reason: string
  referenceId?: string | null
  createdAt: string
}

export interface LeaderboardEntry {
  userId: string
  name: string
  avatarUrl?: string | null
  xp: number
  level: number
  streakDays: number
  rank: number
}

export interface DailyMission {
  id: string
  date: string
  title: string
  description: string
  xpReward: number
  criteria?: Record<string, unknown> | null
  type: string
}
