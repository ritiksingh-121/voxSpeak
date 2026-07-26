'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vocabularyService } from '@/services/vocabulary.service'
import { SaveWordRequest, UpdateWordRequest } from '@/types/vocabulary'
import { useAuthStore } from '@/stores/auth.store'

export function useVocabulary(params?: {
  page?: number
  limit?: number
  search?: string
  tags?: string[]
  difficulty?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['vocabulary', params],
    queryFn: () => vocabularyService.getVocabulary(params),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  })

  const saveWordMutation = useMutation({
    mutationFn: (data: SaveWordRequest) => vocabularyService.saveWord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] })
    },
  })

  const updateWordMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWordRequest }) =>
      vocabularyService.updateWord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] })
    },
  })

  const deleteWordMutation = useMutation({
    mutationFn: (id: string) => vocabularyService.deleteWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] })
    },
  })

  const toggleStarMutation = useMutation({
    mutationFn: (id: string) => vocabularyService.toggleStar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] })
    },
  })

  const reviewWordMutation = useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) =>
      vocabularyService.reviewWord(id, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] })
    },
  })

  return {
    words: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    saveWord: saveWordMutation.mutateAsync,
    updateWord: updateWordMutation.mutateAsync,
    deleteWord: deleteWordMutation.mutateAsync,
    toggleStar: toggleStarMutation.mutateAsync,
    reviewWord: reviewWordMutation.mutateAsync,
    isSaving: saveWordMutation.isPending,
    isUpdating: updateWordMutation.isPending,
    isDeleting: deleteWordMutation.isPending,
    refetch: query.refetch,
  }
}

export function useStarredWords() {
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ['vocabulary', 'starred'],
    queryFn: () => vocabularyService.getStarredWords(),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  })
}
