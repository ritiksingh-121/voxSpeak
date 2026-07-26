'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TopBar } from '@/components/shared/TopBar'
import { useConversation } from '@/hooks/useConversation'
import { useAuthStore } from '@/stores/auth.store'
import { generateResponse } from '@/lib/ai-fallback'
import { groqChat, nextRequestId } from '@/lib/groq'
import { voiceService } from '@/services/voice.service'
import { v4 as uuidv4 } from 'uuid'
import type { Message, Correction } from '@/types/conversation'

const LOG_PREFIX = {
  mic: '\uD83C\uDFA4',
  transcript: '\uD83D\uDCDD',
  request: '\uD83D\uDCE4',
  response: '\uD83D\uDCE5',
  error: '\u274C',
  abort: '\uD83D\uDED1',
}

export default function Conversation() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-text-secondary">Loading...</p></div>}>
      <ConversationContent />
    </Suspense>
  )
}

function ConversationContent() {
  const searchParams = useSearchParams()
  const topicParam = searchParams.get('topic')
  const scenarioParam = searchParams.get('scenario')
  const userName = useAuthStore((s) => s.user?.name ?? 'there')

  const {
    currentMessages: storeMessages,
    isAIThinking: storeIsAIThinking,
    inputMode: storeInputMode,
    error: storeError,
    sendMessage: serverSendMessage,
    setIsRecording: setStoreIsRecording,
    setInputMode: setStoreInputMode,
    setError: setStoreError,
  } = useConversation()

  const [textInput, setTextInput] = useState('')
  const [recordingLevel, setRecordingLevel] = useState(0)
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [localIsAIThinking, setLocalIsAIThinking] = useState(false)
  const [aiMode, setAiMode] = useState<'local' | 'groq' | 'server'>('groq')
  const [localError, setLocalError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = aiMode !== 'server' ? localMessages : storeMessages
  const isAIThinking = aiMode !== 'server' ? localIsAIThinking : storeIsAIThinking
  const displayError = storeError || localError

  const messagesRef = useRef<Message[]>(localMessages)
  const isAiThinkingRef = useRef(false)
  const hasStartedRef = useRef(false)
  const currentRequestIdRef = useRef<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const isRecordingRef = useRef(false)
  const lastPointerDownRef = useRef(0)
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const waveformIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    isAiThinkingRef.current = isAIThinking
  }, [isAIThinking])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAIThinking])

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    const greeting = `Hi ${userName}! I'm your AI English coach. Feel free to ask me anything, practice conversation, or just chat! What's on your mind?`

    const greetingMessage: Message = {
      id: uuidv4(),
      conversationId: 'local',
      sender: 'ai',
      content: greeting,
      timestamp: new Date().toISOString(),
    }
    setLocalMessages([greetingMessage])
    messagesRef.current = [greetingMessage]
    setAiMode('groq')
  }, [topicParam, scenarioParam, userName])

  function abortCurrentRequest() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    currentRequestIdRef.current = null
  }

  function addUserMessage(content: string): Message {
    const userMessage: Message = {
      id: uuidv4(),
      conversationId: 'local',
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    messagesRef.current = [...messagesRef.current, userMessage]
    setLocalMessages(messagesRef.current)
    return userMessage
  }

  function addAiMessage(aiMessage: Message) {
    messagesRef.current = [...messagesRef.current, aiMessage]
    setLocalMessages(messagesRef.current)
  }

  function buildHistory(): { sender: string; content: string }[] {
    return messagesRef.current.map((m) => ({
      sender: m.sender === 'ai' ? 'assistant' : 'user',
      content: m.content,
    }))
  }

  async function sendToGroq(userContent: string) {
    if (isAiThinkingRef.current) {
      abortCurrentRequest()
    }

    const requestId = nextRequestId()
    currentRequestIdRef.current = requestId
    const controller = new AbortController()
    abortControllerRef.current = controller

    isAiThinkingRef.current = true
    setLocalIsAIThinking(true)

    const history = buildHistory()
    console.log(`${LOG_PREFIX.request} [${requestId}] \u2705 Latest User Message: "${userContent}"`)
    console.log(`${LOG_PREFIX.request} [${requestId}] \u2705 Conversation History:`, history.map(h => `${h.sender}: "${h.content.slice(0, 60)}"`))
    console.log(`${LOG_PREFIX.request} [${requestId}] \u2705 Provider: Groq (llama-3.3-70b-versatile)`)
    console.log(`${LOG_PREFIX.request} [${requestId}] \u2705 LLM Payload:`, {
      historyLength: history.length,
      messages: history.map(h => ({ role: h.sender === 'ai' ? 'assistant' : 'user', content: h.content.slice(0, 60) })),
    })
    console.log(`${LOG_PREFIX.request} [${requestId}] \u2705 Request Started`)

    try {
      const result = await groqChat(history, userContent, controller.signal)

      if (currentRequestIdRef.current !== requestId) {
        console.log(`${LOG_PREFIX.abort} [${requestId}] Response ignored — superseded by newer request`)
        return
      }

      console.log(`${LOG_PREFIX.response} [${requestId}] \u2705 Request Completed`)
      console.log(`${LOG_PREFIX.response} [${requestId}] \u2705 AI Response: "${result.content}"`)
      console.log(`${LOG_PREFIX.response} [${requestId}] \u2705 Display Response: "${result.content.slice(0, 80)}..."`)

      const corrections: Correction[] | undefined = result.corrections.length > 0
        ? result.corrections.map((c) => ({
            id: uuidv4(),
            originalText: c.originalText,
            correctedText: c.correctedText,
            type: 'grammar' as const,
            explanation: c.explanation,
            startIndex: 0,
            endIndex: 0,
            severity: 'low' as const,
          }))
        : undefined

      const aiMessage: Message = {
        id: uuidv4(),
        conversationId: 'local',
        sender: 'ai',
        content: result.content,
        corrections,
        feedback: {
          overallScore: result.score,
          pronunciationScore: Math.min(100, result.score + Math.floor(Math.random() * 10) - 5),
          grammarScore: Math.min(100, result.score + Math.floor(Math.random() * 10) - 5),
          fluencyScore: Math.min(100, result.score + Math.floor(Math.random() * 8) - 4),
          vocabularyScore: Math.min(100, result.score + Math.floor(Math.random() * 8) - 4),
          suggestions: [],
          strengths: [],
        },
        timestamp: new Date().toISOString(),
      }

      addAiMessage(aiMessage)
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.log(`${LOG_PREFIX.abort} [${requestId}] Request was aborted`)
        return
      }

      if (currentRequestIdRef.current !== requestId) return

      console.warn(`${LOG_PREFIX.error} [${requestId}] Groq failed, using fallback:`, err)
      const fallback = getLocalResponse(userContent, buildHistory())
      addAiMessage(fallback)
    } finally {
      if (currentRequestIdRef.current === requestId) {
        isAiThinkingRef.current = false
        setLocalIsAIThinking(false)
        currentRequestIdRef.current = null
        abortControllerRef.current = null
      }
    }
  }

  function getLocalResponse(userContent: string, history: { sender: string; content: string }[]): Message {
    const aiResponse = generateResponse(userContent, history)
    return {
      id: uuidv4(),
      conversationId: 'local',
      sender: 'ai',
      content: aiResponse.content,
      corrections: aiResponse.corrections.length > 0
        ? aiResponse.corrections.map((c) => ({
            id: uuidv4(),
            originalText: c.original,
            correctedText: c.correction,
            type: 'grammar' as const,
            explanation: c.rule,
            startIndex: 0,
            endIndex: 0,
            severity: 'low' as const,
          }))
        : undefined,
      feedback: {
        overallScore: aiResponse.score,
        pronunciationScore: Math.min(100, aiResponse.score + Math.floor(Math.random() * 10) - 5),
        grammarScore: Math.min(100, aiResponse.score + Math.floor(Math.random() * 10) - 5),
        fluencyScore: Math.min(100, aiResponse.score + Math.floor(Math.random() * 8) - 4),
        vocabularyScore: Math.min(100, aiResponse.score + Math.floor(Math.random() * 8) - 4),
        suggestions: [],
        strengths: [],
      },
      timestamp: new Date().toISOString(),
    }
  }

  async function handleUserContent(content: string) {
    if (!content.trim() || isAiThinkingRef.current) return

    console.log(`${LOG_PREFIX.transcript} User message: "${content}" (${content.length} chars)`)

    addUserMessage(content)

    if (aiMode === 'local') {
      isAiThinkingRef.current = true
      setLocalIsAIThinking(true)
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))
      const history = buildHistory()
      const aiMessage = getLocalResponse(content, history)
      addAiMessage(aiMessage)
      isAiThinkingRef.current = false
      setLocalIsAIThinking(false)
    } else if (aiMode === 'groq') {
      await sendToGroq(content)
    } else if (serverSendMessage) {
      serverSendMessage(content)
    }
  }

  async function startRecording() {
    const now = Date.now()
    if (now - lastPointerDownRef.current < 300) {
      console.warn(`${LOG_PREFIX.mic} Ignoring rapid pointer event`)
      return
    }
    lastPointerDownRef.current = now

    if (isAiThinkingRef.current) {
      console.log(`${LOG_PREFIX.mic} AI thinking, aborting previous request to start new recording`)
      abortCurrentRequest()
      isAiThinkingRef.current = false
      setLocalIsAIThinking(false)
    }

    if (isRecordingRef.current) {
      console.warn(`${LOG_PREFIX.mic} Already recording, ignoring`)
      return
    }
    isRecordingRef.current = true

    try {
      console.log(`${LOG_PREFIX.mic} Requesting microphone...`)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!isRecordingRef.current) {
        stream.getTracks().forEach(t => t.stop())
        return
      }
      streamRef.current = stream
      console.log(`${LOG_PREFIX.mic} Microphone opened`)

      let mimeType = 'audio/webm'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/ogg; codecs=opus'
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4'
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      setStoreIsRecording(true)

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size === 0) return
        console.log(`${LOG_PREFIX.mic} Recording stopped, blob size: ${event.data.size}`)
        await handleVoiceInput(event.data)
      }

      mediaRecorder.onerror = (event) => {
        console.error(`${LOG_PREFIX.error} MediaRecorder error:`, event)
        cleanupRecording()
        setLocalError('Recording error occurred. Please try again.')
      }

      mediaRecorder.start()
      console.log(`${LOG_PREFIX.mic} Recording started`)

      waveformIntervalRef.current = setInterval(() => {
        setRecordingLevel(Math.random() * 100)
      }, 100)

      recordingTimeoutRef.current = setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          console.log(`${LOG_PREFIX.mic} Auto-stopping recording (30s limit)`)
          mediaRecorder.stop()
        }
      }, 30000)
    } catch (err) {
      isRecordingRef.current = false
      console.error(`${LOG_PREFIX.error} Microphone access denied:`, err)
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setLocalError('Microphone access denied. Please allow microphone permissions and try again.')
      } else if (err instanceof DOMException && err.name === 'NotFoundError') {
        setLocalError('No microphone found. Please connect a microphone and try again.')
      } else {
        setLocalError('Could not access microphone. Please try again.')
      }
    }
  }

  function stopRecording() {
    if (!isRecordingRef.current) return
    if (mediaRecorderRef.current?.state === 'recording') {
      console.log(`${LOG_PREFIX.mic} Stopping recording`)
      mediaRecorderRef.current.stop()
    }
    cleanupRecording()
  }

  function cleanupRecording() {
    isRecordingRef.current = false
    setStoreIsRecording(false)
    setRecordingLevel(0)

    if (waveformIntervalRef.current) {
      clearInterval(waveformIntervalRef.current)
      waveformIntervalRef.current = null
    }

    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current)
      recordingTimeoutRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  async function handleVoiceInput(audioBlob: Blob) {
    try {
      console.log(`${LOG_PREFIX.transcript} Sending audio for transcription...`)
      const { transcript } = await voiceService.uploadAudio(audioBlob)
      console.log(`${LOG_PREFIX.transcript} Transcript received: "${transcript}"`)

      if (!transcript?.trim() || transcript === 'null' || transcript === 'undefined') {
        console.warn(`${LOG_PREFIX.transcript} Empty transcript`)
        setLocalError('No speech detected. Please speak clearly and try again.')
        return
      }

      await handleUserContent(transcript)
    } catch (err) {
      console.error(`${LOG_PREFIX.error} Voice transcription failed:`, err)
      setLocalError('Voice transcription failed. Please type your message instead.')
    }
  }

  function handleTextSend() {
    if (!textInput.trim() || isAiThinkingRef.current) return
    const content = textInput
    setTextInput('')
    handleUserContent(content)
  }

  function clearError() {
    setLocalError(null)
    setStoreError(null)
  }

  function handleModeChange(mode: 'local' | 'groq' | 'server') {
    if (isAiThinkingRef.current) {
      abortCurrentRequest()
      isAiThinkingRef.current = false
      setLocalIsAIThinking(false)
    }
    setAiMode(mode)
    clearError()
  }

  function handleInputModeChange(mode: 'voice' | 'text') {
    if (isRecordingRef.current) return
    setStoreInputMode(mode)
    clearError()
  }

  const renderCorrections = (corrections: Correction[]) => {
    if (!corrections || corrections.length === 0) return null
    return (
      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
        {corrections.map((corr, idx) => (
          <div key={idx} className="bg-white/5 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-error mb-1.5">
              <span className="material-symbols-rounded text-sm">close</span>
              <span className="line-through">{corr.originalText}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success mb-1.5">
              <span className="material-symbols-rounded text-sm">check</span>
              <span>{corr.correctedText}</span>
            </div>
            <p className="text-[11px] text-text-secondary/80">{corr.explanation}</p>
          </div>
        ))}
      </div>
    )
  }

  const getScore = (msg: Message): number | undefined => {
    if (msg.feedback?.overallScore) return msg.feedback.overallScore
    return undefined
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopBar title={topicParam ? `Free Conversation - ${topicParam}` : 'Free Conversation'} showStreak={false} showXp={false} />

      <div className="px-5 mb-4 space-y-2">
        <div className="flex gap-2 bg-surface-2 rounded-2xl p-1">
          {['voice', 'text'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleInputModeChange(mode as 'voice' | 'text')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                storeInputMode === mode
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="material-symbols-rounded text-base align-middle mr-1.5">
                {mode === 'voice' ? 'mic' : 'keyboard'}
              </span>
              {mode === 'voice' ? 'Voice' : 'Text'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(['local', 'groq', 'server'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`text-[10px] px-2.5 py-1 rounded-full transition-all font-medium ${
                aiMode === mode
                  ? mode === 'local'
                    ? 'bg-accent/20 text-accent'
                    : mode === 'groq'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-success/20 text-success'
                  : 'bg-surface-2 text-text-tertiary'
              }`}
            >
              {mode === 'local' ? 'Local' : mode === 'groq' ? 'Groq' : 'Server'}
            </button>
          ))}
        </div>
      </div>

      {displayError && (
        <div className="px-5 mb-4">
          <div className="bg-error/10 text-error text-xs rounded-2xl px-4 py-3 border border-error/20 flex items-center gap-2">
            <span className="flex-1">{displayError}</span>
            <button onClick={clearError} className="material-symbols-rounded text-sm hover:text-error/80">close</button>
          </div>
        </div>
      )}

      <div className="px-5 space-y-4">
        {messages.map((message) => {
          const role = message.sender === 'ai' ? 'assistant' : 'user'
          const score = getScore(message)
          return (
            <div
              key={message.id}
              className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
            >
              <div
                className={`max-w-[85%] ${
                  role === 'user'
                    ? 'bg-gradient-primary text-white rounded-3xl rounded-br-lg'
                    : 'bg-surface text-text-primary rounded-3xl rounded-bl-lg'
                } px-5 py-4 shadow-soft`}
              >
                {role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="material-symbols-rounded text-white text-xs">auto_awesome</span>
                    </div>
                    <span className="text-xs font-semibold text-primary">Coach</span>
                    {score && (
                      <span className={`text-xs font-bold ml-auto ${
                        score >= 80 ? 'text-success' : score >= 60 ? 'text-accent' : 'text-error'
                      }`}>
                        {score}/100
                      </span>
                    )}
                  </div>
                )}
                <p className={`text-sm leading-relaxed ${
                  role === 'user' ? 'text-white' : 'text-text-primary'
                }`}>
                  {message.content}
                </p>

                {message.corrections && message.corrections.length > 0 && renderCorrections(message.corrections)}

                <div className={`text-[10px] mt-2 ${
                  role === 'user' ? 'text-white/50' : 'text-text-tertiary'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}

        {isAIThinking && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-surface rounded-3xl rounded-bl-lg px-5 py-4 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="material-symbols-rounded text-white text-xs">auto_awesome</span>
                </div>
                <span className="text-xs font-semibold text-primary">Coach</span>
              </div>
              <div className="flex items-center gap-1.5 py-1">
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-5 pb-4">
        {storeInputMode === 'voice' ? (
          <div className="flex flex-col items-center gap-4">
            {isRecordingRef.current && (
              <div className="flex items-center gap-1 h-10">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.random() * 100 * (recordingLevel / 100)}%`,
                      opacity: 0.4 + (recordingLevel / 100) * 0.6,
                    }}
                  />
                ))}
              </div>
            )}

            <button
              onPointerDown={startRecording}
              onPointerUp={stopRecording}
              disabled={!isRecordingRef.current && isAIThinking}
              style={{ touchAction: 'manipulation' }}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 
                ${isRecordingRef.current
                  ? 'bg-error scale-110 shadow-glow-lg'
                  : 'bg-gradient-primary shadow-glow hover:shadow-glow-lg'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className={`material-symbols-rounded text-white text-3xl ${
                isRecordingRef.current ? 'animate-pulse-soft' : ''
              }`}>
                {isRecordingRef.current ? 'stop' : 'mic'}
              </span>
            </button>

            <p className="text-text-tertiary text-xs font-medium">
              {isRecordingRef.current ? 'Release to send' : isAIThinking ? 'Waiting for AI...' : 'Hold to record'}
            </p>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-surface rounded-3xl border border-divider overflow-hidden">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleTextSend()
                  }
                }}
                placeholder={isAIThinking ? 'Waiting for AI response...' : 'Type your message...'}
                rows={1}
                disabled={isAIThinking}
                className="w-full bg-transparent text-text-primary text-sm px-5 py-4 resize-none 
                           placeholder:text-text-tertiary max-h-32 disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleTextSend}
              disabled={!textInput.trim() || isAIThinking}
              className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center 
                         shadow-glow disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 
                         transition-all flex-shrink-0"
            >
              <span className="material-symbols-rounded text-white text-xl">send</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


