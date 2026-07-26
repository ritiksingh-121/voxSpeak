'use client'

import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/shared/TopBar'
import { CircularProgress } from '@/components/shared/CircularProgress'
import { useProgressStore } from '@/stores/progress.store'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function ProgressOverview() {
  const router = useRouter()
  const {
    sessions, totalMinutes, wordsSpoken, vocabularyCount,
    pronunciationScore, grammarScore, fluencyScore,
    weeklyMinutes, milestones, markMilestoneAchieved,
  } = useProgressStore()

  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMins = totalMinutes % 60
  const avgMinutes = Math.round(totalMinutes / (weeklyMinutes.filter((m) => m > 0).length || 1))
  const totalWeeklyMinutes = weeklyMinutes.reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Progress" />

      <main className="px-5 space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Sessions', value: String(sessions), icon: 'chat', color: 'text-primary' },
            { label: 'Minutes', value: String(totalMinutes), icon: 'timer', color: 'text-accent' },
            { label: 'Words Spoken', value: `${(wordsSpoken / 1000).toFixed(1)}K`, icon: 'text_fields', color: 'text-success' },
            { label: 'Vocabulary', value: String(vocabularyCount), icon: 'dictionary', color: 'text-purple-400' },
          ].map((stat) => (
            <div key={stat.label} className="card flex flex-col gap-2">
              <span className={`material-symbols-rounded text-2xl ${stat.color}`}>{stat.icon}</span>
              <div>
                <p className="heading-sm">{stat.value}</p>
                <p className="text-xs text-text-tertiary">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scores */}
        <div className="flex gap-3">
          {[
            { label: 'Pronunciation', value: pronunciationScore, color: '#FF7A00', route: '/progress/pronunciation' },
            { label: 'Grammar', value: grammarScore, color: '#FFC857', route: '/progress/grammar' },
            { label: 'Fluency', value: fluencyScore, color: '#22C55E' },
          ].map((score) => (
            <button
              key={score.label}
              onClick={() => score.route ? router.push(score.route) : null}
              className={`flex-1 card flex flex-col items-center gap-2 py-4 transition-all active:scale-[0.97] ${score.route ? 'cursor-pointer hover:bg-surface-2' : ''}`}
            >
              <CircularProgress
                progress={score.value}
                size={70}
                strokeWidth={5}
                value={String(score.value)}
                color={score.color}
              />
              <p className="text-xs text-text-secondary font-medium">{score.label}</p>
            </button>
          ))}
        </div>

        {/* Weekly Activity */}
        <div className="card space-y-4">
          <h2 className="section-title">This Week</h2>
          <div className="flex items-end justify-between h-28">
            {weekDays.map((day, idx) => (
              <div key={day} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full max-w-[24px] rounded-lg bg-gradient-primary transition-all duration-500"
                  style={{ height: `${Math.max((weeklyMinutes[idx] / 90) * 100, 4)}%` }}
                />
                <span className="text-[10px] text-text-tertiary font-medium">{day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Total: {totalHours}h {remainingMins}m</span>
            <span>Avg: {avgMinutes}m/day</span>
          </div>
        </div>

        {/* Milestones */}
        <div className="card space-y-3">
          <h2 className="section-title">Milestones</h2>
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <button
                key={milestone.title}
                onClick={() => {
                  if (!milestone.achieved) markMilestoneAchieved(milestone.title)
                }}
                disabled={milestone.achieved}
                className={`w-full flex items-center gap-3 text-left transition-all ${
                  !milestone.achieved ? 'opacity-50 hover:opacity-80' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.achieved ? 'bg-success/20' : 'bg-surface-3'
                }`}>
                  <span className={`material-symbols-rounded text-sm ${
                    milestone.achieved ? 'text-success' : 'text-text-tertiary'
                  }`}>
                    {milestone.achieved ? 'check' : 'radio_button_unchecked'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{milestone.title}</p>
                  <p className="text-[11px] text-text-tertiary">{milestone.date}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Weak Areas Recommendation */}
        <div className="card-premium space-y-3">
          <h2 className="section-title text-white">Focus On Today</h2>
          <p className="text-sm text-text-secondary">
            Based on your recent conversations, here are your top areas to improve:
          </p>
          <div className="space-y-2">
            {[
              { area: 'Th sound (think, thought)', type: 'Pronunciation', route: '/progress/pronunciation' },
              { area: 'Present Perfect tense', type: 'Grammar', route: '/progress/grammar' },
              { area: 'Business vocabulary', type: 'Vocabulary', route: '/vocabulary' },
            ].map((item) => (
              <div key={item.area} className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                <span className="material-symbols-rounded text-primary text-lg">tips_and_updates</span>
                <div className="flex-1">
                  <p className="text-sm text-text-primary">{item.area}</p>
                  <p className="text-[11px] text-text-tertiary">{item.type}</p>
                </div>
                <button
                  onClick={() => router.push(item.route)}
                  className="text-xs text-primary font-semibold"
                >
                  Practice
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
