export interface ProgressOverview {
  totalSessions: number
  totalMinutes: number
  totalWordsSpoken: number
  overallAccuracy: number
  currentStreak: number
  longestStreak: number
  xp: number
  level: number
  coins: number
  weakAreas: WeakArea[]
  weeklyActivity: WeeklyActivity[]
  scoreSummary: ScoreSummary
  recentMilestones: Milestone[]
}

export interface WeakArea {
  id: string
  userId: string
  type: string
  name: string
  score: number
  trend: string
  lastUpdated: string
}

export interface WeeklyActivity {
  date: string
  sessions: number
  minutes: number
  wordsSpoken: number
  accuracy: number
  xpEarned: number
}

export interface ScoreSummary {
  pronunciation: number
  grammar: number
  vocabulary: number
  fluency: number
  confidence: number
  overall: number
}

export interface Milestone {
  id: string
  title: string
  description: string
  achievedAt: string
  type: string
  icon?: string
}
