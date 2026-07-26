'use client'

import { TopBar } from '@/components/shared/TopBar'
import { useRouter } from 'next/navigation'

const achievements = [
  {
    title: 'First Steps',
    desc: 'Complete your first conversation',
    icon: 'directions_walk',
    xp: 50,
    progress: 100,
    earned: true,
    rarity: 'common',
  },
  {
    title: 'Chatterbox',
    desc: 'Have 50 conversations',
    icon: 'forum',
    xp: 200,
    progress: 47,
    earned: false,
    rarity: 'rare',
  },
  {
    title: 'Streak Master',
    desc: 'Maintain a 7-day streak',
    icon: 'local_fire_department',
    xp: 150,
    progress: 100,
    earned: true,
    rarity: 'common',
  },
  {
    title: 'Word Collector',
    desc: 'Learn 100 vocabulary words',
    icon: 'dictionary',
    xp: 300,
    progress: 100,
    earned: true,
    rarity: 'rare',
  },
  {
    title: 'Perfect Pronunciation',
    desc: 'Score 90+ on pronunciation 10 times',
    icon: 'record_voice_over',
    xp: 500,
    progress: 40,
    earned: false,
    rarity: 'epic',
  },
  {
    title: 'Grammar Guru',
    desc: 'Complete 30 grammar exercises',
    icon: 'text_fields',
    xp: 250,
    progress: 66,
    earned: false,
    rarity: 'rare',
  },
  {
    title: 'Polyglot',
    desc: 'Practice 10 different roleplay scenarios',
    icon: 'theater_comedy',
    xp: 350,
    progress: 20,
    earned: false,
    rarity: 'epic',
  },
  {
    title: 'Interview Ace',
    desc: 'Complete 5 mock interviews',
    icon: 'work',
    xp: 400,
    progress: 60,
    earned: false,
    rarity: 'epic',
  },
  {
    title: 'Centurion',
    desc: 'Speak for 100 hours total',
    icon: 'timer',
    xp: 1000,
    progress: 9,
    earned: false,
    rarity: 'legendary',
  },
  {
    title: 'Dedicated Learner',
    desc: 'Log in for 30 consecutive days',
    icon: 'calendar_month',
    xp: 750,
    progress: 23,
    earned: false,
    rarity: 'legendary',
  },
]

const rarityStyles: Record<string, { bg: string; border: string; text: string }> = {
  common: {
    bg: 'bg-surface-2',
    border: 'border-divider',
    text: 'text-text-secondary',
  },
  rare: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
  },
  epic: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
  },
  legendary: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    text: 'text-primary',
  },
}

const rarityIcons: Record<string, string> = {
  common: 'circle',
  rare: 'diamond',
  epic: 'stars',
  legendary: 'auto_awesome',
}

export default function Achievements() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Achievements" showStreak={false} showXp={false} onBack={() => router.push('/profile')} />

      <main className="px-5 space-y-4 animate-fade-in">
        {/* Stats */}
        <div className="card-premium flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-white">8</p>
            <p className="text-xs text-text-secondary">of 10 unlocked</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">2,700</p>
            <p className="text-xs text-text-secondary">Total XP earned</p>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => {
            const style = rarityStyles[achievement.rarity]
            return (
              <div
                key={achievement.title}
                className={`card space-y-3 ${style.border} ${
                  !achievement.earned ? 'opacity-60' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl ${style.bg} flex items-center justify-center`}>
                  <span className={`material-symbols-rounded text-2xl ${style.text}`}>
                    {achievement.icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`material-symbols-rounded text-xs ${style.text}`}>
                      {rarityIcons[achievement.rarity]}
                    </span>
                    <p className="text-xs font-semibold text-text-primary">{achievement.title}</p>
                  </div>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{achievement.desc}</p>
                </div>
                <div className="space-y-1">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-text-tertiary">
                    <span>{achievement.progress}%</span>
                    <span>+{achievement.xp} XP</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
