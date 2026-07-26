export enum ProficiencyLevel {
  Beginner = "beginner",
  Elementary = "elementary",
  Intermediate = "intermediate",
  UpperIntermediate = "upper_intermediate",
  Advanced = "advanced",
  Proficient = "proficient",
}

export interface LevelConfig {
  label: string
  minXp: number
  maxXp: number
  icon: string
}

export const LEVEL_LABELS: Record<ProficiencyLevel, string> = {
  [ProficiencyLevel.Beginner]: "Beginner",
  [ProficiencyLevel.Elementary]: "Elementary",
  [ProficiencyLevel.Intermediate]: "Intermediate",
  [ProficiencyLevel.UpperIntermediate]: "Upper Intermediate",
  [ProficiencyLevel.Advanced]: "Advanced",
  [ProficiencyLevel.Proficient]: "Proficient",
}

export const LEVEL_ICONS: Record<ProficiencyLevel, string> = {
  [ProficiencyLevel.Beginner]: "🌱",
  [ProficiencyLevel.Elementary]: "🌿",
  [ProficiencyLevel.Intermediate]: "🌳",
  [ProficiencyLevel.UpperIntermediate]: "🔥",
  [ProficiencyLevel.Advanced]: "⭐",
  [ProficiencyLevel.Proficient]: "👑",
}

export const LEVEL_THRESHOLDS: LevelConfig[] = [
  { label: "Beginner", minXp: 0, maxXp: 1000, icon: "🌱" },
  { label: "Elementary", minXp: 1001, maxXp: 3000, icon: "🌿" },
  { label: "Intermediate", minXp: 3001, maxXp: 7000, icon: "🌳" },
  { label: "Upper Intermediate", minXp: 7001, maxXp: 14000, icon: "🔥" },
  { label: "Advanced", minXp: 14001, maxXp: 25000, icon: "⭐" },
  { label: "Proficient", minXp: 25001, maxXp: Infinity, icon: "👑" },
]

export function getProficiencyLevel(xp: number): ProficiencyLevel {
  if (xp <= 1000) return ProficiencyLevel.Beginner
  if (xp <= 3000) return ProficiencyLevel.Elementary
  if (xp <= 7000) return ProficiencyLevel.Intermediate
  if (xp <= 14000) return ProficiencyLevel.UpperIntermediate
  if (xp <= 25000) return ProficiencyLevel.Advanced
  return ProficiencyLevel.Proficient
}

export function getLevelProgress(xp: number): { currentLevelXp: number; nextLevelXp: number; progress: number } {
  const level = getProficiencyLevel(xp)
  const idx = LEVEL_THRESHOLDS.findIndex((t) => t.label.toLowerCase() === level.replace("_", " "))
  const current = LEVEL_THRESHOLDS[idx]
  const next = LEVEL_THRESHOLDS[idx + 1]
  if (!next) {
    return { currentLevelXp: current.minXp, nextLevelXp: current.maxXp, progress: 100 }
  }
  const levelXp = xp - current.minXp
  const range = next.minXp - current.minXp
  const progress = Math.min(100, Math.round((levelXp / range) * 100))
  return { currentLevelXp: current.minXp, nextLevelXp: next.minXp, progress }
}
