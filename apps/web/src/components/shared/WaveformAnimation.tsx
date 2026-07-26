'use client'

interface WaveformAnimationProps {
  isActive?: boolean
  color?: string
  barCount?: number
}

export function WaveformAnimation({ isActive = true, color = '#FF7A00', barCount = 40 }: WaveformAnimationProps) {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-all duration-75"
          style={{
            height: isActive ? `${Math.random() * 100}%` : '2px',
            backgroundColor: isActive ? color : 'rgba(255,255,255,0.1)',
            opacity: isActive ? 0.4 + Math.random() * 0.6 : 0.2,
            animation: isActive
              ? `waveform ${0.8 + Math.random() * 0.6}s ease-in-out infinite`
              : 'none',
            animationDelay: `${i * 30}ms`,
          }}
        />
      ))}
    </div>
  )
}
