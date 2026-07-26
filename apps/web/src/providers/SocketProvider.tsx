'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'

interface SocketContextValue {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  emit: (event: string, data: unknown) => void
  on: (event: string, handler: (...args: unknown[]) => void) => () => void
  off: (event: string, handler: (...args: unknown[]) => void) => void
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  sendTyping: (conversationId: string, isTyping: boolean) => void
}

const SocketContext = createContext<SocketContextValue | null>(null)

export function useSocket(): SocketContextValue {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

interface SocketProviderProps {
  children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const socket = useWebSocket()

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
