'use client'

interface FeedbackPanelProps {
  overallScore?: number
  pronunciationScore?: number
  grammarScore?: number
  vocabularyScore?: number
  fluencyScore?: number
  strengths?: string[]
  improvements?: string[]
  isVisible: boolean
  onClose: () => void
}

export function FeedbackPanel({
  overallScore = 78,
  pronunciationScore = 72,
  grammarScore = 65,
  vocabularyScore = 80,
  fluencyScore = 75,
  strengths = ['Good vocabulary use', 'Natural pace', 'Clear questions'],
  improvements = ['Th sound pronunciation', 'Present perfect tense', 'Article usage'],
  isVisible,
  onClose,
}: FeedbackPanelProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface rounded-t-4xl shadow-soft-xl animate-slide-up border-t border-divider p-6 pb-10">
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-divider mx-auto mb-6" />

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="heading-sm">Session Feedback</h2>
            <p className="text-text-tertiary text-sm">Great effort! Here&apos;s how you did</p>
          </div>

          {/* Overall Score */}
          <div className="flex justify-center">
            <div className="relative w-28 h-28">
              <svg width="112" height="112" className="-rotate-90">
                <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="56" cy="56" r="48"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={301.6}
                  strokeDashoffset={301.6 - (overallScore / 100) * 301.6}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF7A00" />
                    <stop offset="100%" stopColor="#FFC857" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-text-primary">{overallScore}</span>
                <span className="text-[10px] text-text-tertiary font-medium">Overall</span>
              </div>
            </div>
          </div>

          {/* Detail Scores */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Pronunciation', value: pronunciationScore, color: '#FF7A00' },
              { label: 'Grammar', value: grammarScore, color: '#FFC857' },
              { label: 'Vocabulary', value: vocabularyScore, color: '#22C55E' },
              { label: 'Fluency', value: fluencyScore, color: '#8B5CF6' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="relative w-full aspect-square max-w-[60px] mx-auto">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke={item.color} strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${item.value}, 100`} className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-text-primary">{item.value}</span>
                  </div>
                </div>
                <p className="text-[9px] text-text-tertiary mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-success text-sm">thumb_up</span>
              <h3 className="text-sm font-semibold text-text-primary">Strengths</h3>
            </div>
            <ul className="space-y-1.5">
              {strengths.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="w-1 h-1 rounded-full bg-success" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-primary text-sm">trending_up</span>
              <h3 className="text-sm font-semibold text-text-primary">Focus Areas</h3>
            </div>
            <ul className="space-y-1.5">
              {improvements.map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  {i}
                </li>
              ))}
            </ul>
          </div>

          {/* XP Earned */}
          <div className="bg-gradient-card rounded-3xl py-4 px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-accent">bolt</span>
              <span className="text-sm text-text-primary font-medium">XP Earned</span>
            </div>
            <span className="text-lg font-bold text-accent">+45 XP</span>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="btn-primary w-full">Practice Again</button>
            <button onClick={onClose} className="btn-ghost w-full">Back to Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  )
}
