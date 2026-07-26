import api from './api'
import { LoginRequest, RegisterRequest, OAuthRequest, AuthResponse, User } from '@/types/user'
import { ApiResponse } from '@/types/api'

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return response.data.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return response.data.data
  },

  async oauthLogin(data: OAuthRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/oauth', data)
    return response.data.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string; expiresIn: number }>>(
      '/auth/refresh',
      { refreshToken }
    )
    return response.data.data
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password })
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/me')
    return response.data.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data)
    return response.data.data
  },
}

export type AuthService = typeof authService
