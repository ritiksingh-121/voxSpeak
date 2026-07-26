'use client'

import { useQuery } from '@tanstack/react-query'
import { progressService } from '@/services/progress.service'
import { useAuthStore } from '@/stores/auth.store'

export function useProgressOverview() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['progress', 'overview'],
    queryFn: () => progressService.getProgressOverview(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export function usePronunciationProgress() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['progress', 'pronunciation'],
    queryFn: () => progressService.getPronunciationProgress(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })
}

export function useGrammarProgress() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['progress', 'grammar'],
    queryFn: () => progressService.getGrammarProgress(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })
}

export function useVocabularyProgress() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['progress', 'vocabulary'],
    queryFn: () => progressService.getVocabularyProgress(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })
}

export function useScoresHistory(days = 30) {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['progress', 'scores-history', days],
    queryFn: () => progressService.getScoresHistory(days),
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  })
}
