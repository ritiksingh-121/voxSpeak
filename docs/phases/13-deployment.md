# Phase 13 — Deployment

## Deployment Strategy

### Stage 1: Development (1 user — solo dev)
- **Local**: Docker Compose on dev machine
- **Database**: SQLite (Prisma)
- **AI**: Ollama local (CPU mode, small models)
- **No cost**: \$0/month

### Stage 2: Production Launch (1–100 users)
- **VPS**: Hetzner CX22 (\$4.49/month) or Oracle Cloud Free Tier (forever free)
- **Deployment**: Docker Compose
- **Database**: PostgreSQL in Docker
- **AI**: Ollama with Mistral 7B (CPU, 16GB RAM sufficient)
- **Cost**: ~\$5/month

### Stage 3: Growth (100–10K users)
- **VPS**: Hetzner CX32 (\$8.99/month) or AX102 (\$40/month)
- **Separate services**: API, Worker, DB on different machines
- **Queue**: BullMQ with Redis
- **Storage**: MinIO
- **Cost**: ~\$20–\$50/month

### Stage 4: Scale (10K–100K+)
- **Kubernetes**: k3s on Hetzner or Dokku
- **CDN**: Cloudflare Free
- **GPU**: Hetzner GPU instances for Whisper + LLM
- **Read replicas**: PostgreSQL replication
- **Cost**: ~\$100–\$500/month

## Docker Compose (Development)

```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: voxspeak
      POSTGRES_USER: voxspeak
      POSTGRES_PASSWORD: voxspeak_dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: voxspeak
      MINIO_ROOT_PASSWORD: voxspeak_dev
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]  # Optional GPU support

  api:
    build:
      context: ../apps/api
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://voxspeak:voxspeak_dev@postgres:5432/voxspeak
      REDIS_URL: redis://redis:6379
      QDRANT_URL: http://qdrant:6333
      MINIO_URL: http://minio:9000
      OLLAMA_URL: http://ollama:11434
      JWT_SECRET: dev_secret_change_in_prod
    depends_on:
      - postgres
      - redis
      - qdrant
      - minio
      - ollama

  web:
    build:
      context: ../apps/web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
      NEXT_PUBLIC_WS_URL: ws://localhost:3001/ws
    depends_on:
      - api

volumes:
  pgdata:
  qdrant_data:
  minio_data:
  ollama_data:
```

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: voxspeak_test
          POSTGRES_USER: voxspeak
          POSTGRES_PASSWORD: voxspeak_test
        ports: ['5432:5432']
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma migrate deploy
      - run: npm run test
      - run: npm run lint
      - run: npm run build

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Coolify
        run: |
          curl -X POST ${{ secrets.COOLIFY_DEPLOY_HOOK }}
```

## Deployment Options Comparison

| Provider | Free Tier | Cost After Free | Best For |
|---|---|---|---|
| Coolify | Self-host | Free | All-in-one deployment |
| Railway | \$5 credit | \$5/month | Quick launch |
| Render | 750h/month | \$7/month | Web services |
| Fly.io | 3 shared VMs | \$2/month | Global edge |
| Hetzner | None | \$4.49/month | Best value VPS |
| Oracle Cloud | 4 ARM cores + 24GB RAM | \$0/month | **Best free option** |
| Cloudflare | Unlimited | Free | CDN, DNS, DDoS |

**Recommended**: Oracle Cloud Free Tier (4 OCPU, 24GB RAM, 200GB storage) — enough to run everything including Ollama.

## Environment Variables
```bash
# .env.example
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/voxspeak

# Redis
REDIS_URL=redis://localhost:6379

# Qdrant
QDRANT_URL=http://localhost:6333

# MinIO
MINIO_URL=http://localhost:9000
MINIO_ACCESS_KEY=voxspeak
MINIO_SECRET_KEY=voxspeak_secret

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Auth
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Monitoring
SENTRY_DSN=
```
