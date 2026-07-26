'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'

export default function SplashScreen() {
  const router = useRouter()
  const [show, setShow] = useState(true)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShow(false)
    }, 3000)

    return () => clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (show) return

    if (isAuthenticated) {
      router.replace('/dashboard')
    } else {
      router.replace('/onboarding/welcome')
    }
  }, [show, isAuthenticated, router])

  if (!show) return null

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 animate-fade-up">
        <div className="w-28 h-28 rounded-4xl bg-gradient-primary flex items-center justify-center shadow-glow-lg animate-scale-in">
          <span className="material-symbols-rounded text-white text-6xl">record_voice_over</span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">
            <span className="text-gradient-accent">VoxSpeak</span>
          </h1>
          <p className="text-text-secondary text-sm font-medium">Your AI English speaking coach</p>
        </div>
      </div>

      <div className="absolute bottom-16 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
