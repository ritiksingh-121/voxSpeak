export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  provider: 'email' | 'google' | 'apple'
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Profile {
  id: string
  userId: string
  displayName: string
  bio?: string
  nativeLanguage: string
  targetLanguage: string
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced'
  dailyGoalMinutes: number
  avatarUrl?: string
  timezone: string
}

export interface UserSettings {
  id: string
  userId: string
  theme: 'dark' | 'light'
  notificationsEnabled: boolean
  soundEnabled: boolean
  voiceInputEnabled: boolean
  autoPlayFeedback: boolean
  showPhonetics: boolean
  showTranslations: boolean
  weeklyDigest: boolean
  pronunciationSensitivity: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface OAuthRequest {
  provider: 'google' | 'apple'
  token: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}
