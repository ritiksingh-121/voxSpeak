'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OtpVerification() {
  const router = useRouter()
  const [code, setCode] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(60)
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleChange = (idx: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 4)
      const newCode = [...code]
      digits.split('').forEach((d, i) => { if (i < 4) newCode[i] = d })
      setCode(newCode)
      const nextIdx = Math.min(digits.length, 3)
      inputRefs[nextIdx]?.current?.focus()
      return
    }
    if (!/^\d*$/.test(value)) return
    const newCode = [...code]
    newCode[idx] = value
    setCode(newCode)
    if (value && idx < 3) {
      inputRefs[idx + 1]?.current?.focus()
    }
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputRefs[idx - 1]?.current?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const otp = code.join('')
    if (otp.length !== 4) {
      setError('Please enter the full 4-digit code')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Invalid code')
      }
      router.replace('/reset-password')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        <div className="text-center space-y-4 animate-fade-down">
          <div className="w-20 h-20 rounded-3xl bg-gradient-primary mx-auto flex items-center justify-center shadow-glow-lg">
            <span className="material-symbols-rounded text-white text-4xl">lock</span>
          </div>
          <div className="space-y-1.5">
            <h1 className="heading-md">Verify Code</h1>
            <p className="body-text">Enter the 4-digit code sent to your email</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-sm px-4 py-3 rounded-2xl text-center">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-14 h-16 text-center text-2xl font-bold bg-surface-2 border border-divider rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-text-primary"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-xs text-text-tertiary">Resend code in {timer}s</p>
            ) : (
              <button type="button" onClick={() => setTimer(60)} className="text-sm text-primary font-semibold">
                Resend Code
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-text-tertiary">
          <Link href="/login" className="text-primary font-semibold hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  )
}
