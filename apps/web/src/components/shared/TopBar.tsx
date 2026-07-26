'use client'

import { StreakBadge } from './StreakBadge'
import { XpDisplay } from './XpDisplay'

interface TopBarProps {
  title?: string
  showStreak?: boolean
  showXp?: boolean
  streakCount?: number
  xpAmount?: number
  xpLevel?: number
  onNotification?: () => void
  onBack?: () => void
}

export function TopBar({
  title,
  showStreak = true,
  showXp = true,
  streakCount = 0,
  xpAmount = 0,
  xpLevel = 1,
  onNotification,
  onBack,
}: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 safe-top">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-2xl bg-surface-2 flex items-center justify-center hover:bg-surface-3 transition-all active:scale-95"
          >
            <span className="material-symbols-rounded text-text-secondary text-xl">arrow_back</span>
          </button>
        )}
        {title ? (
          <h1 className="heading-sm">{title}</h1>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="material-symbols-rounded text-white text-xl">record_voice_over</span>
            </div>
            <span className="text-lg font-bold text-primary">VoxSpeak</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showStreak && <StreakBadge count={streakCount} />}
        {showXp && <XpDisplay amount={xpAmount} level={xpLevel} />}

        <button
          onClick={onNotification}
          className="w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center 
                     hover:bg-surface-3 transition-all active:scale-95 relative"
        >
          <span className="material-symbols-rounded text-text-secondary text-xl">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </button>
      </div>
    </div>
  )
}
