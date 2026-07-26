# Phase 14 — Complete Folder Structure

```
voxspeak/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── lint.yml
├── apps/
│   ├── web/                          # Next.js Frontend
│   │   ├── public/
│   │   │   ├── icons/
│   │   │   ├── images/
│   │   │   ├── manifest.json
│   │   │   ├── sw.js
│   │   │   └── robots.txt
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   ├── signup/page.tsx
│   │   │   │   │   └── forgot-password/page.tsx
│   │   │   │   ├── (onboarding)/
│   │   │   │   │   ├── welcome/page.tsx
│   │   │   │   │   ├── level-test/page.tsx
│   │   │   │   │   ├── interests/page.tsx
│   │   │   │   │   └── goals/page.tsx
│   │   │   │   ├── (main)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── dashboard/page.tsx
│   │   │   │   │   ├── practice/
│   │   │   │   │   │   ├── conversation/page.tsx
│   │   │   │   │   │   ├── lesson/page.tsx
│   │   │   │   │   │   ├── roleplay/page.tsx
│   │   │   │   │   │   └── interview/page.tsx
│   │   │   │   │   ├── progress/
│   │   │   │   │   │   ├── overview/page.tsx
│   │   │   │   │   │   ├── pronunciation/page.tsx
│   │   │   │   │   │   ├── grammar/page.tsx
│   │   │   │   │   │   └── vocabulary/page.tsx
│   │   │   │   │   ├── vocabulary/page.tsx
│   │   │   │   │   ├── leaderboard/page.tsx
│   │   │   │   │   ├── profile/page.tsx
│   │   │   │   │   ├── profile/achievements/page.tsx
│   │   │   │   │   ├── profile/settings/page.tsx
│   │   │   │   │   └── subscription/page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/              (shadcn)
│   │   │   │   ├── shared/
│   │   │   │   ├── features/
│   │   │   │   └── animations/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   ├── services/
│   │   │   ├── lib/
│   │   │   ├── types/
│   │   │   ├── providers/
│   │   │   └── styles/
│   │   ├── __tests__/
│   │   ├── tailwind.config.ts
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   ├── filters/
│   │   │   │   ├── pipes/
│   │   │   │   └── dto/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── conversations/
│   │   │   │   ├── voice/
│   │   │   │   ├── ai/
│   │   │   │   ├── vocabulary/
│   │   │   │   ├── progress/
│   │   │   │   ├── gamification/
│   │   │   │   ├── notifications/
│   │   │   │   └── subscription/
│   │   │   ├── queue/
│   │   │   ├── storage/
│   │   │   ├── search/
│   │   │   └── config/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── test/
│   │   ├── Dockerfile
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── ai-service/                   # Python AI Service
│       ├── src/
│       │   ├── main.py
│       │   ├── stt/
│       │   │   ├── whisper_service.py
│       │   │   └── vosk_service.py
│       │   ├── tts/
│       │   │   ├── piper_service.py
│       │   │   └── coqui_service.py
│       │   ├── llm/
│       │   │   ├── ollama_client.py
│       │   │   └── prompts.py
│       │   ├── embeddings/
│       │   │   └── embed_service.py
│       │   ├── pronunciation/
│       │   │   └── analyzer.py
│       │   ├── grammar/
│       │   │   └── checker.py
│       │   └── api/
│       │       ├── routes.py
│       │       └── schemas.py
│       ├── models/                   # Downloaded model files
│       ├── tests/
│       ├── requirements.txt
│       ├── Dockerfile
│       └── docker-compose.yml
│
├── packages/
│   ├── shared/                       # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── user.ts
│   │   │   │   ├── conversation.ts
│   │   │   │   ├── vocabulary.ts
│   │   │   │   ├── gamification.ts
│   │   │   │   └── api.ts
│   │   │   ├── constants/
│   │   │   │   ├── levels.ts
│   │   │   │   ├── achievements.ts
│   │   │   │   └── topics.ts
│   │   │   ├── validators/
│   │   │   │   ├── auth.ts
│   │   │   │   └── conversation.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── database/                     # Prisma schema package
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── src/
│       │   ├── client.ts
│       │   └── migrations/
│       ├── tsconfig.json
│       └── package.json
│
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   ├── Dockerfile.ai
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── voxspeak.conf
│   └── monitoring/
│       ├── prometheus.yml
│       └── grafana/
│           └── dashboards/
│
├── infrastructure/
│   ├── terraform/                    # Optional IaC
│   │   └── hetzner/
│   └── ansible/
│       └── playbook.yml
│
├── scripts/
│   ├── setup.sh
│   ├── seed.sh
│   ├── backup.sh
│   └── migrate.sh
│
├── docs/
│   ├── phases/                       # All 20 phases
│   ├── api/
│   ├── architecture/
│   ├── ADR/                          # Architecture Decision Records
│   └── contributing.md
│
├── .env.example
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── turbo.json                        # Turborepo config
├── package.json                      # Root workspace
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

## Monorepo Configuration (pnpm + Turborepo)

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": { "dependsOn": ["^build"] },
    "lint": { "dependsOn": ["^build"] },
    "dev": { "cache": false }
  }
}
```

This structure follows:
- **Monorepo**: Single repo, multiple packages
- **Modular**: Feature-based organization
- **Shared types**: Single source of truth for API contracts
- **Separate AI service**: Python for ML, Node.js for API
