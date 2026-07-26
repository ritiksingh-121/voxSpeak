"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder"
import { WaveformAnimation } from "@/components/shared/WaveformAnimation"

type RecorderState = "idle" | "recording" | "processing"

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
  onError?: (error: string) => void
  maxDuration?: number
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export function VoiceRecorder({
  onRecordingComplete,
  onError,
  maxDuration = 120,
}: VoiceRecorderProps) {
  const [recorderState, setRecorderState] = useState<RecorderState>("idle")
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)

  const handleAudioLevel = useCallback((_level: number) => {
  }, [])

  const {
    isRecording,
    audioBlob,
    duration,
    error,
    isSupported,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder({
    onAudioLevel: handleAudioLevel,
    maxDuration,
  })

  useEffect(() => {
    if (error) {
      setRecorderState("idle")
      onError?.(error)
    }
  }, [error, onError])

  useEffect(() => {
    if (!isRecording && recorderState === "recording") {
      if (audioBlob) {
        setRecorderState("processing")
        onRecordingComplete(audioBlob)
        resetRecording()
      }
      setRecorderState("idle")
    }
  }, [isRecording, audioBlob, recorderState, onRecordingComplete, resetRecording])

  const handlePointerDown = useCallback(async () => {
    isLongPress.current = false
    longPressTimer.current = setTimeout(async () => {
      isLongPress.current = true
      setRecorderState("recording")
      await startRecording()
    }, 150)
  }, [startRecording])

  const handlePointerUp = useCallback(async () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    if (isLongPress.current) {
      await stopRecording()
    }
    isLongPress.current = false
  }, [stopRecording])

  const handlePointerLeave = useCallback(async () => {
    if (isLongPress.current && isRecording) {
      await stopRecording()
    }
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    isLongPress.current = false
  }, [isRecording, stopRecording])

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center">
          <span className="material-symbols-rounded text-2xl text-text-tertiary">mic_off</span>
        </div>
        <p className="text-sm text-text-tertiary text-center">
          Voice recording is not supported in your browser.
          Please use a modern browser or try typing instead.
        </p>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center gap-4"
      role="region"
      aria-label="Voice recorder"
    >
      {recorderState === "recording" && (
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <WaveformAnimation isActive={true} color="#FF7A00" barCount={40} />
          <div
            className="flex items-center gap-2 text-sm font-mono text-text-secondary"
            aria-live="polite"
            aria-label={`Recording duration: ${formatDuration(duration)}`}
          >
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" aria-hidden="true" />
            {formatDuration(duration)}
          </div>
        </div>
      )}

      {recorderState === "processing" && (
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-text-secondary">Processing your recording...</p>
        </div>
      )}

      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onContextMenu={(e) => e.preventDefault()}
        disabled={recorderState === "processing"}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-200 select-none touch-none
          ${recorderState === "idle"
            ? "bg-gradient-primary shadow-glow hover:shadow-glow-lg hover:scale-105 active:scale-95"
            : ""
          }
          ${recorderState === "recording"
            ? "bg-error scale-110 shadow-glow-lg"
            : ""
          }
          ${recorderState === "processing"
            ? "bg-surface-2 cursor-not-allowed"
            : ""
          }
        `}
        aria-label={
          recorderState === "idle"
            ? "Press and hold to start recording"
            : recorderState === "recording"
              ? "Release to send recording"
              : "Processing recording"
        }
        aria-pressed={recorderState === "recording"}
      >
        {recorderState === "recording" && (
          <span className="absolute inset-0 rounded-full bg-error/20 animate-ping" aria-hidden="true" />
        )}
        <span
          className={`
            material-symbols-rounded text-white text-3xl relative z-10
            ${recorderState === "recording" ? "animate-pulse-soft" : ""}
          `}
        >
          {recorderState === "recording" ? "stop" : "mic"}
        </span>
      </button>

      <p className="text-text-tertiary text-xs font-medium select-none" aria-hidden="true">
        {recorderState === "idle" && "Press and hold to record"}
        {recorderState === "recording" && "Release to send"}
        {recorderState === "processing" && "Sending..."}
      </p>
    </div>
  )
}
