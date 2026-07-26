import { PrismaClient } from '../node_modules/.prisma/client'

const prisma = new PrismaClient()

async function main() {
  const alexUser = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      name: 'Alex Johnson',
      passwordHash: '$2a$12$LJ3m4ys3Lg3YOCwLhZqXZuYxq5Yxq5Yxq5Yxq5Yxq5Yxq5Yxq5',
      isOnboarded: true,
    },
  })

  await prisma.profile.upsert({
    where: { userId: alexUser.id },
    update: {},
    create: {
      userId: alexUser.id,
      nativeLanguage: 'Spanish',
      targetLanguage: 'en',
      proficiencyLevel: 'B1',
      interests: '["travel","technology","food"]',
      learningGoals: '["conversation","interview"]',
      dailyGoalMinutes: 15,
      xp: 1280,
      level: 8,
      totalSessions: 47,
      totalMinutes: 582,
      totalWordsSpoken: 12400,
      accuracyScore: 78,
      streakDays: 7,
      longestStreak: 14,
    },
  })

  await prisma.userSettings.upsert({
    where: { userId: alexUser.id },
    update: {},
    create: {
      userId: alexUser.id,
      theme: 'dark',
      ttsVoice: 'default',
      ttsSpeed: 1.0,
      sttLanguage: 'en-US',
      notificationEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
    },
  })

  const mariaUser = await prisma.user.upsert({
    where: { email: 'maria@example.com' },
    update: {},
    create: {
      email: 'maria@example.com',
      name: 'Maria Garcia',
      isOnboarded: true,
    },
  })

  await prisma.profile.upsert({
    where: { userId: mariaUser.id },
    update: {},
    create: {
      userId: mariaUser.id,
      nativeLanguage: 'Portuguese',
      targetLanguage: 'en',
      proficiencyLevel: 'A2',
      interests: '["music","movies","books"]',
      learningGoals: '["fluency","travel"]',
      dailyGoalMinutes: 10,
      xp: 450,
      level: 3,
      totalSessions: 18,
      totalMinutes: 210,
      streakDays: 3,
    },
  })

  await prisma.userSettings.upsert({
    where: { userId: mariaUser.id },
    update: {},
    create: {
      userId: mariaUser.id,
      theme: 'dark',
      ttsVoice: 'default',
      ttsSpeed: 1.0,
      sttLanguage: 'en-US',
      notificationEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
    },
  })

  await prisma.conversation.create({
    data: {
      userId: alexUser.id,
      title: 'Travel Plans',
      mode: 'free',
      topic: 'travel',
      status: 'completed',
      messageCount: 12,
      durationSecs: 420,
      xpEarned: 45,
    },
  })

  const words = [
    { userId: alexUser.id, word: 'Nevertheless', definition: 'In spite of that', exampleSentence: 'The weather was bad; nevertheless, we went out.', difficulty: 'hard', status: 'learning', timesEncountered: 5, timesCorrect: 3, timesWrong: 2 },
    { userId: alexUser.id, word: 'Accommodate', definition: 'To provide lodging or room', exampleSentence: 'The hotel can accommodate up to 200 guests.', difficulty: 'medium', status: 'reviewing', timesEncountered: 8, timesCorrect: 6, timesWrong: 2 },
    { userId: alexUser.id, word: 'Sophisticated', definition: 'Highly developed or complex', exampleSentence: 'She has a sophisticated understanding of the topic.', difficulty: 'medium', status: 'learning', timesEncountered: 4, timesCorrect: 2, timesWrong: 2 },
    { userId: alexUser.id, word: 'Consequently', definition: 'As a result', exampleSentence: 'He was late and consequently missed the meeting.', difficulty: 'easy', status: 'mastered', timesEncountered: 12, timesCorrect: 11, timesWrong: 1 },
    { userId: alexUser.id, word: 'Substantial', definition: 'Of considerable importance', exampleSentence: 'There was a substantial increase in sales.', difficulty: 'medium', status: 'reviewing', timesEncountered: 6, timesCorrect: 4, timesWrong: 2 },
  ]
  for (const w of words) {
    await prisma.vocabularyItem.upsert({
      where: { userId_word: { userId: w.userId, word: w.word } },
      update: {},
      create: w,
    })
  }

  await prisma.streak.upsert({
    where: { userId: alexUser.id },
    update: {},
    create: { userId: alexUser.id, currentCount: 7, longestCount: 14, lastActivity: new Date() },
  })

  const weakAreas = [
    { userId: alexUser.id, type: 'pronunciation', name: 'Th sound', score: 45, trend: 'improving' },
    { userId: alexUser.id, type: 'grammar', name: 'Present Perfect', score: 38, trend: 'declining' },
    { userId: alexUser.id, type: 'vocabulary', name: 'Phrasal Verbs', score: 52, trend: 'stable' },
  ]
  for (const w of weakAreas) {
    await prisma.weakArea.upsert({
      where: { userId_type_name: { userId: w.userId, type: w.type, name: w.name } },
      update: {},
      create: w,
    })
  }

  await prisma.xpTransaction.createMany({
    data: [
      { userId: alexUser.id, amount: 45, reason: 'conversation' },
      { userId: alexUser.id, amount: 60, reason: 'lesson' },
      { userId: alexUser.id, amount: 25, reason: 'streak_bonus' },
      { userId: alexUser.id, amount: 50, reason: 'daily_goal' },
    ],
  })

  const achievements = [
    { code: 'first_conversation', title: 'First Steps', description: 'Complete your first conversation', xpReward: 50, rarity: 'common', criteria: '{"type":"conversations","count":1}' },
    { code: 'chatterbox', title: 'Chatterbox', description: 'Have 50 conversations', xpReward: 200, rarity: 'rare', criteria: '{"type":"conversations","count":50}' },
    { code: 'streak_7', title: 'Streak Master', description: 'Maintain a 7-day streak', xpReward: 150, rarity: 'common', criteria: '{"type":"streak","count":7}' },
    { code: 'word_collector', title: 'Word Collector', description: 'Learn 100 vocabulary words', xpReward: 300, rarity: 'rare', criteria: '{"type":"vocabulary","count":100}' },
    { code: 'perfect_pronunciation', title: 'Perfect Pronunciation', description: 'Score 90+ on pronunciation 10 times', xpReward: 500, rarity: 'epic', criteria: '{"type":"pronunciation","count":10,"minScore":90}' },
    { code: 'grammar_guru', title: 'Grammar Guru', description: 'Complete 30 grammar exercises', xpReward: 250, rarity: 'rare', criteria: '{"type":"grammar","count":30}' },
    { code: 'centurion', title: 'Centurion', description: 'Speak for 100 hours total', xpReward: 1000, rarity: 'legendary', criteria: '{"type":"minutes","count":6000}' },
  ]
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { code: a.code },
      update: {},
      create: a,
    })
  }

  console.log('Database seeded successfully!')
  console.log(`  Users: ${await prisma.user.count()}`)
  console.log(`  Profiles: ${await prisma.profile.count()}`)
  console.log(`  Settings: ${await prisma.userSettings.count()}`)
  console.log(`  Conversations: ${await prisma.conversation.count()}`)
  console.log(`  Vocabulary: ${await prisma.vocabularyItem.count()}`)
  console.log(`  Achievements: ${await prisma.achievement.count()}`)
  console.log(`  Weak Areas: ${await prisma.weakArea.count()}`)
  console.log(`  XP Transactions: ${await prisma.xpTransaction.count()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
