# Phase 15 — Development Roadmap

## Timeline Overview (Solo Developer)

```
Week 1-2:   Foundation (Auth, DB, Project Setup)
Week 3-4:   Core Conversation (AI Chat)
Week 5-6:   Voice Pipeline (STT + TTS)
Week 7-8:   Dashboard + Profile
Week 9-10:  Progress + Analytics
Week 11-12: Gamification + Vocabulary
Week 13-14: Advanced Features (Roleplay, Interview)
Week 15-16: Polish + Beta Launch
```

## Detailed Weekly Plan

### Week 1-2: Foundation
```
Day 1-2:   Monorepo setup (pnpm, Turborepo, TypeScript)
Day 3-4:   Prisma schema + PostgreSQL + Redis setup
Day 5-6:   Auth system (register, login, JWT, OAuth)
Day 7-8:   OAuth (Google, GitHub) integration
Day 9-10:  Basic API structure (NestJS modules)
Day 11-12: Shared types package + validators
Day 13-14: Docker Compose + CI/CD
```

### Week 3-4: Core Conversation
```
Day 15-16: Ollama setup + LLM integration
Day 17-18: AI prompt engineering + system prompts
Day 19-20: Conversation API endpoints
Day 21-22: WebSocket connection + real-time messaging
Day 23-24: Frontend conversation UI (chat bubbles)
Day 25-26: Conversation management (history, resume)
Day 27-28: Error handling + edge cases
```

### Week 5-6: Voice Pipeline
```
Day 29-30: Audio capture in browser (MediaRecorder)
Day 31-32: Whisper.cpp/Faster Whisper integration
Day 33-34: Piper TTS integration
Day 35-36: Voice upload + queue processing
Day 37-38: Real-time voice streaming via WebSocket
Day 39-40: VAD + silence detection
Day 41-42: End-to-end voice conversation flow
```

### Week 7-8: Dashboard + Profile
```
Day 43-44: Dashboard layout + components
Day 45-46: Daily goal + streak display
Day 47-48: Continue session card + quick practice
Day 49-50: Profile page + stats
Day 51-52: Settings page (theme, TTS, notifications)
Day 53-54: Onboarding flow (welcome, level test)
Day 55-56: Responsive design + mobile testing
```

### Week 9-10: Progress + Analytics
```
Day 57-58: Progress overview charts
Day 59-60: Pronunciation analytics
Day 61-62: Grammar analytics
Day 63-64: Vocabulary analytics
Day 65-66: Activity heatmap + streaks
Day 67-68: Weak areas tracking + recommendations
Day 69-70: Progress API + data aggregation
```

### Week 11-12: Gamification + Vocabulary
```
Day 71-72: XP system + leveling
Day 73-74: Achievement system + badges
Day 75-76: Daily/weekly missions
Day 77-78: Leaderboard
Day 79-80: Vocabulary saving + flashcards
Day 81-82: Spaced repetition for vocabulary
Day 83-84: Notification system
```

### Week 13-14: Advanced Features
```
Day 85-86: Roleplay scenarios system
Day 87-88: Interview coach mode
Day 89-90: Shadowing mode
Day 91-92: RAG memory system (Qdrant)
Day 93-94: Personalized lesson generation
Day 95-96: Grammar correction engine
Day 97-98: Pronunciation feedback engine
```

### Week 15-16: Polish + Launch
```
Day 99-100: UI polish + animations
Day 101-102: Loading states + error handling
Day 103-104: Performance optimization
Day 105-106: Security audit + testing
Day 107-108: Documentation
Day 109-110: Beta launch + feedback collection
Day 111-112: Bug fixes + iteration
```

## Total: 16 weeks (4 months) for MVP launch

## Key Milestones

| Milestone | Date | Deliverable |
|---|---|---|
| M1 | Week 2 | Working auth + database |
| M2 | Week 4 | AI text conversation works |
| M3 | Week 6 | Voice conversation works |
| M4 | Week 8 | Dashboard + profile complete |
| M5 | Week 10 | Progress tracking works |
| M6 | Week 12 | Gamification complete |
| M7 | Week 14 | All core features done |
| M8 | Week 16 | Beta launch |

## Post-Launch Roadmap

### Month 5-6
- User feedback integration
- Performance optimization
- Bug fixes
- Additional roleplay scenarios
- More TTS voices

### Month 7-8
- IELTS/TOEFL preparation mode
- Debate mode
- Business English scenarios
- Kids mode

### Month 9-10
- Offline mode (Vosk + smaller models)
- Advanced pronunciation heatmap
- Emotion/confidence detection
- Premium subscription (optional)

### Month 11-12
- Mobile apps (React Native)
- Fine-tuned LLM models
- Community features
- Public API for developers
