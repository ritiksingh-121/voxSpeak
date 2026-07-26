'use client'

interface XpDisplayProps {
  amount: number
  level: number
}

export function XpDisplay({ amount, level }: XpDisplayProps) {
  return (
    <div className="flex items-center gap-2 bg-surface-2 rounded-pill px-3 py-1.5">
      <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
        <span className="material-symbols-rounded text-white text-xs">bolt</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xs font-bold text-text-primary">{amount}</span>
        <span className="text-[9px] text-text-tertiary font-medium">Lvl {level}</span>
      </div>
    </div>
  )
}
