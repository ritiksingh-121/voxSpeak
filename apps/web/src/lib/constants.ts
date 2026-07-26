export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws'

export const APP_NAME = 'VoxSpeak'
export const APP_TAGLINE = 'Your AI English speaking coach'

export const XP_PER_CONVERSATION = 45
export const XP_PER_LESSON = 60
export const XP_STREAK_BONUS = 25
export const XP_DAILY_GOAL = 50

export const DAILY_GOAL_MINUTES = 15
export const FREE_TIER_MAX_MINUTES = 30
export const MAX_CONVERSATION_LENGTH_SECONDS = 300

export const STREAK_FREEZE_LIMIT = 3

export const VOCABULARY_STATUSES = ['new', 'learning', 'reviewing', 'mastered'] as const
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const
export const PROFICIENCY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export const PRACTICE_MODES = ['free', 'lesson', 'roleplay', 'interview', 'shadowing', 'debate'] as const

export const NAV_ITEMS = [
  { href: '/dashboard', icon: 'home', label: 'Home' },
  { href: '/practice', icon: 'mic', label: 'Practice' },
  { href: '/ai-tutor', icon: 'auto_awesome', label: 'AI Tutor' },
  { href: '/progress/overview', icon: 'trending_up', label: 'Progress' },
  { href: '/profile', icon: 'person', label: 'Profile' },
] as const
