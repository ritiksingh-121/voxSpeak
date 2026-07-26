import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const alex = await prisma.user.upsert({
    where: { email: "alex@example.com" },
    update: {},
    create: {
      email: "alex@example.com",
      passwordHash: "$2b$10$dummyhashforalex",
      name: "Alex Johnson",
      avatarUrl: null,
      isOnboarded: true,
      nativeLanguage: "es",
      targetLanguage: "en",
      proficiencyLevel: "intermediate",
      interests: ["technology", "travel", "music"],
      learningGoals: ["improve fluency", "expand vocabulary", "pronunciation"],
      dailyGoalMinutes: 15,
      xp: 450,
      level: 4,
      coins: 120,
      totalSessions: 28,
      totalMinutes: 340,
      totalWordsSpoken: 5200,
      accuracyScore: 76.5,
      streakDays: 5,
      longestStreak: 12,
      theme: "dark",
      ttsVoice: "default",
      ttsSpeed: 1.0,
      notificationEnabled: true,
    },
  })

  const maria = await prisma.user.upsert({
    where: { email: "maria@example.com" },
    update: {},
    create: {
      email: "maria@example.com",
      passwordHash: "$2b$10$dummyhashformaria",
      name: "Maria Garcia",
      avatarUrl: null,
      isOnboarded: false,
      nativeLanguage: "pt",
      targetLanguage: "en",
      proficiencyLevel: "beginner",
      interests: ["food", "movies", "sports"],
      learningGoals: ["basic conversation", "grammar"],
      dailyGoalMinutes: 10,
      xp: 120,
      level: 2,
      coins: 45,
      totalSessions: 8,
      totalMinutes: 95,
      totalWordsSpoken: 1100,
      accuracyScore: 58.0,
      streakDays: 2,
      longestStreak: 4,
      theme: "dark",
      ttsVoice: "default",
      ttsSpeed: 0.9,
      notificationEnabled: true,
    },
  })

  const conversation = await prisma.conversation.create({
    data: {
      userId: alex.id,
      title: "Ordering at a Restaurant",
      mode: "guided",
      topic: "food",
      status: "completed",
      messageCount: 3,
      durationSecs: 180,
      xpEarned: 30,
      messages: {
        create: [
          {
            role: "assistant",
            content: "Hi Alex! Let's practice ordering at a restaurant. I'll be the waiter. Try saying: 'I'd like to make a reservation for two, please.'",
            type: "text",
            createdAt: new Date("2026-07-24T10:00:00Z"),
          },
          {
            role: "user",
            content: "I'd like to make a reservation for two, please.",
            type: "voice",
            audioUrl: "https://storage.example.com/audio/conversation_1_user_1.webm",
            durationMs: 3200,
            pronunciationScore: 78.5,
            createdAt: new Date("2026-07-24T10:00:05Z"),
          },
          {
            role: "assistant",
            content: "Excellent! Your pronunciation was very clear. A small tip: try to make the 'r' sound in 'reservation' a bit softer. Now let's continue. When the waiter asks what you'd like to eat, you can say: 'Could you recommend today's special?'",
            type: "text",
            grammarIssues: [],
            vocabularySuggestions: [],
            createdAt: new Date("2026-07-24T10:00:08Z"),
          },
        ],
      },
    },
    include: { messages: true },
  })

  const vocabularyWords = [
    { userId: alex.id, word: "reservation", definition: "An arrangement to have something held for your use", exampleSentence: "I made a reservation at the restaurant for 7 PM.", pronunciation: "/ˌrezərˈveɪʃən/", difficulty: "intermediate", status: "reviewing", timesEncountered: 5, timesCorrect: 4, timesWrong: 1 },
    { userId: alex.id, word: "recommend", definition: "To suggest that someone or something would be good or suitable", exampleSentence: "Could you recommend today's special?", pronunciation: "/ˌrekəˈmend/", difficulty: "intermediate", status: "learning", timesEncountered: 3, timesCorrect: 2, timesWrong: 1 },
    { userId: alex.id, word: "appetizer", definition: "A small dish served before the main meal", exampleSentence: "We shared a few appetizers before the main course.", pronunciation: "/ˈæpɪtaɪzər/", difficulty: "intermediate", status: "new", timesEncountered: 1, timesCorrect: 1, timesWrong: 0 },
    { userId: maria.id, word: "menu", definition: "A list of dishes available at a restaurant", exampleSentence: "Can I see the menu, please?", pronunciation: "/ˈmenjuː/", difficulty: "beginner", status: "learning", timesEncountered: 4, timesCorrect: 3, timesWrong: 1 },
    { userId: maria.id, word: "check", definition: "A bill at a restaurant showing what you owe", exampleSentence: "Could I have the check, please?", pronunciation: "/tʃek/", difficulty: "beginner", status: "new", timesEncountered: 2, timesCorrect: 2, timesWrong: 0 },
  ]

  for (const word of vocabularyWords) {
    await prisma.vocabularyItem.upsert({
      where: { userId_word: { userId: word.userId, word: word.word } },
      update: {},
      create: {
        userId: word.userId,
        word: word.word,
        definition: word.definition,
        exampleSentence: word.exampleSentence,
        pronunciation: word.pronunciation,
        difficulty: word.difficulty,
        status: word.status,
        timesEncountered: word.timesEncountered,
        timesCorrect: word.timesCorrect,
        timesWrong: word.timesWrong,
      },
    })
  }

  const achievements = [
    { code: "first_conversation", title: "First Conversation", description: "Complete your first conversation with the AI coach", xpReward: 50, criteria: { type: "conversation_count", threshold: 1 }, rarity: "common" },
    { code: "seven_day_streak", title: "Week Warrior", description: "Maintain a 7-day learning streak", xpReward: 200, criteria: { type: "streak_days", threshold: 7 }, rarity: "rare" },
    { code: "vocabulary_master", title: "Vocabulary Master", description: "Learn 50 vocabulary words", xpReward: 500, criteria: { type: "vocabulary_count", threshold: 50 }, rarity: "epic" },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: {},
      create: {
        code: achievement.code,
        title: achievement.title,
        description: achievement.description,
        xpReward: achievement.xpReward,
        criteria: achievement.criteria,
        rarity: achievement.rarity,
      },
    })
  }

  await prisma.xpTransaction.createMany({
    data: [
      { userId: alex.id, amount: 30, reason: "completed_conversation", referenceId: conversation.id },
      { userId: maria.id, amount: 15, reason: "daily_login_bonus" },
    ],
  })

  await prisma.streak.upsert({
    where: { userId: alex.id },
    update: {},
    create: {
      userId: alex.id,
      currentCount: 5,
      longestCount: 12,
      lastActivity: new Date("2026-07-24"),
      frozenDays: 0,
    },
  })

  const weakAreasData = [
    { userId: alex.id, type: "pronunciation", name: "'th' sounds", score: 62, trend: "improving" },
    { userId: alex.id, type: "grammar", name: "present perfect tense", score: 58, trend: "stable" },
    { userId: alex.id, type: "vocabulary", name: "idioms", score: 45, trend: "declining" },
    { userId: maria.id, type: "pronunciation", name: "vowel sounds", score: 40, trend: "improving" },
    { userId: maria.id, type: "grammar", name: "article usage", score: 35, trend: "stable" },
    { userId: maria.id, type: "vocabulary", name: "basic greetings", score: 70, trend: "improving" },
  ]

  for (const area of weakAreasData) {
    await prisma.weakArea.upsert({
      where: { userId_type_name: { userId: area.userId, type: area.type, name: area.name } },
      update: {},
      create: {
        userId: area.userId,
        type: area.type,
        name: area.name,
        score: area.score,
        trend: area.trend,
      },
    })
  }

  console.log("Seed completed successfully")
  console.log(`  Created users: ${alex.name}, ${maria.name}`)
  console.log(`  Created conversation with ${conversation.messageCount} messages`)
  console.log(`  Created ${vocabularyWords.length} vocabulary items`)
  console.log(`  Created ${achievements.length} achievements`)
  console.log(`  Created XP transactions`)
  console.log(`  Created streak entry`)
  console.log(`  Created ${weakAreasData.length} weak areas`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
