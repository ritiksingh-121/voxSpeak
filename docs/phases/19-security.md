# Phase 19 — Security

## Security Principles
- **Defense in depth**: Multiple security layers
- **Least privilege**: Minimum access per service
- **Zero trust**: Never trust, always verify
- **Privacy by design**: User data belongs to user

## Authentication Security

### JWT Security
```typescript
// Strong secret (256-bit random)
const JWT_SECRET = crypto.randomBytes(32).toString('hex');

// Token configuration
{
  algorithm: 'RS256',           // Asymmetric signing
  expiresIn: '1h',              // Short-lived access tokens
  issuer: 'voxspeak',
  audience: 'voxspeak-app',
}
```

### Password Policy
```typescript
{
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false,     // Optional to avoid frustration
  bcryptRounds: 12,              // ~250ms hash time
  maxAge: 90,                    // Days before forced change
  historySize: 5,               // Prevent reuse
}
```

### Rate Limiting
```typescript
// Per endpoint groups
{
  '/api/auth/*': { window: 60000, max: 10 },     // 10 per minute
  '/api/conversations': { window: 60000, max: 30 },
  '/api/voice/*': { window: 60000, max: 10 },
  '/api/*': { window: 60000, max: 100 },
}

// Per user
{
  aiRequests: { window: 60000, max: 20 },         // 20 AI calls/min
  totalRequests: { window: 3600000, max: 1000 },  // 1000/hour
}
```

## Data Security

### Encryption at Rest
- **Database**: Transparent Data Encryption (PostgreSQL TDE)
- **Audio files**: Encrypted at rest in MinIO (AES-256)
- **Backups**: Encrypted with GPG

### Encryption in Transit
- **HTTPS**: TLS 1.3 everywhere
- **WebSocket**: WSS (Secure WebSocket)
- **Internal services**: mTLS between services (optional for early stages)

## API Security

### Input Validation
```typescript
// Every endpoint validates with Zod
const createConversationSchema = z.object({
  mode: z.enum(['free', 'lesson', 'roleplay', 'interview']),
  topic: z.string().min(1).max(100).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

// SQL injection prevention
// Prisma parameterizes all queries automatically
```

### Output Sanitization
```typescript
// Sanitize AI responses
function sanitizeAIResponse(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .trim();
}

// LLM prompt injection protection
// - Isolate system prompts from user input
// - Input length limits (2000 chars)
// - Content filtering
```

## Privacy

### Data Collection
```typescript
{
  // Collected
  email, name, avatar (with consent)
  conversation text (for AI improvement, opt-out)
  pronunciation data (anonymized)
  usage analytics (PostHog, self-hosted)

  // NOT collected
  exact location
  contacts
  browsing history
  payment data (handled by Stripe if premium)
}
```

### User Rights (GDPR-ready)
```typescript
- Right to access: GET /api/users/me/data
- Right to deletion: DELETE /api/users/me
- Right to portability: Export all data as JSON
- Right to opt-out: Disable AI memory
```

### Data Retention
```typescript
{
  conversationHistory: 90 days (active), 365 days (inactive)
  voiceRecordings: 30 days
  analytics: 24 months
  deleted accounts: 30 days grace period
}
```

## Infrastructure Security

### Docker Security
```dockerfile
# Dockerfile best practices
FROM node:20-alpine AS base
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --chown=appuser:appgroup . .
```

### Network Security
```yaml
# docker-compose security
services:
  api:
    networks:
      - internal
    expose:
      - "3001"  # Internal only, exposed via reverse proxy

  postgres:
    networks:
      - internal
    ports:
      - "127.0.0.1:5432:5432"  # Localhost only
```

### Reverse Proxy (Nginx)
```nginx
# Security headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" always;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;

# Request size limits
client_max_body_size 10M;
```

## Monitoring & Incident Response

### Security Monitoring
- **Failed auth attempts**: Alert after 5 in 10 minutes
- **Suspicious IPs**: Geo-block non-target regions
- **Unusual data access**: Large data export detection
- **Error rate spikes**: Sentry error tracking

### Incident Response Plan
```
1. Detect → Automated alert (Telegram/Email)
2. Respond → Isolate affected service
3. Analyze → Check logs + metrics
4. Mitigate → Apply fix
5. Recover → Restore from backup
6. Review → Post-mortem + improvements
```

## Dependency Security
```json
{
  "scripts": {
    "audit": "pnpm audit --audit-level=high",
    "outdated": "pnpm outdated",
    "snyk": "snyk test"
  }
}
```

## Security Automation
- Dependabot for dependency updates
- Trivy for container scanning
- ESLint security plugin
- Husky + lint-staged pre-commit hooks
