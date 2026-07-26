export interface AchievementDefinition {
  code: string
  title: string
  description: string
  xpReward: number
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  criteria: (data: Record<string, unknown>) => boolean
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    code: "first_conversation",
    title: "First Steps",
    description: "Complete your first conversation",
    xpReward: 50,
    rarity: "common",
    criteria: (data) => (data.conversationsCount as number) >= 1,
  },
  {
    code: "ten_conversations",
    title: "Getting Started",
    description: "Complete 10 conversations",
    xpReward: 100,
    rarity: "common",
    criteria: (data) => (data.conversationsCount as number) >= 10,
  },
  {
    code: "fifty_conversations",
    title: "Regular Learner",
    description: "Complete 50 conversations",
    xpReward: 250,
    rarity: "uncommon",
    criteria: (data) => (data.conversationsCount as number) >= 50,
  },
  {
    code: "hundred_conversations",
    title: "Dedicated Speaker",
    description: "Complete 100 conversations",
    xpReward: 500,
    rarity: "rare",
    criteria: (data) => (data.conversationsCount as number) >= 100,
  },
  {
    code: "seven_day_streak",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    xpReward: 150,
    rarity: "uncommon",
    criteria: (data) => (data.streakDays as number) >= 7,
  },
  {
    code: "thirty_day_streak",
    title: "Monthly Master",
    description: "Maintain a 30-day streak",
    xpReward: 500,
    rarity: "rare",
    criteria: (data) => (data.streakDays as number) >= 30,
  },
  {
    code: "hundred_day_streak",
    title: "Century Streak",
    description: "Maintain a 100-day streak",
    xpReward: 2000,
    rarity: "epic",
    criteria: (data) => (data.streakDays as number) >= 100,
  },
  {
    code: "vocab_50",
    title: "Word Collector",
    description: "Learn 50 vocabulary words",
    xpReward: 100,
    rarity: "common",
    criteria: (data) => (data.vocabularyCount as number) >= 50,
  },
  {
    code: "vocab_200",
    title: "Lexicon Builder",
    description: "Learn 200 vocabulary words",
    xpReward: 300,
    rarity: "uncommon",
    criteria: (data) => (data.vocabularyCount as number) >= 200,
  },
  {
    code: "vocab_500",
    title: "Wordsmith",
    description: "Learn 500 vocabulary words",
    xpReward: 750,
    rarity: "rare",
    criteria: (data) => (data.vocabularyCount as number) >= 500,
  },
  {
    code: "vocab_1000",
    title: "Linguist",
    description: "Learn 1000 vocabulary words",
    xpReward: 2000,
    rarity: "epic",
    criteria: (data) => (data.vocabularyCount as number) >= 1000,
  },
  {
    code: "perfect_pronunciation",
    title: "Clear Voice",
    description: "Achieve a 90%+ pronunciation score in a conversation",
    xpReward: 200,
    rarity: "uncommon",
    criteria: (data) => (data.lastPronunciationScore as number) >= 90,
  },
  {
    code: "accuracy_master",
    title: "Accuracy Master",
    description: "Achieve over 85% overall accuracy",
    xpReward: 500,
    rarity: "rare",
    criteria: (data) => (data.accuracyScore as number) >= 85,
  },
  {
    code: "level_5",
    title: "Rising Star",
    description: "Reach level 5",
    xpReward: 200,
    rarity: "uncommon",
    criteria: (data) => (data.level as number) >= 5,
  },
  {
    code: "level_10",
    title: "English Enthusiast",
    description: "Reach level 10",
    xpReward: 500,
    rarity: "rare",
    criteria: (data) => (data.level as number) >= 10,
  },
  {
    code: "level_20",
    title: "Language Champion",
    description: "Reach level 20",
    xpReward: 2000,
    rarity: "epic",
    criteria: (data) => (data.level as number) >= 20,
  },
  {
    code: "first_perfect_score",
    title: "Perfect Score",
    description: "Get a perfect 100% score on any conversation feedback",
    xpReward: 300,
    rarity: "rare",
    criteria: (data) => (data.bestOverallScore as number) === 100,
  },
  {
    code: "ten_minutes_session",
    title: "Focused Learner",
    description: "Complete a conversation session lasting 10+ minutes",
    xpReward: 100,
    rarity: "common",
    criteria: (data) => (data.longestSessionMinutes as number) >= 10,
  },
  {
    code: "hour_total",
    title: "Hour of Power",
    description: "Accumulate 1 hour of total practice time",
    xpReward: 200,
    rarity: "uncommon",
    criteria: (data) => (data.totalMinutes as number) >= 60,
  },
  {
    code: "five_hours_total",
    title: "Dedicated Learner",
    description: "Accumulate 5 hours of total practice time",
    xpReward: 500,
    rarity: "rare",
    criteria: (data) => (data.totalMinutes as number) >= 300,
  },
]

export function checkAchievements(
  definitions: AchievementDefinition[],
  userData: Record<string, unknown>,
): AchievementDefinition[] {
  return definitions.filter((a) => a.criteria(userData))
}
