'use client'

import { TopBar } from '@/components/shared/TopBar'
import { CircularProgress } from '@/components/shared/CircularProgress'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useProgressOverview } from '@/hooks/useProgress'
import { useAuthStore } from '@/stores/auth.store'

const quickPractices = [
  { mode: 'free', label: 'Free Talk', icon: 'question_answer', desc: 'Casual conversation', href: '/practice/conversation' },
  { mode: 'lesson', label: 'Lesson', icon: 'school', desc: 'Structured practice', href: '/practice/lesson' },
  { mode: 'roleplay', label: 'Roleplay', icon: 'theater_comedy', desc: 'Real scenarios', href: '/practice/roleplay' },
  { mode: 'interview', label: 'Interview', icon: 'work', desc: 'Job practice', href: '/practice/interview' },
]

const featureCards = [
  { title: 'Speaking Practice', icon: 'record_voice_over', href: '/practice/conversation', color: 'from-blue-500 to-cyan-500' },
  { title: 'Daily Lesson', icon: 'school', href: '/practice/lesson', color: 'from-primary to-accent' },
  { title: 'Role Play', icon: 'theater_comedy', href: '/practice/roleplay', color: 'from-purple-500 to-pink-500' },
  { title: 'Interview Practice', icon: 'work', href: '/practice/interview', color: 'from-green-500 to-emerald-500' },
  { title: 'Grammar', icon: 'text_fields', href: '/progress/grammar', color: 'from-green-500 to-emerald-500' },
  { title: 'Vocabulary', icon: 'menu_book', href: '/vocabulary', color: 'from-amber-500 to-orange-500' },
  { title: 'Pronunciation', icon: 'hearing', href: '/progress/pronunciation', color: 'from-red-500 to-rose-500' },
  { title: 'AI Tutor', icon: 'auto_awesome', href: '/ai-tutor', color: 'from-purple-500 to-pink-500' },
  { title: 'Leaderboard', icon: 'leaderboard', href: '/leaderboard', color: 'from-indigo-500 to-violet-500' },
  { title: 'Achievements', icon: 'stars', href: '/profile/achievements', color: 'from-amber-500 to-orange-500' },
  { title: 'History', icon: 'history', href: '/progress/overview', color: 'from-teal-500 to-green-500' },
  { title: 'Settings', icon: 'settings', href: '/profile/settings', color: 'from-gray-500 to-slate-500' },
]

const suggestions = [
  { title: 'Ordering Coffee', topic: 'Restaurant', difficulty: 'Beginner', time: '5 min' },
  { title: 'Job Interview', topic: 'Career', difficulty: 'Advanced', time: '15 min' },
  { title: 'Travel Plans', topic: 'Travel', difficulty: 'Intermediate', time: '10 min' },
]

