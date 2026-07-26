# Phase 20 — Future Premium Upgrades

## Philosophy
Core features remain **free forever**.
Premium is optional and only adds convenience, advanced analytics, and exclusive content.

## Premium Features (Future — Post-MVP)

### Tier 1: Premium Monthly (\$9.99) / Yearly (\$59.99)

| Feature | Free | Premium |
|---|---|---|
| Daily conversation time | 30 min/day | Unlimited |
| AI memory (conversations) | Last 50 | Full history |
| Pronunciation analysis | Basic | Advanced phoneme heatmap |
| Grammar correction | Real-time | Detailed explanations |
| Vocabulary | 100 words | Unlimited |
| TTS voices | 2 voices | 10+ premium voices |
| Roleplay scenarios | 5 scenarios | 50+ scenarios |
| Interview mode | 3 templates | 20+ templates |
| Progress analytics | Basic | Detailed + trends |
| Weekly challenges | Basic | Premium challenges |
| Offline mode | ❌ | ✅ |
| Ad-free | Standard | Absolutely ad-free |

### Tier 2: Premium Plus (\$19.99/month)

Everything in Premium, plus:
- 1:1 AI coaching sessions (structured daily lessons)
- Native language support for explanations
- Personalized vocabulary lists based on interests
- Priority AI processing (faster responses)
- Export conversation history (PDF)
- Advanced speech analytics (intonation, stress, rhythm)
- Personalized pronunciation training plan
- Access to new features 2 weeks early

### Tier 3: Lifetime (\$199.99)

Everything in Premium Plus, forever.

## Monetization Strategy

### Launch (Month 1-6)
- 100% free — build user base
- No payment required

### Premium Introduction (Month 6+)
- Introduce Premium tier
- Existing free users keep all features they had
- New users get 30 min/day free
- 7-day free trial for Premium

### Growth (Month 12+)
- Premium Plus introduced
- Referral program (1 month free per referral)
- Student discount (50% off)
- Annual plan with 2 months free

## Technology for Payments

### Free Options (No Fees)
- **Lemon Squeezy**: 5% + \$0.50 per transaction
- **Paddle**: 5% + \$0.50
- **Stripe**: 2.9% + \$0.30 (not free, but standard)

### Why LemonSqueezy?
- No monthly fee
- Built-in tax handling (VAT, GST)
- License key generation
- Checkout page (no coding needed)
- Webhooks for subscription management
- Affordable for small projects

## Optional Premium Upgrade Path

### 1. OpenAI/GPT-4 Integration
- **Cost**: \$0.01–\$0.03 per conversation
- **Use case**: Premium users get GPT-4 quality responses
- **Free alternative**: Local Llama 3.1 remains good enough
- **When to add**: When paying users demand higher quality

### 2. Dedicated GPU for AI
- **Cost**: \$30–\$100/month for GPU VPS
- **Use case**: Faster inference for premium users
- **Free alternative**: CPU inference (slower but fine)
- **When to add**: When latency complaints arise from premium users

### 3. Analytics & Insights
- **Cost**: Free (PostHog self-hosted)
- **Use case**: Detailed learning patterns
- **Value**: Users see exactly how they improve over time

### 4. Native Mobile Apps
- **Cost**: \$99/year (Apple Developer) + \$25 (Google Play one-time)
- **Use case**: Better mobile experience
- **Technology**: React Native or Expo
- **When to add**: After web PWA proves product-market fit

### 5. Custom Fine-tuned Models
- **Cost**: ~\$100 for LoRA fine-tuning (compute)
- **Use case**: AI optimized specifically for English teaching
- **Technology**: Unsloth + Llama 3.1
- **Value**: Better corrections, more natural teaching style

## Features NOT Behind Paywall (Always Free)
- Speaking practice (core mission)
- Basic pronunciation feedback
- Grammar correction
- Streak tracking
- Basic vocabulary
- Daily conversation (30 min)
- Basic progress tracking
- Community leaderboard

## The "Premium" Difference
Premium should feel like a **boost**, not a **wall**.
Users should never feel the free tier is crippled.
The free tier should be genuinely useful for daily practice.
Premium removes limits and adds depth.

## Pricing Comparison

| App | Free Tier | Premium Price |
|---|---|---|
| Duolingo | Good, with ads | \$6.99/mo |
| ELSA Speak | Very limited | \$11.99/mo |
| Nova AI | 5 min/day | \$14.99/mo |
| Babbel | No free tier | \$12.95/mo |
| Cambly | No free tier | \$15–\$45/mo |
| Cake | Limited | \$9.99/mo |
| **VoxSpeak** | **30 min/day (generous)** | **\$9.99/mo** |
