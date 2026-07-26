'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth.store'
import { Message, TypingStatus } from '@/types/conversation'

type EventHandler = (...args: unknown[]) => void

interface UseWebSocketReturn {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  emit: (event: string, data: unknown) => void
  on: (event: string, handler: EventHandler) => () => void
  off: (event: string, handler: EventHandler) => void
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  sendTyping: (conversationId: string, isTyping: boolean) => void
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const socketRef = useRef<Socket | null>(null)
  const handlersRef = useRef<Map<string, Set<EventHandler>>>(new Map())
  const token = useAuthStore((s) => s.token)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (!token || socketRef.current?.connected) return

    setIsConnecting(true)
    setError(null)

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    })

    socket.on('connect', () => {
      setIsConnected(true)
      setIsConnecting(false)
      setError(null)
      reconnectAttempts.current = 0
    })

    socket.on('disconnect', (reason) => {
      setIsConnected(false)
      if (reason === 'io server disconnect' || reason === 'transport close') {
        setError('Connection lost. Reconnecting...')
      }
    })

    socket.on('connect_error', (err) => {
      reconnectAttempts.current++
      setError(`Connection failed: ${err.message}`)
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        setIsConnecting(false)
        socket.close()
      }
    })

    socket.on('message', (message: Message) => {
      const handlers = handlersRef.current.get('message')
      handlers?.forEach((handler) => handler(message))
    })

    socket.on('typing', (status: TypingStatus) => {
      const handlers = handlersRef.current.get('typing')
      handlers?.forEach((handler) => handler(status))
    })

    socket.on('error', (err: { message: string }) => {
      setError(err.message)
    })

    socketRef.current = socket
  }, [token])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners()
      socketRef.current.close()
      socketRef.current = null
    }
    setIsConnected(false)
    setIsConnecting(false)
  }, [])

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data)
  }, [])

  const on = useCallback((event: string, handler: EventHandler): (() => void) => {
    if (!handlersRef.current.has(event)) {
      handlersRef.current.set(event, new Set())
    }
    handlersRef.current.get(event)!.add(handler)
    socketRef.current?.on(event, handler)

    return () => {
      off(event, handler)
    }
  }, [])

  const off = useCallback((event: string, handler: EventHandler) => {
    handlersRef.current.get(event)?.delete(handler)
    socketRef.current?.off(event, handler)
  }, [])

  const joinConversation = useCallback(
    (conversationId: string) => {
      emit('join:conversation', { conversationId })
    },
    [emit]
  )

  const leaveConversation = useCallback(
    (conversationId: string) => {
      emit('leave:conversation', { conversationId })
    },
    [emit]
  )

  const sendTyping = useCallback(
    (conversationId: string, typing: boolean) => {
      emit('typing', { conversationId, isTyping: typing })
    },
    [emit]
  )

  return {
    isConnected,
    isConnecting,
    error,
    emit,
    on,
    off,
    joinConversation,
    leaveConversation,
    sendTyping,
  }
}
