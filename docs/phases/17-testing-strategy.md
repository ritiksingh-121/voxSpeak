# Phase 17 — Testing Strategy

## Testing Philosophy
- **Practical over theoretical** — test critical paths, not every line
- **Solo dev** — prioritize integration + E2E over unit tests
- **Automation** — CI runs tests on every PR/push
- **Quality gate** — tests must pass before deploy

## Test Pyramid (Solo Dev Version)

```
     ╱╲
    ╱ E2E ╲         3–5 critical user flows
   ╱────────╲
  ╱Integration╲     20–30 API + service tests
 ╱──────────────╲
╱   Unit Tests    ╲  50–100 utility + helper tests
╱──────────────────╲
```

## Tools
| Layer | Tool | Purpose |
|---|---|---|
| Unit tests | Vitest | Fast, TypeScript-native, Jest-compatible |
| Integration | Vitest + Supertest | API endpoint testing |
| E2E | Playwright | Full browser testing |
| Coverage | c8 / Istanbul | Coverage reporting |
| Mocking | MSW (Mock Service Worker) | API mocking in tests |

## Frontend Tests

### Unit Tests (Vitest)
```typescript
// Components to test
- Button variants
- Input validation
- Card rendering
- Animation components
- Utility functions (cn, formatDate, etc.)
- Zustand store actions
- Zod validators

// What NOT to test
- Shadcn UI components (tested by shadcn)
- Static pages (covered by Playwright)
- Third-party integrations
```

### Integration Tests
```typescript
// Test real API interactions
- Login flow (register → login → dashboard)
- Conversation flow (start → send message → receive)
- Profile update flow
- Vocabulary save flow
```

### E2E Tests (Playwright)
```typescript
// Critical user journeys
test('user can complete onboarding and start conversation', async () => {
  // 1. Register
  // 2. Complete onboarding (welcome → level test → interests)
  // 3. See dashboard
  // 4. Start conversation
  // 5. Send voice message
  // 6. Receive AI response
  // 7. See feedback
});

test('user can view progress and vocabulary', async () => { ... });
test('user can maintain streak', async () => { ... });
test('user can navigate all tabs', async () => { ... });
```

## Backend Tests

### Unit Tests
```typescript
// Services (pure logic)
- AuthService.hashPassword()
- GamificationService.calculateXp()
- AnalyticsService.computeScore()
- VocabularyService.extractWords()
- GrammarService.parseCorrection()

// Guards
- AuthGuard (valid token → pass, invalid → reject)
- ThrottleGuard (under limit → pass, over → reject)
```

### Integration Tests
```typescript
// API Endpoints
describe('POST /api/auth/register', () => {
  it('should create user and return token');
  it('should reject duplicate email');
  it('should reject weak password');
});

describe('POST /api/conversations', () => {
  it('should create conversation');
  it('should reject without auth');
  it('should enforce rate limits');
});

describe('WebSocket Conversation', () => {
  it('should stream AI response');
  it('should handle voice messages');
  it('should persist messages to DB');
});
```

### AI Service Tests
```typescript
// LLM
describe('Prompt Templates', () => {
  it('should inject user context correctly');
  it('should handle empty weak areas');
  it('should adapt level-based vocabulary');
});

// STT
describe('Whisper Integration', () => {
  it('should transcribe English audio');
  it('should handle empty audio gracefully');
  it('should return confidence scores');
});

// TTS
describe('Piper Integration', () => {
  it('should generate audio from text');
  it('should handle long text via streaming');
});
```

## Continuous Testing

### Pre-commit Hook
```bash
# .husky/pre-commit
pnpm lint-staged
# Runs: ESLint + Prettier on staged files
```

### CI Pipeline
```yaml
# In CI workflow
- run: pnpm test          # Unit + integration
- run: pnpm test:e2e      # Playwright (parallel)
- run: pnpm coverage      # Coverage report
```

## Test Data
- **Seeding**: Prisma seed with realistic fake data
- **Factory pattern**: Test factories for User, Conversation, etc.
- **Cleanup**: Database reset between test runs

## Performance Testing
- Lighthouse CI for frontend
- k6 or autocannon for API benchmarks
- Monitor: P95 response time, error rate, throughput

## Target Coverage
| Layer | Target | Critical Paths |
|---|---|---|
| Frontend components | 60% | 95% |
| Backend services | 80% | 100% |
| API endpoints | 70% | 100% |
| E2E flows | 5 flows | N/A |
