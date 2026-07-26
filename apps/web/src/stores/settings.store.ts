import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced'
export type AiVoice = 'american-female' | 'american-male' | 'british-female' | 'british-male' | 'australian-female'
export type SpeechSpeed = 0.5 | 0.75 | 1.0 | 1.25 | 1.5
export type VoiceVolume = 25 | 50 | 75 | 80 | 100
export type DailyGoal = 5 | 10 | 15 | 20 | 30 | 45 | 60

export type NativeLanguage = 'english' | 'spanish' | 'french' | 'german' | 'italian' | 'portuguese' | 'chinese' | 'japanese' | 'korean' | 'hindi' | 'arabic' | 'russian'

interface SettingsState {
  notifications: {
    push: boolean
    streakReminders: boolean
    dailyLessonReminder: boolean
    productUpdates: boolean
  }
  learning: {
    nativeLanguage: NativeLanguage
    proficiencyLevel: ProficiencyLevel
    dailyGoalMinutes: DailyGoal
    topics: string[]
  }
  voice: {
    aiVoice: AiVoice
    speechSpeed: SpeechSpeed
    voiceVolume: VoiceVolume
    microphone: string
  }
  data: {
    aiMemory: boolean
  }
  soundEnabled: boolean
}

interface SettingsActions {
  setNotification: (key: keyof SettingsState['notifications'], value: boolean) => void
  setLearning: (key: keyof SettingsState['learning'], value: string | number | string[]) => void
  setVoice: (key: keyof SettingsState['voice'], value: string | number) => void
  setData: (key: keyof SettingsState['data'], value: boolean) => void
  setSoundEnabled: (value: boolean) => void
}

type SettingsStore = SettingsState & SettingsActions

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      notifications: {
        push: true,
        streakReminders: true,
        dailyLessonReminder: false,
        productUpdates: false,
      },
      learning: {
        nativeLanguage: 'spanish',
        proficiencyLevel: 'intermediate',
        dailyGoalMinutes: 15,
        topics: ['Travel', 'Technology', 'Food'],
      },
      voice: {
        aiVoice: 'american-female',
        speechSpeed: 1.0,
        voiceVolume: 80,
        microphone: 'Default',
      },
      data: {
        aiMemory: true,
      },
      soundEnabled: true,

      setNotification: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),

      setLearning: (key, value) =>
        set((state) => ({
          learning: { ...state.learning, [key]: value },
        })),

      setVoice: (key, value) =>
        set((state) => ({
          voice: { ...state.voice, [key]: value },
        })),

      setData: (key, value) =>
        set((state) => ({
          data: { ...state.data, [key]: value },
        })),

      setSoundEnabled: (value) => set({ soundEnabled: value }),
    }),
    {
      name: 'voxspeak-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
