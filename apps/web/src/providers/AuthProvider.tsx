'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'

interface AuthContextValue {
  isReady: boolean
  isAuthenticated: boolean
  isAuthLoading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  isReady: false,
  isAuthenticated: false,
  isAuthLoading: true,
})

export function useAuthContext() {
  return useContext(AuthContext)
}

const publicRoutes = ['/login', '/signup', '/forgot-password', '/otp-verification', '/reset-password', '/email-verification']
const onboardingRoutes = ['/onboarding/welcome', '/onboarding/level-test']

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)

  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const logout = useAuthStore((s) => s.logout)

  const isAuthenticated = !!user && !!token
  const isSplashRoute = pathname === '/'
  const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route))
  const isOnboardingRoute = onboardingRoutes.some((route) => pathname?.startsWith(route))

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken, storedRefreshToken || '')
      } catch {
        logout()
      }
    }

    if (storedToken && !user) {
      try {
        const freshUser = await authService.getMe()
        setUser(freshUser)
      } catch {
        logout()
      }
    }

    setIsReady(true)
  }, [user, setUser, setToken, logout])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isReady || isSplashRoute || isOnboardingRoute) return

    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login')
    } else if (isAuthenticated && isPublicRoute) {
      router.replace('/dashboard')
    }
  }, [isReady, isAuthenticated, isPublicRoute, isSplashRoute, isOnboardingRoute, router, pathname])

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isAuthenticated,
        isAuthLoading: !isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
