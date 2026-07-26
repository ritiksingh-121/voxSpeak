'use client'

interface PronunciationScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function PronunciationScore({ score, size = 'md', label }: PronunciationScoreProps) {
  const sizes = {
    sm: { ring: 40, stroke: 4, text: 'text-sm', icon: 'text-base' },
    md: { ring: 56, stroke: 5, text: 'text-lg', icon: 'text-xl' },
    lg: { ring: 72, stroke: 6, text: 'text-2xl', icon: 'text-2xl' },
  }

  const s = sizes[size]
  const radius = (s.ring - s.stroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22C55E'
    if (score >= 60) return '#FFC857'
    return '#EF4444'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return 'sentiment_satisfied'
    if (score >= 60) return 'sentiment_neutral'
    return 'sentiment_dissatisfied'
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={s.ring} height={s.ring} className="-rotate-90">
        <circle
          cx={s.ring / 2}
          cy={s.ring / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={s.stroke}
        />
        <circle
          cx={s.ring / 2}
          cy={s.ring / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={s.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="material-symbols-rounded" style={{ fontSize: s.icon, color: getScoreColor(score) }}>
          {getScoreIcon(score)}
        </span>
        {label && (
          <span className="text-[8px] text-text-tertiary mt-0.5">{label}</span>
        )}
      </div>
    </div>
  )
}
