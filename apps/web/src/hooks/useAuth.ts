'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'
import { LoginRequest, RegisterRequest, OAuthRequest } from '@/types/user'
import { ApiClientError } from '@/services/api'

export function useAuth() {
  const router = useRouter()
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    setError,
    updateUser,
  } = useAuthStore()

  const login = useCallback(
    async (data: LoginRequest) => {
      setLoading(true)
      setError(null)
      try {
        const response = await authService.login(data)
        storeLogin(response.user, response.accessToken, response.refreshToken)
        router.replace('/dashboard')
      } catch (err) {
        const message = err instanceof ApiClientError ? err.message : 'Login failed. Please try again.'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router, storeLogin, setLoading, setError]
  )

  const register = useCallback(
    async (data: RegisterRequest) => {
      setLoading(true)
      setError(null)
      try {
        const response = await authService.register(data)
        storeLogin(response.user, response.accessToken, response.refreshToken)
        router.replace('/dashboard')
      } catch (err) {
        const message = err instanceof ApiClientError ? err.message : 'Registration failed. Please try again.'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router, storeLogin, setLoading, setError]
  )

  const oauthLogin = useCallback(
    async (data: OAuthRequest) => {
      setLoading(true)
      setError(null)
      try {
        const response = await authService.oauthLogin(data)
        storeLogin(response.user, response.accessToken, response.refreshToken)
        router.replace('/dashboard')
      } catch (err) {
        const message = err instanceof ApiClientError ? err.message : 'Social login failed. Please try again.'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router, storeLogin, setLoading, setError]
  )

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // proceed with local logout even if API call fails
    } finally {
      storeLogout()
      router.replace('/login')
    }
  }, [router, storeLogout])

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authService.getMe()
      updateUser(profile)
    } catch {
      // silently fail
    }
  }, [updateUser])

  const forgotPassword = useCallback(async (email: string) => {
    await authService.forgotPassword(email)
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken && !token) {
      useAuthStore.getState().hydrate()
    }
  }, [token])

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    oauthLogin,
    logout,
    forgotPassword,
    refreshProfile,
  }
}
