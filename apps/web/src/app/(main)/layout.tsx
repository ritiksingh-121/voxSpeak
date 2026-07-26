'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { BottomNav } from '@/components/shared/BottomNav'
import { useAuthStore } from '@/stores/auth.store'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/') {
      router.replace('/login')
    }
  }, [isAuthenticated, router, pathname])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
      <BottomNav />
    </div>
  )
}
