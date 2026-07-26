# Phase 16 — Sprint Planning

## Sprint Structure
- **Duration**: 2 weeks per sprint
- **Ceremonies**: Solo planning day 1, review last day
- **Velocity**: 10–15 story points per sprint

## Sprint 1: Foundation
```
Theme: Project Setup + Database + Auth
Goals:
  - Monorepo setup (pnpm, Turborepo, TypeScript)
  - Prisma schema + migrations
  - Docker Compose for all services
  - Auth system (register, login, JWT)
  - Better Auth integration
  - Basic NestJS app skeleton

User Stories:
  - As a user, I can create an account
  - As a user, I can log in with email/password
  - As a user, I can log in with Google/GitHub

Story Points: 13
```

## Sprint 2: Core API
```
Theme: API Structure + Shared Types + User Profile
Goals:
  - All NestJS modules scaffolded
  - Shared types package
  - User CRUD endpoints
  - Profile management
  - Settings management
  - Error handling + validation

User Stories:
  - As a user, I can view my profile
  - As a user, I can update my profile
  - As a user, I can change my settings

Story Points: 11
```

## Sprint 3: AI Conversation (Text)
```
Theme: LLM Integration + Conversation API
Goals:
  - Ollama setup + model download
  - LLM service with streaming
  - Conversation CRUD endpoints
  - Prompt engineering
  - WebSocket gateway setup
  - Text-based conversation flow

User Stories:
  - As a user, I can start a new conversation
  - As a user, I can send text messages to AI
  - As a user, I can receive AI responses
  - As a user, I can see conversation history

Story Points: 13
```

## Sprint 4: Frontend Foundation
```
Theme: Next.js App + Navigation + Components
Goals:
  - Next.js app with App Router
  - Tailwind + Shadcn UI setup
  - Bottom tab navigation
  - Auth pages (login, signup)
  - API service layer
  - Zustand stores

User Stories:
  - As a user, I can navigate the app
  - As a user, I can log in via the UI
  - As a user, I can see the home screen

Story Points: 10
```

## Sprint 5: Voice Pipeline
```
Theme: STT + TTS + Voice Recording
Goals:
  - Audio capture in browser
  - Whisper integration (REST API)
  - Piper TTS integration
  - Voice upload endpoint
  - Voice message in conversation

User Stories:
  - As a user, I can record my voice
  - As a user, my speech is transcribed
  - As a user, I hear AI responses spoken

Story Points: 14
```

## Sprint 6: Conversation UI
```
Theme: Chat Interface + Voice Mode
Goals:
  - Chat bubble components
  - Voice recorder UI
  - Real-time transcription display
  - Audio playback
  - Typing indicator
  - Waveform animation

User Stories:
  - As a user, I can have a voice conversation with AI
  - As a user, I see real-time transcription
  - As a user, I see AI typing indicator

Story Points: 11
```

## Sprint 7: Dashboard + Onboarding
```
Theme: Home Screen + First-time Experience
Goals:
  - Dashboard layout
  - Daily goal progress
  - Streak display
  - Continue session card
  - Quick practice cards
  - Onboarding flow (4 steps)
  - Level test

User Stories:
  - As a user, I see my daily progress
  - As a user, I can continue my last session
  - As a user, I complete onboarding quickly

Story Points: 10
```

## Sprint 8: Progress Tracking
```
Theme: Analytics + Charts + Weak Areas
Goals:
  - Progress overview page
  - Pronunciation analytics chart
  - Grammar analytics chart
  - Vocabulary analytics chart
  - Activity heatmap
  - Weak areas detection

User Stories:
  - As a user, I can see my progress
  - As a user, I know my weak areas
  - As a user, I see my weekly activity

Story Points: 12
```

## Sprint 9: Gamification
```
Theme: XP + Levels + Streaks + Achievements
Goals:
  - XP system backend
  - Level progression
  - Achievement triggers + badges
  - Streak tracking
  - Gamification UI components
  - XP animations

User Stories:
  - As a user, I earn XP for speaking
  - As a user, I unlock achievements
  - As a user, I maintain my streak

Story Points: 11
```

## Sprint 10: Vocabulary
```
Theme: Word Management + Flashcards
Goals:
  - Vocabulary backend API
  - AI vocabulary extraction
  - Save words from conversations
  - Word list UI
  - Flashcards mode
  - Spaced repetition algorithm

User Stories:
  - As a user, new words are saved automatically
  - As a user, I can review my vocabulary
  - As a user, I practice with flashcards

Story Points: 10
```

## Sprint 11: Advanced Modes
```
Theme: Roleplay + Interview + Shadowing
Goals:
  - Roleplay system (scenarios, characters)
  - Interview coach mode
  - Shadowing mode
  - Mode selector UI
  - Different prompt templates

User Stories:
  - As a user, I can practice job interviews
  - As a user, I can roleplay real scenarios
  - As a user, I can practice shadowing

Story Points: 13
```

## Sprint 12: Memory + Personalization
```
Theme: RAG + Long-term Memory + Smart Recommendations
Goals:
  - Qdrant setup + collections
  - Embedding generation pipeline
  - Memory retrieval in prompts
  - Personalized lesson generation
  - Smart recommendations on dashboard
  - Weak area focused practice

User Stories:
  - As a user, AI remembers my past conversations
  - As a user, lessons are personalized to me
  - As a user, AI recommends what to practice

Story Points: 12
```

## Sprint 13: Social + Leaderboard
```
Theme: Community + Competition
Goals:
  - Leaderboard (global, friends, weekly)
  - Friend system (add, remove)
  - Daily/weekly missions
  - Notification preferences
  - Push notifications

User Stories:
  - As a user, I can see the leaderboard
  - As a user, I can add friends
  - As a user, I compete in weekly missions

Story Points: 10
```

## Sprint 14: Profile + Settings
```
Theme: User Profile + Badges + Achievements
Goals:
  - Profile page with stats
  - Achievement grid view
  - Badge display
  - Settings page (all options)
  - Theme toggle (dark/light)

User Stories:
  - As a user, I can see my achievements
  - As a user, I can customize my experience
  - As a user, I can switch themes

Story Points: 8
```

## Sprint 15: Polish + Performance
```
Theme: Animations + Loading + Optimization
Goals:
  - Framer Motion animations throughout
  - Loading states + skeletons
  - Error boundaries
  - Image optimization
  - Bundle size optimization
  - PWA setup

User Stories:
  - As a user, the app feels smooth
  - As a user, I see loading states
  - As a user, I can install the PWA

Story Points: 10
```

## Sprint 16: Launch Prep
```
Theme: Testing + Security + Documentation
Goals:
  - Integration tests (critical paths)
  - Security audit
  - Performance audit (Lighthouse)
  - API documentation
  - Deployment scripts
  - Monitoring setup

User Stories:
  - As a developer, the app is ready for production
  - As a user, my data is secure

Story Points: 10
```
