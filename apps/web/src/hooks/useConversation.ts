'use client'

import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useConversationStore } from '@/stores/conversation.store'
import { conversationService } from '@/services/conversation.service'
import { Message } from '@/types/conversation'
import { useAuthStore } from '@/stores/auth.store'
import { v4 as uuidv4 } from 'uuid'

export function useConversation(conversationId?: string) {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const {
    messages,
    isRecording,
    isAIThinking,
    inputMode,
    feedback,
    liveScore,
    error,
    audioLevel,
    setCurrentConversation,
    addMessage,
    updateMessage,
    setIsRecording,
    setIsAIThinking,
    setInputMode,
    setFeedback,
    setLiveScore,
    setError,
    setAudioLevel,
    clearMessages,
  } = useConversationStore()

  const conversationsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationService.getConversations(),
    enabled: !!user,
  })

  const conversationQuery = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => conversationService.getConversation(conversationId!),
    enabled: !!conversationId && !!user,
  })

  const startConversationMutation = useMutation({
    mutationFn: (data: { topic?: string; scenario?: string; difficulty?: 'beginner' | 'intermediate' | 'advanced' }) =>
      conversationService.startConversation(data),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setCurrentConversation(conversation.id)
    },
  })

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      content,
      audioBlob,
    }: {
      content: string
      audioBlob?: Blob
    }) => {
      if (!conversationId) {
        const conv = await conversationService.startConversation({})
        setCurrentConversation(conv.id)
        return conversationService.sendMessage(conv.id, content, audioBlob)
      }
      return conversationService.sendMessage(conversationId, content, audioBlob)
    },
    onMutate: async ({ content }) => {
      const tempMessage: Message = {
        id: uuidv4(),
        conversationId: conversationId || 'temp',
        sender: 'user',
        content,
        timestamp: new Date().toISOString(),
        isLoading: true,
      }
      addMessage(tempMessage)
      setIsAIThinking(true)
      setError(null)
    },
    onSuccess: (aiMessage) => {
      updateMessage(messages[messages.length - 1]?.id || '', { isLoading: false })
      addMessage(aiMessage)
      if (aiMessage.feedback) {
        setFeedback({
          id: conversationId || uuidv4(),
          conversationId: conversationId || '',
          overallScore: aiMessage.feedback.overallScore || 0,
          pronunciationScore: aiMessage.feedback.pronunciationScore || 0,
          grammarScore: aiMessage.feedback.grammarScore || 0,
          vocabularyScore: aiMessage.feedback.vocabularyScore || 0,
          fluencyScore: aiMessage.feedback.fluencyScore || 0,
          strengths: aiMessage.feedback.strengths || [],
          weakAreas: [],
          suggestedTopics: [],
          tips: [],
        })
      }
      if (aiMessage.corrections && aiMessage.corrections.length > 0) {
        setLiveScore({
          overall:
            aiMessage.feedback?.overallScore || 0,
          pronunciation: aiMessage.feedback?.pronunciationScore || 0,
          grammar: aiMessage.feedback?.grammarScore || 0,
          vocabulary: aiMessage.feedback?.vocabularyScore || 0,
          fluency: aiMessage.feedback?.fluencyScore || 0,
        })
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: (err: Error) => {
      updateMessage(messages[messages.length - 1]?.id || '', { isLoading: false })
      setError(err.message || 'Failed to send message')
    },
    onSettled: () => {
      setIsAIThinking(false)
    },
  })

  const deleteConversationMutation = useMutation({
    mutationFn: (id: string) => conversationService.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      if (conversationId && useConversationStore.getState().currentConversationId === conversationId) {
        setCurrentConversation(null)
        clearMessages()
      }
    },
  })

  const sendMessage = useCallback(
    (content: string, audioBlob?: Blob) => {
      if (!content.trim() && !audioBlob) return
      sendMessageMutation.mutate({ content, audioBlob })
    },
    [sendMessageMutation]
  )

  const startNewConversation = useCallback(
    (data?: { topic?: string; scenario?: string; difficulty?: 'beginner' | 'intermediate' | 'advanced' }) => {
      clearMessages()
      startConversationMutation.mutate(data || {})
    },
    [clearMessages, startConversationMutation]
  )

  const deleteConversation = useCallback(
    (id: string) => {
      deleteConversationMutation.mutate(id)
    },
    [deleteConversationMutation]
  )

  const switchConversation = useCallback(
    (id: string) => {
      setCurrentConversation(id)
    },
    [setCurrentConversation]
  )

  return {
    conversations: conversationsQuery.data?.data || [],
    conversationsMeta: conversationsQuery.data?.meta,
    currentMessages: conversationId ? (conversationQuery.data?.messages ?? messages) : messages,
    currentConversation: conversationQuery.data,
    isLoadingConversations: conversationsQuery.isLoading,
    isLoadingConversation: conversationQuery.isLoading,
    isSendingMessage: sendMessageMutation.isPending,
    isStartingConversation: startConversationMutation.isPending,
    isRecording,
    isAIThinking,
    inputMode,
    feedback,
    liveScore,
    error,
    audioLevel,
    sendMessage,
    startNewConversation,
    deleteConversation,
    switchConversation,
    setIsRecording,
    setInputMode,
    setFeedback,
    setLiveScore,
    setError,
    setAudioLevel,
    clearMessages,
  }
}
