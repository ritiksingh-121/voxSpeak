# Phase 5 — Database Schema (Prisma)

## PostgreSQL Database Design

### Users & Auth
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?
  name          String?
  avatarUrl     String?
  isOnboarded   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts    Account[]
  sessions    Session[]
  profile     Profile?
  settings    UserSettings?
  goals       Goal[]
  conversations Conversation[]
  voiceRecordings VoiceRecording[]
  vocabulary  VocabularyItem[]
  achievements UserAchievement[]
  xpHistory   XpTransaction[]
  streak      Streak?
  mistakes    Mistake[]
  weakAreas   WeakArea[]
  notifications Notification[]
  subscriptions Subscription[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  provider          String  // google, github, email
  providerAccountId String?
  refreshToken      String?
  accessToken       String?
  expiresAt         Int?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Profiles & Settings
```prisma
model Profile {
  id                String  @id @default(cuid())
  userId            String  @unique
  nativeLanguage    String?
  targetLanguage    String?  @default("en")
  proficiencyLevel  String?  // A1, A2, B1, B2, C1, C2
  interests         String[] // JSON array of topics
  learningGoals     String[] // interview, business, travel, etc.
  dailyGoalMinutes  Int      @default(15)
  xp                Int      @default(0)
  level             Int      @default(1)
  coins             Int      @default(0)
  totalSessions     Int      @default(0)
  totalMinutes      Float    @default(0)
  totalWordsSpoken  Int      @default(0)
  accuracyScore     Float?   // average pronunciation accuracy
  streakDays        Int      @default(0)
  longestStreak     Int      @default(0)
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model UserSettings {
  id              String  @id @default(cuid())
  userId          String  @unique
  theme           String  @default("dark")  // dark | light | system
  ttsVoice        String  @default("default")
  ttsSpeed        Float   @default(1.0)
  sttLanguage     String  @default("en-US")
  notificationEnabled Boolean @default(true)
  soundEnabled    Boolean @default(true)
  vibrationEnabled Boolean @default(true)
  user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Goal {
  id        String   @id @default(cuid())
  userId    String
  title     String
  type      String   // weekly, monthly, custom
  target    Int      // e.g., 30 minutes
  current   Int      @default(0)
  deadline  DateTime?
  completed Boolean  @default(false)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Conversations & Voice
```prisma
model Conversation {
  id            String   @id @default(cuid())
  userId        String
  title         String?
  mode          String   // free, lesson, roleplay, interview, shadowing
  topic         String?
  status        String   @default("active") // active, completed
  messageCount  Int      @default(0)
  durationSecs  Int      @default(0)
  xpEarned      Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages      Message[]
  feedback      ConversationFeedback?
}

model Message {
  id             String   @id @default(cuid())
  conversationId String
  role           String   // user, assistant, system
  content        String
  type           String?  // text, voice, correction, feedback
  audioUrl       String?
  durationMs     Int?
  pronunciationScore Float?
  grammarIssues  Json?    // [{type, text, suggestion}]
  vocabularySuggestions Json?
  metadata       Json?
  createdAt      DateTime @default(now())
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}

model ConversationFeedback {
  id             String   @id @default(cuid())
  conversationId String   @unique
  overallScore   Float?
  pronunciationAvg Float?
  grammarScore   Float?
  vocabularyScore Float?
  fluencyScore   Float?
  confidenceScore Float?
  strengths      String[] // JSON array
  weakAreas      String[]
  suggestions    String?
  aiNotes        Json?    // internal AI analysis
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}

model VoiceRecording {
  id             String   @id @default(cuid())
  userId         String
  conversationId String?
  messageId      String?
  filePath       String
  durationMs     Int
  fileSizeBytes  Int
  format         String   // webm, wav, mp3
  transcript     String?
  pronunciationScore Float?
  phonemeData    Json?
  createdAt      DateTime @default(now())
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Learning & Progress
```prisma
model VocabularyItem {
  id            String   @id @default(cuid())
  userId        String
  word          String
  definition    String?
  exampleSentence String?
  pronunciation  String?  // phonetic transcription
  language      String   @default("en")
  context       String?  // sentence where encountered
  difficulty    String?  // easy, medium, hard
  status        String   @default("learning") // new, learning, reviewing, mastered
  timesEncountered Int    @default(1)
  timesCorrect  Int      @default(0)
  timesWrong    Int      @default(0)
  lastReviewed  DateTime?
  nextReview    DateTime?
  createdAt     DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, word])
}

model Mistake {
  id            String   @id @default(cuid())
  userId        String
  type          String   // pronunciation, grammar, vocabulary
  original      String   // what user said
  correction    String   // correct version
  rule          String?  // grammar rule explanation
  context       String?  // surrounding conversation
  category      String?  // tense, preposition, article, etc.
  count         Int      @default(1)
  mastered      Boolean  @default(false)
  lastOccurred  DateTime @default(now())
  createdAt     DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model WeakArea {
  id        String   @id @default(cuid())
  userId    String
  type      String   // pronunciation, grammar, vocabulary, fluency
  name      String   // e.g., "th sound", "present perfect", "phrasal verbs"
  score     Float    // 0-100, lower = weaker
  trend     String   // improving, declining, stable
  lastUpdated DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, type, name])
}
```

### Gamification
```prisma
model Streak {
  id          String   @id @default(cuid())
  userId      String   @unique
  currentCount Int     @default(0)
  longestCount Int     @default(0)
  lastActivity DateTime?
  frozenDays   Int     @default(0)
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model XpTransaction {
  id          String   @id @default(cuid())
  userId      String
  amount      Int
  reason      String   // conversation, lesson, streak_bonus, achievement, daily_goal
  referenceId String?  // link to conversation, achievement, etc.
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Achievement {
  id          String   @id @default(cuid())
  code        String   @unique
  title       String
  description String
  iconUrl     String?
  xpReward    Int      @default(0)
  criteria    Json     // conditions to unlock
  rarity      String   // common, rare, epic, legendary
  createdAt   DateTime @default(now())
  users       UserAchievement[]
}

model UserAchievement {
  id            String   @id @default(cuid())
  userId        String
  achievementId String
  unlockedAt    DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([userId, achievementId])
}

model Badge {
  id          String   @id @default(cuid())
  code        String   @unique
  title       String
  description String
  iconUrl     String?
  tier        Int      @default(1) // 1-5
  createdAt   DateTime @default(now())
}

model DailyMission {
  id          String     @id @default(cuid())
  date        DateTime   @default(now())
  title       String
  description String
  xpReward    Int
  criteria    Json
  type        String     // speaking, vocabulary, grammar, streak
  createdAt   DateTime   @default(now())
}
```

### Notifications & Subscriptions
```prisma
model Notification {
  id        String    @id @default(cuid())
  userId    String
  type      String    // streak_reminder, achievement, daily_goal, session_reminder
  title     String
  body      String
  data      Json?     // deep link payload
  read      Boolean   @default(false)
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Subscription {
  id            String    @id @default(cuid())
  userId        String    @unique
  plan          String    // free, premium, annual
  status        String    // active, cancelled, expired
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  stripeId      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Indexes
```prisma
// Performance indexes for common queries
model IndexDefinitions {
  // conversations_userId_createdAt
  // messages_conversationId_createdAt
  // vocabulary_userId_status
  // mistakes_userId_type
  // weakAreas_userId_score
  // xpTransaction_userId_createdAt
  // notification_userId_read_createdAt
}
```

## Vector Store (Qdrant)
Collections for semantic search:
- **conversation_memory**: User conversations for RAG
- **vocabulary_embeddings**: Word meanings and usage
- **lesson_content**: Lesson material for smart recommendations
- **mistake_patterns**: Common mistakes for correction AI

## Redis Cache
- User sessions
- Active conversation state
- Rate limiting counters
- Real-time leaderboard
- Feature flags
- Temporary auth tokens
