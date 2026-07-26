'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { startAudioStream, stopAudioStream } from '@/lib/audio'

interface UseVoiceRecorderOptions {
  onAudioLevel?: (level: number) => void
  maxDuration?: number
}

interface UseVoiceRecorderReturn {
  isRecording: boolean
  isPaused: boolean
  audioBlob: Blob | null
  audioUrl: string | null
  duration: number
  audioLevel: number
  error: string | null
  isSupported: boolean
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob | null>
  pauseRecording: () => void
  resumeRecording: () => void
  resetRecording: () => void
}

const RECORDING_TIMESLICE = 250

export function useVoiceRecorder(options: UseVoiceRecorderOptions = {}): UseVoiceRecorderReturn {
  const { onAudioLevel, maxDuration = 120 } = options

  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const isSupported =
    typeof window !== 'undefined' &&
    'mediaDevices' in navigator &&
    !!navigator.mediaDevices &&
    'getUserMedia' in navigator.mediaDevices &&
    !!(window.MediaRecorder || (window as unknown as { webkitMediaRecorder?: typeof MediaRecorder }).webkitMediaRecorder)

  const cleanup = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }
    stopAudioStream()
    mediaRecorderRef.current = null
  }, [])

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        cleanup()
        setIsRecording(false)
        setIsPaused(false)
        resolve(null)
        return
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)
        setIsRecording(false)
        setIsPaused(false)
        cleanup()
        resolve(blob)
      }

      mediaRecorderRef.current.stop()
    })
  }, [cleanup])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)
      setAudioUrl(null)
      setDuration(0)
      chunksRef.current = []

      const stream = await startAudioStream((level) => {
        setAudioLevel(level)
        onAudioLevel?.(level)
      })

      const MediaRecorderCtor = window.MediaRecorder || (window as unknown as { webkitMediaRecorder: typeof MediaRecorder }).webkitMediaRecorder
      if (!MediaRecorderCtor) {
        throw new Error('MediaRecorder is not supported in this browser')
      }

      const mimeType = MediaRecorderCtor.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorderCtor.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4'

      const recorder = new MediaRecorderCtor(stream, {
        mimeType,
        audioBitsPerSecond: 16000,
      })

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onerror = () => {
        setError('Recording error occurred')
        cleanup()
        setIsRecording(false)
      }

      recorder.start(RECORDING_TIMESLICE)
      mediaRecorderRef.current = recorder
      startTimeRef.current = Date.now()
      setIsRecording(true)

      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setDuration(elapsed)
        if (elapsed >= maxDuration) {
          stopRecording()
        }
      }, 250)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start recording'
      setError(message)
      setIsRecording(false)
    }
  }, [onAudioLevel, maxDuration, stopRecording, cleanup])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }, [])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setDuration(elapsed)
      }, 250)
    }
  }, [])

  const resetRecording = useCallback(() => {
    cleanup()
    chunksRef.current = []
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    setAudioLevel(0)
    setError(null)
    setIsRecording(false)
    setIsPaused(false)
  }, [cleanup])

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    isRecording,
    isPaused,
    audioBlob,
    audioUrl,
    duration,
    audioLevel,
    error,
    isSupported,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  }
}
