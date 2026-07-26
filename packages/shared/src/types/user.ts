export interface User {
  id: string
  email: string
  passwordHash?: string | null
  name?: string | null
  avatarUrl?: string | null
  isOnboarded: boolean
  createdAt: string
  updatedAt: string
  profile?: UserProfile | null
  settings?: UserSettings | null
}

export interface UserProfile {
  id: string
  userId: string
  nativeLanguage?: string | null
  targetLanguage: string
  proficiencyLevel: string
  interests: string[]
  learningGoals: string[]
  dailyGoalMinutes: number
  xp: number
  level: number
  coins: number
  totalSessions: number
  totalMinutes: number
  totalWordsSpoken: number
  accuracyScore: number
  streakDays: number
  longestStreak: number
}

export interface UserSettings {
  id: string
  userId: string
  theme: string
  ttsVoice: string
  ttsSpeed: number
  sttLanguage: string
  notificationEnabled: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
}

export interface Account {
  id: string
  userId: string
  provider: string
  providerAccountId: string
  refreshToken?: string | null
  accessToken?: string | null
  expiresAt?: number | null
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: string
}
