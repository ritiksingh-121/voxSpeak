'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EmailVerification() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/resend-verification', { method: 'POST' })
      setResent(true)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        <div className="text-center space-y-4 animate-fade-down">
          <div className="w-20 h-20 rounded-3xl bg-gradient-primary mx-auto flex items-center justify-center shadow-glow-lg">
            <span className="material-symbols-rounded text-white text-4xl">mark_email_unread</span>
          </div>
          <div className="space-y-1.5">
            <h1 className="heading-md">Verify Your Email</h1>
            <p className="body-text">We&apos;ve sent a verification link to your email. Please check your inbox.</p>
          </div>
        </div>

        <div className="space-y-4 animate-fade-up">
          <button
            onClick={handleResend}
            disabled={loading || resent}
            className="btn-primary w-full"
          >
            {resent ? 'Email Sent!' : loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>

        <p className="text-center text-sm text-text-tertiary">
          <Link href="/login" className="text-primary font-semibold hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  )
}
