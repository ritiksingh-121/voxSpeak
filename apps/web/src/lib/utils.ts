import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatXp(amount: number): string {
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`
  return amount.toString()
}

export function getLevelColor(level: number): string {
  if (level <= 3) return 'text-success'
  if (level <= 7) return 'text-accent'
  if (level <= 12) return 'text-primary'
  return 'text-error'
}

export function getLevelProgress(xp: number): { level: number; progress: number; xpForNext: number } {
  const xpPerLevel = 200
  const level = Math.floor(xp / xpPerLevel) + 1
  const currentLevelXp = xp % xpPerLevel
  const progress = (currentLevelXp / xpPerLevel) * 100
  return { level, progress, xpForNext: xpPerLevel - currentLevelXp }
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export const difficultyColors = {
  easy: 'bg-success/15 text-success',
  medium: 'bg-primary/15 text-primary',
  hard: 'bg-error/15 text-error',
} as const

export const statusColors = {
  new: 'bg-surface-3 text-text-secondary',
  learning: 'bg-primary/15 text-primary',
  reviewing: 'bg-accent/15 text-accent',
  mastered: 'bg-success/15 text-success',
} as const

export const rarityStyles = {
  common: { bg: 'bg-surface-2', border: 'border-divider', text: 'text-text-secondary' },
  rare: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  epic: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  legendary: { bg: 'bg-primary/10', border: 'border-primary/20', text: 'text-primary' },
} as const
