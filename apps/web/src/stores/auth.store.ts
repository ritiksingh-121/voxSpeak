import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

interface AuthActions {
  setUser: (user: User | null) => void
  setToken: (accessToken: string, refreshToken: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  register: (user: User, accessToken: string, refreshToken: string) => void
  updateUser: (updates: Partial<User>) => void
  hydrate: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        set({ token: accessToken, refreshToken })
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        set({
          user,
          token: accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      },

      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      register: (user, accessToken, refreshToken) => {
        get().login(user, accessToken, refreshToken)
      },

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },

      hydrate: () => {
        try {
          const storedUser = localStorage.getItem('user')
          const storedToken = localStorage.getItem('accessToken')
          if (storedUser && storedToken) {
            set({
              user: JSON.parse(storedUser),
              token: storedToken,
              isAuthenticated: true,
            })
          }
        } catch {
          set({ user: null, token: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: 'voxspeak-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
