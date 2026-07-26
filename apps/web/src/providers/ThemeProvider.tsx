'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useAppStore, AppTheme } from '@/stores/app.store'

interface ThemeContextValue {
  theme: AppTheme
  mode: 'dark' | 'light' | 'system'
  setTheme: (theme: AppTheme) => void
  setMode: (mode: 'dark' | 'light' | 'system') => void
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  mode: 'dark',
  setTheme: () => {},
  setMode: () => {},
  toggleTheme: () => {},
  isDark: true,
})

export function useThemeContext() {
  return useContext(ThemeContext)
}

interface ThemeProviderProps {
  children: ReactNode
}

const MODE_KEY = 'voxspeak-theme-mode'
const THEME_KEY = 'voxspeak-theme'

function getSystemTheme(): AppTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  const [mode, setModeState] = useState<'dark' | 'light' | 'system'>('system')

  const applyTheme = useCallback(
    (newTheme: AppTheme) => {
      const root = document.documentElement
      root.classList.remove('dark', 'light')
      root.classList.add(newTheme)
      root.style.colorScheme = newTheme

      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) {
        meta.setAttribute('content', newTheme === 'dark' ? '#0f0f0f' : '#ffffff')
      }

      localStorage.setItem(THEME_KEY, newTheme)
    },
    []
  )

  const setMode = useCallback((newMode: 'dark' | 'light' | 'system') => {
    setModeState(newMode)
    localStorage.setItem(MODE_KEY, newMode)
    if (newMode === 'system') {
      localStorage.removeItem(THEME_KEY)
      const systemTheme = getSystemTheme()
      setTheme(systemTheme)
      applyTheme(systemTheme)
    } else {
      setTheme(newMode)
      applyTheme(newMode)
    }
  }, [setTheme, applyTheme])

  useEffect(() => {
    const storedMode = localStorage.getItem(MODE_KEY) as 'dark' | 'light' | 'system' | null
    const initialMode = storedMode || 'system'
    setModeState(initialMode)

    if (initialMode === 'system') {
      const stored = localStorage.getItem(THEME_KEY) as AppTheme | null
      if (!stored) {
        const systemTheme = getSystemTheme()
        setTheme(systemTheme)
        applyTheme(systemTheme)
      }
    } else {
      setTheme(initialMode)
      applyTheme(initialMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (mode === 'system') return
    applyTheme(theme)
  }, [theme, mode, applyTheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const storedMode = localStorage.getItem(MODE_KEY)
      if (storedMode === 'system' || !storedMode) {
        const systemTheme = e.matches ? 'dark' : 'light'
        setTheme(systemTheme)
        applyTheme(systemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setTheme, applyTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        setTheme,
        setMode,
        toggleTheme,
        isDark: theme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
