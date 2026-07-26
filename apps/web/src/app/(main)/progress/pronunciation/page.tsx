'use client'

import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/shared/TopBar'
import { useProgressStore } from '@/stores/progress.store'

export default function PronunciationProgress() {
  const router = useRouter()
  const { pronunciationScore, phonemes, pronunciationWeekly } = useProgressStore()

  const avgScore = Math.round(
    phonemes.reduce((sum, p) => sum + p.score, 0) / phonemes.length
  )

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Pronunciation" />

      <main className="px-5 space-y-6 animate-fade-in">
        {/* Overall Score */}
        <div className="card-premium text-center py-8 space-y-3">
          <p className="text-5xl font-bold text-white">{avgScore}</p>
          <p className="text-sm text-text-secondary">Average Pronunciation Score</p>
          <div className="flex justify-center gap-4 text-xs">
            <span className="text-success">↑ 5% this week</span>
            <span className="text-text-tertiary">Last 30 days</span>
          </div>
        </div>

        {/* Phoneme Breakdown */}
        <div className="card space-y-4">
          <h2 className="section-title">Sound Accuracy</h2>
          {phonemes.map((item) => (
            <div key={item.phoneme} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-primary">{item.phoneme}</span>
                  <span className={`font-semibold ${
                    item.score >= 80 ? 'text-success' :
                    item.score >= 60 ? 'text-accent' : 'text-error'
                  }`}>{item.score}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.score}%`,
                      background: item.score >= 80
                        ? 'linear-gradient(135deg, #22C55E, #4ADE80)'
                        : item.score >= 60
                          ? 'linear-gradient(135deg, #FFC857, #FFD980)'
                          : 'linear-gradient(135deg, #EF4444, #F87171)',
                    }}
                  />
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-pill capitalize ${
                item.status === 'weak' ? 'bg-error/15 text-error' :
                item.status === 'fair' ? 'bg-accent/15 text-accent' :
                item.status === 'good' ? 'bg-success/15 text-success' :
                'bg-primary/15 text-primary'
              }`}>{item.status}</span>
            </div>
          ))}
        </div>

        {/* Weekly Trend */}
        <div className="card space-y-3">
          <h2 className="section-title">Weekly Trend</h2>
          <div className="flex items-end justify-between h-24">
            {pronunciationWeekly.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className="w-full max-w-[20px] rounded-lg bg-gradient-primary transition-all"
                  style={{ height: `${(d.value / 100) * 80}%` }}
                />
                <span className="text-[9px] text-text-tertiary">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Recommendations */}
        <div className="card space-y-3">
          <h2 className="section-title">Practice These</h2>
          {[
            { sound: 'th sound', tip: 'Place your tongue between your teeth and blow air', icon: 'psychology' },
            { sound: 'zh sound', tip: 'Vibrate your vocal cords, like a buzzing bee', icon: 'tips_and_updates' },
          ].map((item) => (
            <div key={item.sound} className="bg-surface-2 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-primary text-lg">{item.icon}</span>
                <h3 className="text-sm font-semibold text-text-primary">{item.sound}</h3>
              </div>
              <p className="text-xs text-text-secondary">{item.tip}</p>
              <button
                onClick={() => router.push('/practice/shadowing')}
                className="text-xs text-primary font-semibold"
              >
                Practice Now →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
