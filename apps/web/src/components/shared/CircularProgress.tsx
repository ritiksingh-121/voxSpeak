'use client'

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  label?: string
  value?: string
  color?: string
}

export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 6,
  label,
  value,
  color = '#FF7A00'
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {value ? (
          <span className="text-2xl font-bold text-text-primary">{value}</span>
        ) : (
          <span className="text-2xl font-bold text-text-primary">{Math.round(progress)}%</span>
        )}
        {label && (
          <span className="text-[10px] font-medium text-text-secondary mt-0.5">{label}</span>
        )}
      </div>
    </div>
  )
}
