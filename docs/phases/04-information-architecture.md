# Phase 4 — Information Architecture

## Sitemap

```
app/
├── (auth)/
│   ├── login
│   ├── signup
│   └── forgot-password
├── (onboarding)/
│   ├── welcome
│   ├── level-test
│   ├── interests
│   └── goals
├── (main)/
│   ├── /
│   │   └── dashboard (home)
│   ├── practice/
│   │   ├── conversation (free speak)
│   │   ├── lesson (AI-generated)
│   │   ├── roleplay
│   │   ├── interview
│   │   └── shadowing
│   ├── progress/
│   │   ├── overview
│   │   ├── pronunciation
│   │   ├── grammar
│   │   ├── vocabulary
│   │   └── milestones
│   ├── vocabulary/
│   │   ├── saved-words
│   │   ├── flashcards
│   │   └── weak-words
│   ├── leaderboard/
│   │   ├── global
│   │   ├── friends
│   │   └── weekly
│   ├── profile/
│   │   ├── stats
│   │   ├── achievements
│   │   ├── badges
│   │   └── settings
│   └── subscription/
│       ├── plans
│       └── manage
```

## Navigation Structure (Bottom Tab Bar)

| Tab | Icon | Screens |
|---|---|---|
| Home | home | Dashboard |
| Practice | mic | Conversation, Lesson, Roleplay, Interview |
| Progress | trending-up | Overview, Pronunciation, Grammar, Vocabulary |
| Learn | menu-book | Vocabulary, Saved Words, Weak Words |
| Profile | person | Stats, Achievements, Settings |

## User Flows

### First-time user flow
```
Sign Up → Onboarding (level test, interests, goals) → Dashboard → First conversation
```

### Daily practice flow
```
Open App → Dashboard (daily goal, streak, continue session) → Tap "Practice" → AI Conversation → Feedback → XP Awarded
```

### Conversation flow
```
Select Mode (Free / Lesson / Roleplay / Interview) → AI Greeting → User Speaks → STT → AI Processes → Response → TTS → Feedback
```

### Progress review flow
```
Progress Tab → Select area (Pronunciation / Grammar / Vocabulary) → Detailed analytics → Weak areas → Recommended practice
```

## Content Hierarchy on Dashboard

```
┌─────────────────────────────┐
│  Greeting, Streak, XP       │  ← Top bar
│  "Good morning, Alex!"      │
├─────────────────────────────┤
│  Daily Goal Progress        │  ← Circular progress
│  67% complete               │
├─────────────────────────────┤
│  Continue Session           │  ← Primary CTA
│  "Your last conversation"   │
├─────────────────────────────┤
│  Quick Practice Cards       │  ← Horizontal scroll
│  [Free Talk] [Lesson] [RP]  │
├─────────────────────────────┤
│  Today's Weak Areas         │  ← AI-suggested
│  - "th" pronunciation       │
│  - Present perfect tense    │
├─────────────────────────────┤
│  Weekly Activity Heatmap    │  ← Mini chart
├─────────────────────────────┤
│  Suggested Lessons          │  ← AI-curated
│  Card 1 | Card 2 | Card 3   │
└─────────────────────────────┘
```

## Search & Filter
- Vocabulary search by word, category, date
- Session history filter by date, mode, topic
- Global search across conversations, vocabulary, lessons
