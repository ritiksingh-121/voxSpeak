# Phase 7 — Backend Architecture

## Technology Stack
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS (latest)
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Queue**: BullMQ
- **Validation**: Zod + class-validator
- **Auth**: Better Auth (JWT + OAuth)
- **Real-time**: Socket.io
- **File Storage**: MinIO (S3-compatible)
- **Vector DB**: Qdrant

## NestJS Module Architecture

```
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── throttle.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   ├── transform.interceptor.ts
│   │   └── timeout.interceptor.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   ├── middlewares/
│   │   └── request-id.middleware.ts
│   └── dto/
│       ├── pagination.dto.ts
│       └── api-response.dto.ts
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── google.strategy.ts
│   │   │   └── github.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── forgot-password.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       ├── update-profile.dto.ts
│   │       └── update-settings.dto.ts
│   ├── conversations/
│   │   ├── conversations.module.ts
│   │   ├── conversations.controller.ts
│   │   ├── conversations.service.ts
│   │   ├── conversations.gateway.ts  (WebSocket)
│   │   └── dto/
│   │       ├── start-conversation.dto.ts
│   │       └── send-message.dto.ts
│   ├── voice/
│   │   ├── voice.module.ts
│   │   ├── voice.controller.ts
│   │   ├── voice.service.ts
│   │   └── voice.processor.ts (Bull worker)
│   ├── ai/
│   │   ├── ai.module.ts
│   │   ├── ai.service.ts
│   │   ├── ai.processor.ts (Bull worker)
│   │   ├── prompts/
│   │   │   ├── conversation.prompt.ts
│   │   │   ├── grammar.prompt.ts
│   │   │   ├── pronunciation.prompt.ts
│   │   │   └── feedback.prompt.ts
│   │   └── llm.service.ts
│   ├── vocabulary/
│   │   ├── vocabulary.module.ts
│   │   ├── vocabulary.controller.ts
│   │   ├── vocabulary.service.ts
│   │   └── dto/
│   │       └── save-word.dto.ts
│   ├── progress/
│   │   ├── progress.module.ts
│   │   ├── progress.controller.ts
│   │   ├── progress.service.ts
│   │   └── analytics.service.ts
│   ├── gamification/
│   │   ├── gamification.module.ts
│   │   ├── gamification.service.ts
│   │   ├── xp.service.ts
│   │   ├── achievement.service.ts
│   │   ├── streak.service.ts
│   │   └── leaderboard.service.ts
│   ├── notifications/
│   │   ├── notifications.module.ts
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   └── notifications.gateway.ts
│   └── subscription/
│       ├── subscription.module.ts
│       ├── subscription.controller.ts
│       └── subscription.service.ts
├── queue/
│   ├── queue.module.ts
│   └── queue.service.ts
├── storage/
│   ├── storage.module.ts
│   └── storage.service.ts (MinIO wrapper)
├── search/
│   ├── search.module.ts
│   └── search.service.ts (Qdrant wrapper)
└── config/
    ├── config.module.ts
    └── config.service.ts (env vars)
```

## API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | /api/auth/register | Register with email |
| POST | /api/auth/login | Login with email |
| POST | /api/auth/oauth/google | Google OAuth |
| POST | /api/auth/oauth/github | GitHub OAuth |
| POST | /api/auth/refresh | Refresh token |
| POST | /api/auth/logout | Logout |

### Users
| Method | Path | Description |
|---|---|---|
| GET | /api/users/me | Get current user |
| PUT | /api/users/me/profile | Update profile |
| PUT | /api/users/me/settings | Update settings |
| GET | /api/users/me/stats | Get user stats |

### Conversations
| Method | Path | Description |
|---|---|---|
| POST | /api/conversations | Start new conversation |
| GET | /api/conversations | List conversations |
| GET | /api/conversations/:id | Get conversation detail |
| DELETE | /api/conversations/:id | Delete conversation |
| WS | /ws/conversation/:id | Real-time conversation |

### Voice
| Method | Path | Description |
|---|---|---|
| POST | /api/voice/upload | Upload voice recording |
| POST | /api/voice/analyze | Analyze pronunciation |

### Vocabulary
| Method | Path | Description |
|---|---|---|
| GET | /api/vocabulary | List saved words |
| POST | /api/vocabulary | Save new word |
| PUT | /api/vocabulary/:id | Update word status |
| DELETE | /api/vocabulary/:id | Delete word |
| GET | /api/vocabulary/weak | Get weak words |

### Progress
| Method | Path | Description |
|---|---|---|
| GET | /api/progress/overview | Dashboard data |
| GET | /api/progress/pronunciation | Pronunciation analytics |
| GET | /api/progress/grammar | Grammar analytics |
| GET | /api/progress/vocabulary | Vocabulary analytics |

### Gamification
| Method | Path | Description |
|---|---|---|
| GET | /api/gamification/xp | XP history |
| GET | /api/gamification/achievements | Achievement list |
| GET | /api/gamification/streak | Streak info |
| GET | /api/gamification/leaderboard | Leaderboard |

### Notifications
| Method | Path | Description |
|---|---|---|
| GET | /api/notifications | List notifications |
| PUT | /api/notifications/:id/read | Mark as read |

## WebSocket Events

### Client → Server
| Event | Payload | Description |
|---|---|---|
| conversation:join | { conversationId } | Join conversation room |
| conversation:leave | { conversationId } | Leave conversation |
| voice:stream | AudioChunk | Stream voice audio |
| voice:end | {} | End voice recording |
| typing:start | {} | User started typing |
| typing:end | {} | User stopped typing |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| conversation:message | Message | New AI response |
| conversation:transcript | { text } | Interim transcript |
| conversation:feedback | Feedback | Real-time feedback |
| conversation:error | { error } | Error message |
| typing:indicator | { userId } | AI is typing |
| progress:update | { xp, level } | XP/Lvl update |
| achievement:unlock | Achievement | New achievement |

## Queue Architecture

```
BullMQ Queues:
├── stt-queue      → Whisper transcription (1 worker)
├── tts-queue      → Piper/Coqui audio gen (1 worker)
├── ai-queue       → LLM inference (2 workers)
├── analysis-queue → Grammar + pronunciation (1 worker)
├── embedding-queue→ Vector embeddings (1 worker)
└── notification-queue → Push notifications (1 worker)
```

## Error Handling
- Global exception filter
- Structured error responses: `{ status, message, code, details }`
- Logging with correlation IDs
- Sentry integration for unhandled errors
