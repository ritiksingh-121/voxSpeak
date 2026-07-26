export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  meta: PaginationMeta
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}
