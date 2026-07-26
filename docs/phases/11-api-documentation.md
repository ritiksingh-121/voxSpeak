# Phase 11 — API Documentation

## Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://api.voxspeak.app/api`

## Authentication
All endpoints except auth routes require Bearer token:
```
Authorization: Bearer <jwt_token>
```

## Standard Response Format
```typescript
// Success
{
  "success": true,
  "data": {},
  "meta": { "page": 1, "limit": 20, "total": 100 }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [{ "field": "email", "message": "Must be valid email" }]
  }
}
```

## Endpoint Details

### Auth Module

#### POST /api/auth/register
```typescript
Request: {
  email: string;        // valid email
  password: string;     // min 8 chars, uppercase, lowercase, number
  name: string;         // min 2, max 50
}
Response: {
  user: User;
  token: string;
  refreshToken: string;
}
```

#### POST /api/auth/login
```typescript
Request: {
  email: string;
  password: string;
}
Response: {
  user: User;
  token: string;
  refreshToken: string;
}
```

#### POST /api/auth/oauth/google
```typescript
Request: {
  idToken: string;
}
Response: {
  user: User;
  token: string;
  refreshToken: string;
}
```

#### POST /api/auth/refresh
```typescript
Request: {
  refreshToken: string;
}
Response: {
  token: string;
  refreshToken: string;
}
```

### User Module

#### GET /api/users/me
```typescript
Response: {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  profile: Profile;
  settings: UserSettings;
  streak: Streak;
}
```

#### PUT /api/users/me/profile
```typescript
Request: {
  name?: string;
  nativeLanguage?: string;
  proficiencyLevel?: string;
  interests?: string[];
  learningGoals?: string[];
  dailyGoalMinutes?: number;
}
Response: Profile
```

### Conversation Module

#### POST /api/conversations
```typescript
Request: {
  mode: "free" | "lesson" | "roleplay" | "interview" | "shadowing";
  topic?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}
Response: Conversation
```

#### GET /api/conversations
```typescript
Query: {
  page?: number;
  limit?: number;
  mode?: string;
  status?: "active" | "completed";
}
Response: {
  items: Conversation[];
  meta: PaginationMeta;
}
```

#### GET /api/conversations/:id
```typescript
Response: {
  conversation: Conversation;
  messages: Message[];
  feedback?: ConversationFeedback;
}
```

### WebSocket Events

#### Connect
```
ws://localhost:3001/ws/conversation/:conversationId
Headers: { Authorization: "Bearer <token>" }
```

#### Client Events
```typescript
// Start conversation
{ event: "conversation:start", data: { mode: "free" } }

// Send voice
{ event: "voice:stream", data: { audio: Blob, sequence: number } }

// End voice segment
{ event: "voice:end", data: { duration: number } }

// Send text
{ event: "conversation:message", data: { content: string } }

// Request feedback
{ event: "conversation:feedback", data: {} }
```

#### Server Events
```typescript
// Transcript update
{ event: "conversation:transcript", data: { text: string, isFinal: boolean } }

// AI response (streaming)
{ event: "conversation:message", data: { 
  id: string, role: "assistant", content: string, isStreaming: true 
} }

// AI response (complete)
{ event: "conversation:message", data: {
  id: string, role: "assistant", content: string, audioUrl?: string,
  corrections?: Correction[], scores?: Scores
} }

// Pronunciation feedback
{ event: "conversation:pronunciation", data: {
  word: string, score: number, phonemes: PhonemeError[]
} }

// Progress update
{ event: "progress:update", data: { xp: number, level: number, streak: number } }

// Achievement unlock
{ event: "achievement:unlock", data: { code: string, title: string } }
```

### Voice Module

#### POST /api/voice/upload
```typescript
Request: FormData { audio: File }
Response: {
  url: string;
  durationMs: number;
  transcript: string;
  confidence: number;
}
```

#### POST /api/voice/analyze
```typescript
Request: {
  audioUrl: string;
  expectedText: string;
}
Response: {
  overallScore: number;
  phonemeScores: { phoneme: string; score: number }[];
  errorMap: { word: string; actual: string; expected: string }[];
  recommendations: string[];
}
```

### Vocabulary Module

#### GET /api/vocabulary
```typescript
Query: { status?: string; page?: number; limit?: number; search?: string }
Response: { items: VocabularyItem[]; meta: PaginationMeta }
```

#### POST /api/vocabulary
```typescript
Request: {
  word: string;
  definition?: string;
  exampleSentence?: string;
  context?: string;
}
Response: VocabularyItem
```

### Progress Module

#### GET /api/progress/overview
```typescript
Response: {
  totalSessions: number;
  totalMinutes: number;
  totalWords: number;
  avgPronunciationScore: number;
  avgGrammarScore: number;
  vocabularySize: number;
  weeklyActivity: { date: string; minutes: number }[];
  weakAreas: { type: string; name: string; score: number }[];
  recentMilestones: { title: string; date: string }[];
}
```

### Gamification Module

#### GET /api/gamification/xp
```typescript
Query: { days?: number }
Response: {
  total: number;
  history: { date: string; amount: number; reason: string }[];
  level: number;
  xpToNextLevel: number;
}
```

#### GET /api/gamification/leaderboard
```typescript
Query: { period?: "weekly" | "monthly" | "all"; limit?: number }
Response: {
  entries: { rank: number; userId: string; name: string; xp: number; avatarUrl?: string }[];
  userRank: number;
}
```

## Rate Limiting
```typescript
Headers:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1620000000

Limits:
  Auth endpoints: 10 requests/minute
  API endpoints: 100 requests/minute
  AI endpoints: 20 requests/minute
  Voice upload: 10 MB/minute
```
