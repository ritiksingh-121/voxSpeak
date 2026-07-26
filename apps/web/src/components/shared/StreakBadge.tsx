'use client'

interface StreakBadgeProps {
  count: number
}

export function StreakBadge({ count }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 bg-surface-2 rounded-pill px-3 py-1.5">
      <span className="material-symbols-rounded text-accent text-base">local_fire_department</span>
      <span className="text-sm font-bold text-accent">{count}</span>
    </div>
  )
}
