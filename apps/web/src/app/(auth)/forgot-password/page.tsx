'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Please enter your email')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to send reset link')
      }
      setSent(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex flex-col px-6">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
          <div className="text-center space-y-4 animate-fade-down">
            <div className="w-20 h-20 rounded-3xl bg-success/20 mx-auto flex items-center justify-center">
              <span className="material-symbols-rounded text-success text-4xl">mail</span>
            </div>
            <div className="space-y-1.5">
              <h1 className="heading-md">Check Your Email</h1>
              <p className="body-text">We&apos;ve sent a reset link to <strong className="text-text-primary">{email}</strong></p>
            </div>
          </div>
          <div className="space-y-4">
            <Link href="/login" className="btn-primary w-full block text-center">Back to Sign In</Link>
            <button
              onClick={() => setSent(false)}
              className="btn-ghost w-full text-center text-sm"
            >
              Didn&apos;t receive the email? Send again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        <div className="text-center space-y-4 animate-fade-down">
          <div className="w-20 h-20 rounded-3xl bg-gradient-primary mx-auto flex items-center justify-center shadow-glow-lg">
            <span className="material-symbols-rounded text-white text-4xl">lock_reset</span>
          </div>
          <div className="space-y-1.5">
            <h1 className="heading-md">Reset Password</h1>
            <p className="body-text">Enter your email and we&apos;ll send you a reset link</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-sm px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-text-tertiary">
          Remember your password?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
