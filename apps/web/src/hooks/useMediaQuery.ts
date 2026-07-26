'use client'

import { useState, useEffect, useCallback } from 'react'

export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((mediaQuery: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(mediaQuery).matches
    }
    return false
  }, [])

  const [matches, setMatches] = useState<boolean>(() => getMatches(query))

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener('change', handleChange)
    setMatches(mediaQueryList.matches)

    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)')
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
