'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Min 8 characters'
    if (!/[A-Z]/.test(pwd)) return 'Needs an uppercase letter'
    if (!/[a-z]/.test(pwd)) return 'Needs a lowercase letter'
    if (!/[0-9]/.test(pwd)) return 'Needs a number'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const pwdError = validatePassword(password)
    if (pwdError) { setError(pwdError); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Reset failed')
      }
      setDone(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col px-6">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
          <div className="text-center space-y-4 animate-fade-down">
            <div className="w-20 h-20 rounded-3xl bg-success/20 mx-auto flex items-center justify-center">
              <span className="material-symbols-rounded text-success text-4xl">check_circle</span>
            </div>
            <div className="space-y-1.5">
              <h1 className="heading-md">Password Reset</h1>
              <p className="body-text">Your password has been successfully reset</p>
            </div>
          </div>
          <Link href="/login" className="btn-primary w-full block text-center">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        <div className="text-center space-y-4 animate-fade-down">
          <div className="w-20 h-20 rounded-3xl bg-gradient-primary mx-auto flex items-center justify-center shadow-glow-lg">
            <span className="material-symbols-rounded text-white text-4xl">lock_open</span>
          </div>
          <div className="space-y-1.5">
            <h1 className="heading-md">Set New Password</h1>
            <p className="body-text">Enter your new password below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-sm px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-text-tertiary">
          <Link href="/login" className="text-primary font-semibold hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  )
}
