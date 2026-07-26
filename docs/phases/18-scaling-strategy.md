# Phase 18 — Scaling Strategy

## Scaling Philosophy
**Monolith first, microservices later.**
Avoid premature distribution. A well-optimized monolith handles 10K+ users.

## Stage 1: Solo Dev (1 user)
```
Architecture:
- Everything on one machine
- Docker Compose
- SQLite (dev) / PostgreSQL (prod)
- Ollama CPU mode (small models)

Capacity:
- 1–10 concurrent users
- 100ms–500ms AI response time
- \$0–\$5/month cost
```

## Stage 2: Early Users (10–1,000 users)
```
Architecture:
- Single VPS (4 vCPU, 16GB RAM)
- PostgreSQL + Redis + Qdrant + MinIO on same machine
- Ollama GPU passthrough if available
- BullMQ for background jobs

Bottlenecks:
- LLM inference (GPU recommended)
- STT processing (Whisper medium+)
- Database connection pool

Solutions:
- Upgrade to GPU instance (Hetzner GEX44, ~€45/month)
- Use smaller Whisper model (base.en)
- Connection pooling with pgBouncer
- Redis caching for frequent queries

Capacity:
- 50–200 concurrent users
- 200ms–1s AI response time
- ~\$50/month cost
```

## Stage 3: Growth (1,000–10,000 users)
```
Architecture:
- Separate machines: API, Worker, DB, AI
- Load balancer (HAProxy or Nginx)
- Read replicas for PostgreSQL
- Redis cluster
- Qdrant cluster

Bottlenecks:
- STT queue backlog
- TTS generation
- WebSocket connections
- Vector search latency

Solutions:
- Scale STT workers horizontally (3–5 instances)
- Cache TTS audio for common phrases
- WebSocket horizontal scaling with Redis adapter
- Qdrant sharding

Capacity:
- 500–1,000 concurrent users
- \$200–\$500/month cost
```

## Stage 4: Scale (10,000–1,000,000 users)
```
Architecture:
- Kubernetes cluster (k3s / K8s)
- Microservices: auth, conversation, ai, voice, progress
- Dedicated GPU workers for Whisper + LLM
- CDN (Cloudflare) for static + audio
- Global regions (US, EU, Asia)

Key Technologies:
- k3s for lightweight K8s
- Istio or Linkerd for service mesh
- Prometheus + Grafana for monitoring
- Horizontal Pod Autoscaling (HPA)
- PostgreSQL with pg_partman for partitioning
- Redis Sentinel for HA

LLM Strategy:
- Multiple Ollama instances
- Load balance by model size
- Cache common responses
- Batch inference where possible

Cost:
- \$2,000–\$10,000/month
- GPU instances for AI inference
```

## Stage 5: Massive Scale (1M–10M+ users)
```
Architecture:
- Global edge deployment
- Custom inference infrastructure
- Sharded databases
- Event-driven architecture
- Multi-region active-active

Upgrades:
- Custom fine-tuned models (replace Ollama)
- In-house STT/TTS models
- Dedicated GPU clusters
- Custom vector database or Pinecone
- Enterprise CDN

Cost:
- \$50,000+/month
- Enterprise infrastructure
- Dedicated SRE team
```

## Scaling Checklist

### Database
- [ ] Connection pooling (pgBouncer)
- [ ] Read replicas for analytics queries
- [ ] Index optimization
- [ ] Query profiling
- [ ] Partitioning for large tables (conversations, messages)
- [ ] Vacuum + analyze scheduling

### Caching
- [ ] Redis for session + hot data
- [ ] CDN for static assets + audio
- [ ] Response caching for repeated queries
- [ ] Conversation context caching

### AI Optimization
- [ ] Quantized models (4-bit, 8-bit)
- [ ] Response streaming (TTFB < 100ms)
- [ ] Batch inference for TTS + STT
- [ ] Model caching (keep warm)
- [ ] Request coalescing for identical prompts

### Queue
- [ ] Monitor queue depth
- [ ] Auto-scale workers based on queue length
- [ ] Dead letter queues for failures
- [ ] Job prioritization (voice > text)

### Monitoring
- [ ] Prometheus metrics (request rate, latency, errors)
- [ ] Grafana dashboards
- [ ] Alerting (PagerDuty alternative: Telegram bot)
- [ ] Distributed tracing (OpenTelemetry)
- [ ] Log aggregation (Loki or ELK)

### Cost Optimization
- [ ] Spot/preemptible instances for workers
- [ ] Auto-scaling down during low usage
- [ ] Compress audio files
- [ ] Delete unused data regularly
- [ ] Use Cloudflare for bandwidth savings
