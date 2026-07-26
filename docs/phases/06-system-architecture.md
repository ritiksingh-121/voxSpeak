# Phase 6 — System Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Next.js PWA (Mobile-first Web App)              │   │
│  │  • Tailwind CSS • Shadcn UI • Framer Motion      │   │
│  │  • React Query • Zustand • React Hook Form        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │ HTTP / WebSocket
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   API Gateway Layer                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Next.js API Routes or NestJS Backend             │   │
│  │  • Rate limiting • Auth middleware               │   │
│  │  • Request validation (Zod)                      │   │
│  │  • WebSocket (Socket.io)                         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌──────────┐ ┌──────────────┐
│  Application    │ │  Queue   │ │  Real-time    │
│  Services       │ │  (Bull)  │ │  (Socket.io)  │
│  • Auth         │ │          │ │               │
│  • User         │ │  • AI    │ │  • Streaming  │
│  • Conversation │ │  • STT   │ │  • Progress   │
│  • Vocabulary   │ │  • TTS   │ │  • Notif      │
│  • Progress     │ │  • Anal  │ │               │
│  • Gamification │ │          │ │               │
└─────────────────┘ └──────────┘ └──────────────┘
        │                │
        ▼                ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │PostgreSQL│ │  Redis   │ │  Qdrant  │ │  MinIO   │  │
│  │(Primary) │ │ (Cache)  │ │(Vectors) │ │ (Files)  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│                    AI Layer                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Ollama  │ │ Whisper  │ │  Piper   │ │  BGE     │  │
│  │ (LLM)    │ │ (STT)    │ │ (TTS)    │ │(Embed)   │  │
│  │ Llama 3  │ │ Faster   │ │ Coqui    │ │ Sentence │  │
│  │ Mistral  │ │ Whisper  │ │ TTS      │ │ Trans.   │  │
│  │ DeepSeek │ │          │ │          │ │          │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Key Architecture Decisions

### Monolith First, Modular Later
- Single NestJS application with feature-based modules
- Easy to extract into microservices when needed
- Shared types via `packages/shared`

### Why NestJS?
- TypeScript-first
- Built-in DI, guards, interceptors, pipes
- WebSocket support natively
- Bull queue integration
- Prisma support
- Familiar for solo dev (structured but not overengineered)

### Why Next.js?
- Full-stack capable but used as frontend only
- PWA support out of the box
- App Router for mobile-like routing
- API routes can serve as BFF (backend for frontend) if needed
- Vercel-friendly but also self-hostable

### Why PostgreSQL + Prisma?
- Type-safe database access
- Migration management
- Relationship support
- Free, open-source, battle-tested
- Scales from SQLite (dev) to PostgreSQL (prod)

### Why Qdrant?
- Free, open-source vector database
- Self-hostable via Docker
- REST API + gRPC
- Built-in filtering and payloads
- Scales horizontally

### Why BullMQ?
- Redis-backed job queue
- Handle async AI processing
- Retry logic built-in
- Easy to monitor with Bull Board

## Data Flow: User Speaks

```
1. User records voice → Browser captures audio (MediaRecorder API)
2. Audio sent as blob via WebSocket or HTTP multipart
3. API receives audio → stores in MinIO → enqueues STT job
4. Bull worker picks job → runs Whisper.cpp → returns transcript
5. Transcript → Grammar engine → Pronunciation analysis → Vocabulary extraction
6. Conversation memory retrieved from Qdrant (RAG)
7. LLM prompt assembled with context + memory + goals
8. LLM (Ollama) generates response
9. Response → TTS (Piper/Coqui) → audio generated
10. Response + audio sent back to client via WebSocket
11. Client displays response, plays audio, shows feedback
```

## Scaling Strategy (1 → 10M users)

| Stage | Users | Architecture |
|---|---|---|
| 1 | 1–100 | Single VPS (Docker Compose) |
| 2 | 100–10K | Vertical scale + Redis + read replicas |
| 3 | 10K–100K | Horizontal API servers + queue workers |
| 4 | 100K–1M | Sharded DB + CDN + GPU workers |
| 5 | 1M–10M | Microservices + auto-scaling + global regions |

## Monitoring Stack
- **Grafana + Prometheus**: Metrics and dashboards
- **Sentry Free**: Error tracking
- **PostHog**: Product analytics (self-hosted)
- **Health endpoints**: `/health`, `/ready`, `/metrics`
