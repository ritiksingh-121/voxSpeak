import api from './api'
import { Conversation, Message, ConversationFeedback, StartConversationRequest } from '@/types/conversation'
import { ApiResponse, PaginatedResponse } from '@/types/api'

export const conversationService = {
  async getConversations(page = 1, limit = 20): Promise<PaginatedResponse<Conversation>> {
    const response = await api.get<PaginatedResponse<Conversation>>('/conversations', {
      params: { page, limit },
    })
    return response.data
  },

  async getConversation(id: string): Promise<Conversation & { messages: Message[] }> {
    const response = await api.get<ApiResponse<Conversation & { messages: Message[] }>>(`/conversations/${id}`)
    return response.data.data
  },

  async startConversation(data: StartConversationRequest): Promise<Conversation> {
    const response = await api.post<ApiResponse<Conversation>>('/conversations', data)
    return response.data.data
  },

  async sendMessage(
    conversationId: string,
    content: string,
    audioBlob?: Blob
  ): Promise<Message> {
    if (audioBlob) {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('content', content)
      const response = await api.post<ApiResponse<Message>>(
        `/conversations/${conversationId}/messages/voice`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return response.data.data
    }

    const response = await api.post<ApiResponse<Message>>(`/conversations/${conversationId}/messages`, {
      content,
    })
    return response.data.data
  },

  async deleteConversation(id: string): Promise<void> {
    await api.delete(`/conversations/${id}`)
  },

  async archiveConversation(id: string): Promise<void> {
    await api.patch(`/conversations/${id}/archive`)
  },

  async getConversationFeedback(id: string): Promise<ConversationFeedback> {
    const response = await api.get<ApiResponse<ConversationFeedback>>(`/conversations/${id}/feedback`)
    return response.data.data
  },

  async getMessages(conversationId: string, page = 1, limit = 50): Promise<PaginatedResponse<Message>> {
    const response = await api.get<PaginatedResponse<Message>>(
      `/conversations/${conversationId}/messages`,
      { params: { page, limit } }
    )
    return response.data
  },
}

export type ConversationService = typeof conversationService