export default function Dashboard() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const { data: progress, isLoading } = useProgressOverview()

  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  })

  const todayMinutes = progress?.weeklyActivity?.[progress.weeklyActivity.length - 1]?.minutes ?? 0
  const dailyGoalMinutes = 15
  const dailyProgress = Math.min(Math.round((todayMinutes / dailyGoalMinutes) * 100), 100)

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar
        streakCount={progress?.streakDays ?? 0}
        xpAmount={progress?.xp ?? 0}
        xpLevel={progress?.level ?? 1}
      />

      <main className="px-5 space-y-6 animate-fade-in">
        <div className="space-y-1">
          <h1 className="heading-xl">{greeting}, {user?.name ?? 'Learner'}</h1>
          <p className="body-text">Ready for today&apos;s practice?</p>
        </div>

        <div className="card-premium flex items-center gap-6">
          <CircularProgress progress={dailyProgress} size={100} strokeWidth={6} label="daily goal" />
          <div className="flex-1 space-y-2">
            <h3 className="heading-sm">Daily Goal</h3>
            <p className="text-text-secondary text-sm">{todayMinutes} of {dailyGoalMinutes} minutes completed</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${dailyProgress}%` }} />
            </div>
            <div className="flex items-center gap-4 text-xs text-text-tertiary">
              <span>Today: {todayMinutes}m</span>
              <span>Sessions: {progress?.totalSessions ?? 0}</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {progress && (
              <div className="card grid grid-cols-2 gap-4">
                {[
                  { label: 'Sessions', value: progress.totalSessions, icon: 'mic' },
                  { label: 'Minutes', value: progress.totalMinutes, icon: 'schedule' },
                  { label: 'Words', value: progress.totalWords, icon: 'text_fields' },
                  { label: 'Avg Score', value: `${Math.round(progress.averageScores.overall)}%`, icon: 'trending_up' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary/20 flex items-center justify-center">
                      <span className="material-symbols-rounded text-primary text-lg">{stat.icon}</span>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                      <p className="text-[11px] text-text-tertiary">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {progress && progress.weakAreas.length > 0 && (
              <div className="card space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">Focus Areas</h2>
                  <button className="btn-ghost text-xs" onClick={() => router.push('/progress/overview')}>View all</button>
                </div>
                <div className="space-y-3">
                  {progress.weakAreas.map((area) => (
                    <div key={area.name} className="flex items-center gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-primary font-medium capitalize">{area.name}</span>
                          <span className="text-text-secondary">{area.score}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${area.score}%`,
                              background: area.score < 40
                                ? 'linear-gradient(135deg, #EF4444, #F87171)'
                                : area.score < 60
                                  ? 'linear-gradient(135deg, #FF7A00, #FFA726)'
                                  : 'linear-gradient(135deg, #22C55E, #4ADE80)',
                            }}
                          />
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-pill ${
                        area.type === 'pronunciation' ? 'bg-purple-500/15 text-purple-400' :
                        area.type === 'grammar' ? 'bg-blue-500/15 text-blue-400' :
                        'bg-green-500/15 text-green-400'
                      }`}>
                        {area.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Link href="/practice/conversation" className="w-full card flex items-center gap-4 hover:bg-surface-2 transition-all active:scale-[0.99]">
          <div className="w-14 h-14 rounded-3xl bg-gradient-card flex items-center justify-center">
            <span className="material-symbols-rounded text-primary text-2xl">play_circle</span>
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-text-primary">Continue Session</h3>
            <p className="text-sm text-text-secondary">Your last conversation</p>
          </div>
          <span className="material-symbols-rounded text-text-tertiary">chevron_right</span>
        </Link>

        <div className="space-y-3">
          <h2 className="section-title">Quick Practice</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-none">
            {quickPractices.map((item) => (
              <Link
                key={item.mode}
                href={item.href}
                className="flex-shrink-0 w-36 card flex flex-col items-center gap-3 py-5 hover:bg-surface-2 transition-all active:scale-95"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary/20 flex items-center justify-center">
                  <span className="material-symbols-rounded text-primary text-2xl">{item.icon}</span>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm text-text-primary">{item.label}</h3>
                  <p className="text-[11px] text-text-tertiary mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="section-title">All Features</h2>
          <div className="grid grid-cols-2 gap-3">
            {featureCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="card flex flex-col items-center gap-3 py-5 hover:bg-surface-2 transition-all active:scale-95"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} bg-opacity-20 flex items-center justify-center`}
                  style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }}
                >
                  <span className="material-symbols-rounded text-white text-2xl">{card.icon}</span>
                </div>
                <h3 className="font-semibold text-xs text-text-primary text-center">{card.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="section-title">For You</h2>
            <button className="btn-ghost text-xs" onClick={() => router.push('/practice/lesson')}>See all</button>
          </div>
          <div className="space-y-3">
            {suggestions.map((lesson) => (
              <Link
                key={lesson.title}
                href="/practice/conversation"
                className="w-full card flex items-center gap-4 hover:bg-surface-2 transition-all active:scale-[0.99]"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-card flex items-center justify-center">
                  <span className="material-symbols-rounded text-primary text-2xl">auto_stories</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-text-primary text-sm">{lesson.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge-surface text-[10px]">{lesson.topic}</span>
                    <span className="badge-surface text-[10px]">{lesson.difficulty}</span>
                    <span className="text-text-tertiary text-[10px]">{lesson.time}</span>
                  </div>
                </div>
                <span className="material-symbols-rounded text-text-tertiary text-lg">play_arrow</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
