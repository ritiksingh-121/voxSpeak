# Phase 12 — Authentication

## Strategy: Better Auth + JWT + OAuth

### Why Better Auth?
- Open-source, free (MIT)
- Designed for Next.js + TypeScript
- Built-in JWT, session management, OAuth
- Database-agnostic (works with Prisma)
- Rate limiting built-in
- No paid tiers

### Auth Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │  API     │     │  DB      │
└────┬─────┘     └────┬─────┘     └────┬─────┘
     │                 │                 │
     │ POST /register  │                 │
     │ {email, pass}   │                 │
     │────────────────>│                 │
     │                 │ Hash password   │
     │                 │ (bcrypt)        │
     │                 │────────────────>│
     │                 │ Create user     │
     │                 │<────────────────│
     │                 │                 │
     │ {user, token,   │                 │
     │  refreshToken}  │                 │
     │<────────────────│                 │
     │                 │                 │
     │ Store token     │                 │
     │ in httpOnly     │                 │
     │ cookie + zustand│                 │
     │                 │                 │
```

## Token Structure

### Access Token (JWT)
```typescript
{
  sub: "user_id",
  email: "user@email.com",
  role: "user",
  iat: 1620000000,
  exp: 1620003600  // 1 hour
}
```

### Refresh Token
```typescript
{
  sub: "user_id",
  jti: "unique_token_id",
  iat: 1620000000,
  exp: 1620086400  // 7 days
}
```

## OAuth Flow (Google / GitHub)

```
1. User clicks "Continue with Google"
2. Redirect to /api/auth/oauth/google
3. Google shows consent screen
4. User approves → Google sends code
5. Backend exchanges code for tokens
6. Backend finds or creates user
7. Backend issues JWT + refresh token
8. Redirect to app with token in URL
9. Client stores token, redirects to dashboard
```

## Password Security
- **Hashing**: bcrypt (12 rounds)
- **Pepper**: Environment secret
- **Minimum length**: 8 characters
- **Requirements**: uppercase, lowercase, number
- **Rate limit**: 5 attempts per IP per minute

## Session Management
- **Storage**: Redis (TTL: 7 days)
- **Revocation**: Delete from Redis on logout
- **Rotation**: Refresh token rotates every use
- **Concurrent sessions**: 5 max per user

## Security Headers
```typescript
Headers: {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}
```

## Protected Routes
```typescript
// Backend guard
@UseGuards(AuthGuard)
@Get('/me')
async getProfile(@CurrentUser() user: User) { ... }

// Frontend middleware
export function requireAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, isLoading } = useAuth();
    if (isLoading) return <LoadingScreen />;
    if (!user) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}
```

## Email Verification
- Send verification email with token
- Token valid for 24 hours
- Optional: verify on first login

## Password Reset
1. User requests reset → email with link
2. Link contains reset token (valid 1 hour)
3. User enters new password
4. Token invalidated, all sessions cleared

## Auth Database Tables
See Phase 5 — `User`, `Account`, `Session` models.
