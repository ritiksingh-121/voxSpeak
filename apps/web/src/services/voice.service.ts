import api from './api'
import { ApiResponse } from '@/types/api'

export interface PronunciationAnalysis {
  overallScore: number
  phonemeScores: { phoneme: string; accuracy: number }[]
  intonation: number
  rhythm: number
  stress: number
  transcript: string
  detectedLanguage: string
  corrections: {
    word: string
    expected: string
    actual: string
    suggestion: string
  }[]
}

export const voiceService = {
  async uploadAudio(audioBlob: Blob, _conversationId?: string): Promise<{ transcript: string; audioUrl: string; duration: number }> {
    const formData = new FormData()
    formData.append('file', audioBlob, 'recording.webm')

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Transcription failed' }))
      throw new Error(err.error || `Transcription failed (${response.status})`)
    }

    const data = await response.json()
    return { transcript: data.transcript, audioUrl: data.audioUrl || '', duration: data.duration || 0 }
  },

  async analyzePronunciation(audioBlob: Blob, text?: string): Promise<PronunciationAnalysis> {
    const formData = new FormData()
    formData.append('file', audioBlob, 'recording.webm')
    if (text) {
      formData.append('referenceText', text)
    }

    const response = await api.post<ApiResponse<PronunciationAnalysis>>(
      '/voice/analyze-pronunciation',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data.data
  },

  async textToSpeech(text: string, voice = 'en-US-Neural2-F'): Promise<ArrayBuffer> {
    const response = await api.post<ArrayBuffer>(
      '/voice/tts',
      { text, voice },
      { responseType: 'arraybuffer' }
    )
    return response.data
  },
}

export type VoiceService = typeof voiceService
