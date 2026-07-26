import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type AppTheme = 'dark' | 'light'

export type BottomNavTab = 'conversation' | 'progress' | 'vocabulary' | 'settings'

interface AppState {
  theme: AppTheme
  bottomNavVisible: boolean
  activeBottomTab: BottomNavTab
  onboardingComplete: boolean
  isOnline: boolean
  isKeyboardVisible: boolean
  sidebarOpen: boolean
}

interface AppActions {
  setTheme: (theme: AppTheme) => void
  toggleTheme: () => void
  setBottomNavVisible: (visible: boolean) => void
  setActiveBottomTab: (tab: BottomNavTab) => void
  setOnboardingComplete: (complete: boolean) => void
  setIsOnline: (online: boolean) => void
  setKeyboardVisible: (visible: boolean) => void
  setSidebarOpen: (open: boolean) => void
}

type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      bottomNavVisible: true,
      activeBottomTab: 'conversation',
      onboardingComplete: false,
      isOnline: true,
      isKeyboardVisible: false,
      sidebarOpen: false,

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),

      setBottomNavVisible: (bottomNavVisible) => set({ bottomNavVisible }),

      setActiveBottomTab: (activeBottomTab) => set({ activeBottomTab }),

      setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),

      setIsOnline: (isOnline) => set({ isOnline }),

      setKeyboardVisible: (isKeyboardVisible) => set({ isKeyboardVisible }),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'voxspeak-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
)
