# Phase 8 — Frontend Architecture

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS 3
- **Components**: Shadcn UI (customized)
- **Animation**: Framer Motion
- **State**: Zustand
- **Server State**: TanStack React Query
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io-client
- **PWA**: next-pwa or Serwist
- **Icons**: Material Symbols Rounded (via @material-symbols/react- rounded)

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx                 // Root layout
│   ├── page.tsx                   // Redirect to dashboard
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (onboarding)/
│   │   ├── layout.tsx
│   │   ├── welcome/
│   │   ├── level-test/
│   │   ├── interests/
│   │   └── goals/
│   └── (main)/
│       ├── layout.tsx             // Bottom tab bar wrapper
│       ├── dashboard/
│       ├── practice/
│       │   ├── conversation/
│       │   ├── lesson/
│       │   ├── roleplay/
│       │   └── interview/
│       ├── progress/
│       │   ├── overview/
│       │   ├── pronunciation/
│       │   ├── grammar/
│       │   └── vocabulary/
│       ├── vocabulary/
│       │   ├── page.tsx
│       │   └── [wordId]/
│       ├── leaderboard/
│       ├── profile/
│       │   ├── page.tsx
│       │   ├── achievements/
│       │   └── settings/
│       └── subscription/
├── components/
│   ├── ui/                        // Shadcn base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   ├── sheet.tsx
│   │   └── toast.tsx
│   ├── shared/                    // Shared app components
│   │   ├── BottomNav.tsx
│   │   ├── TopBar.tsx
│   │   ├── StreakBadge.tsx
│   │   ├── XpDisplay.tsx
│   │   ├── LevelBadge.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── WaveformAnimation.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── LoadingOverlay.tsx
│   │   └── ErrorBoundary.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── OAuthButtons.tsx
│   │   ├── onboarding/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── LevelTest.tsx
│   │   │   └── InterestPicker.tsx
│   │   ├── dashboard/
│   │   │   ├── DailyGoalCard.tsx
│   │   │   ├── ContinueSessionCard.tsx
│   │   │   ├── QuickPracticeCards.tsx
│   │   │   ├── WeakAreasCard.tsx
│   │   │   └── SuggestedLessons.tsx
│   │   ├── conversation/
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── VoiceRecorder.tsx
│   │   │   ├── FeedbackPanel.tsx
│   │   │   ├── PronunciationScore.tsx
│   │   │   └── ConversationHeader.tsx
│   │   ├── practice/
│   │   │   ├── ModeSelector.tsx
│   │   │   ├── RoleplaySetup.tsx
│   │   │   └── InterviewSetup.tsx
│   │   ├── progress/
│   │   │   ├── StatsGrid.tsx
│   │   │   ├── PronunciationChart.tsx
│   │   │   ├── GrammarChart.tsx
│   │   │   ├── VocabularyChart.tsx
│   │   │   ├── ActivityHeatmap.tsx
│   │   │   └── MilestoneTimeline.tsx
│   │   ├── vocabulary/
│   │   │   ├── WordCard.tsx
│   │   │   ├── WordList.tsx
│   │   │   └── Flashcards.tsx
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── StatsDisplay.tsx
│   │   │   ├── AchievementGrid.tsx
│   │   │   └── BadgeDisplay.tsx
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardList.tsx
│   │   │   ├── LeaderboardCard.tsx
│   │   │   └── LeaderboardTabs.tsx
│   │   └── subscription/
│   │       ├── PlanCard.tsx
│   │       └── FeatureComparison.tsx
│   └── animations/
│       ├── FadeIn.tsx
│       ├── SlideUp.tsx
│       ├── ScaleIn.tsx
│       └── AnimatedCounter.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useConversation.ts
│   ├── useVoiceRecorder.ts
│   ├── useSpeechRecognition.ts
│   ├── useProgress.ts
│   ├── useVocabulary.ts
│   ├── useWebSocket.ts
│   ├── useMediaQuery.ts
│   ├── useHaptic.ts
│   └── useDebounce.ts
├── stores/
│   ├── auth.store.ts
│   ├── app.store.ts
│   └── conversation.store.ts
├── services/
│   ├── api.ts                    // Axios instance
│   ├── auth.service.ts
│   ├── conversation.service.ts
│   ├── voice.service.ts
│   ├── progress.service.ts
│   ├── vocabulary.service.ts
│   └── gamification.service.ts
├── lib/
│   ├── utils.ts                  // cn() helper
│   ├── constants.ts
│   ├── validators.ts
│   └── audio.ts                  // Audio helpers
├── types/
│   ├── api.ts
│   ├── user.ts
│   ├── conversation.ts
│   ├── vocabulary.ts
│   ├── gamification.ts
│   └── progress.ts
├── providers/
│   ├── AuthProvider.tsx
│   ├── QueryProvider.tsx
│   ├── ThemeProvider.tsx
│   └── SocketProvider.tsx
└── styles/
    ├── globals.css
    └── theme.ts
```

## Component Principles
- **Composition over configuration** – Small, focused components
- **Server components where possible** – Reduce client bundle
- **Progressive enhancement** – Works without JS for basic content
- **Accessibility** – ARIA labels, keyboard nav, screen reader support
- **Mobile-first** – All components designed for touch first

## State Management Strategy

| State Type | Solution | Example |
|---|---|---|
| Server state | React Query | Conversations, Progress, Vocabulary |
| Auth state | Zustand | User, Token, Session |
| UI state | Zustand | Theme, BottomNav open, Modals |
| Form state | React Hook Form | Login, Signup, Settings |
| Real-time | Socket.io | Active conversation, Notifications |

## Performance Targets
- Lighthouse score > 95 on mobile
- FCP < 1.5s
- TTI < 3s
- Bundle size < 200KB (initial)
- Offline support via service worker
- Image optimization via next/image
- Font optimization with next/font
