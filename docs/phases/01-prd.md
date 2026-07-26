# Phase 1 — Product Requirement Document (PRD)

## Product Name
**VoxSpeak** — AI English Speaking Coach

## Tagline
*Your personal AI English coach. Always with you.*

## Elevator Pitch
VoxSpeak is an AI-powered English speaking coach that provides unlimited conversational practice, real-time pronunciation feedback, personalized lessons, and long-term adaptive learning. Unlike gamified language apps that focus on vocabulary drills, VoxSpeak prioritizes real spoken conversation. The AI remembers every user, their mistakes, their progress, and adapts every session to maximize improvement.

## Problem Statement
Millions of English learners worldwide struggle with **speaking confidence**. Existing solutions:
- **Duolingo**: gamified vocabulary, minimal speaking practice
- **ELSA Speak**: pronunciation only, no real conversation
- **Cambly**: human tutors — expensive, not scalable, \$5–\$15/hour
- **Cake**: short video clips, no AI coaching
- **Nova AI**: limited free tier, uses GPT-4 behind paywall

**The gap**: No free, high-quality, AI-powered speaking coach that combines conversation, pronunciation, grammar, vocabulary, and long-term memory into one seamless mobile experience.

## Product Vision
Build the world's most accessible, intelligent, and personalized AI English speaking coach — free forever for basic usage, powered entirely by open-source AI.

## Target Audience
- **Primary**: Intermediate English learners (B1–B2) aged 18–35
- **Secondary**: Beginners (A1–A2) and advanced (C1–C2)
- **Niche**: IELTS/TOEFL candidates, job seekers, software engineers, business professionals, travelers

## Core Differentiators
| Feature | Duolingo | ELSA Speak | Nova AI | VoxSpeak |
|---|---|---|---|---|
| Free unlimited speaking | ❌ | ❌ | ❌ | ✅ |
| Long-term AI memory | ❌ | ❌ | ❌ | ✅ |
| Pronunciation feedback | ❌ | ✅ | ❌ | ✅ |
| Grammar correction | Basic | ❌ | ✅ | ✅ |
| Personalized lessons | ❌ | ❌ | ❌ | ✅ |
| Interview coach | ❌ | ❌ | ❌ | ✅ |
| Open-source stack | ❌ | ❌ | ❌ | ✅ |
| Offline mode | ❌ | ❌ | ❌ | ✅ (future) |

## Platform
- **Mobile-first**: React Native or PWA (Progressive Web App)
- **Web**: Next.js PWA with full mobile support
- **Offline**: Service worker + local Whisper model (future)

## Business Model
- **Free**: Core features, limited daily conversations (30 min/day)
- **Premium (optional future)**: Unlimited conversations, advanced analytics, offline mode, priority AI

## Success Metrics
- DAU/MAU ratio > 40%
- Average session length > 15 minutes
- User retention at D7 > 50%, D30 > 30%
- Pronunciation accuracy improvement > 30% after 30 days
- NPS > 50

## Constraints
- **Zero budget** for paid APIs, cloud services, or premium models
- **Solo developer** — architecture must be simple to maintain
- **Open-source only** — every dependency must be self-hostable or community edition
