# VoxSpeak — AI English Speaking Coach

Your personal AI English coach. Always with you.

## Architecture

```
apps/
├── web/          Next.js PWA (Mobile-first Frontend)
├── api/          NestJS Backend (REST + WebSocket)
└── ai-service/   Python AI Service (STT, TTS, LLM)

packages/
├── shared/       Shared TypeScript types, validators, constants
└── database/     Prisma schema, migrations, seed data
```

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14, Tailwind CSS, Shadcn UI, Framer Motion | Mobile-first PWA, premium UI |
| Backend | NestJS, Prisma, BullMQ, Socket.io | Type-safe, modular, real-time |
| Database | PostgreSQL, Redis, Qdrant, MinIO | Free, self-hostable, scalable |
| AI | Ollama, Faster Whisper, Piper TTS, BGE | 100% free, local, private |
| Auth | Better Auth, JWT, OAuth | Open-source, built-in rate limiting |
| Dev Tools | Turborepo, pnpm, Docker, Playwright | Monorepo, fast builds |

## Key Features

- Unlimited AI voice conversations
- Real-time pronunciation feedback
- Grammar correction with explanations
- Long-term AI memory (RAG)
- Personalized adaptive lessons
- Roleplay & interview coach
- Gamification (XP, streaks, achievements)
- Progress analytics & weak area detection

## Quick Start

```bash
pnpm install
pnpm dev
```

## Deployment

See `docs/phases/13-deployment.md` for free deployment options including Oracle Cloud Free Tier.

## Documentation

All 20 planning phases are in `docs/phases/`:

| Phase | Title |
|---|---|
| 01 | Product Requirement Document |
| 02 | Competitor Analysis |
| 03 | Feature Prioritization |
| 04 | Information Architecture |
| 05 | Database Schema |
| 06 | System Architecture |
| 07 | Backend Architecture |
| 08 | Frontend Architecture |
| 09 | AI Architecture |
| 10 | Speech Architecture |
| 11 | API Documentation |
| 12 | Authentication |
| 13 | Deployment |
| 14 | Folder Structure |
| 15 | Development Roadmap |
| 16 | Sprint Planning |
| 17 | Testing Strategy |
| 18 | Scaling Strategy |
| 19 | Security |
| 20 | Future Premium Upgrades |

---

Built with ❤️ using 100% open-source technology.
