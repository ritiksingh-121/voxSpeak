'use client'

import { useState } from 'react'
import { TopBar } from '@/components/shared/TopBar'

type Period = 'weekly' | 'monthly' | 'all'

const periods: { key: Period; label: string }[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'all', label: 'All Time' },
]

const leaderboardData: Record<Period, { name: string; xp: number; avatar: string; rank: number }[]> = {
  weekly: [
    { name: 'Sarah M.', xp: 2450, avatar: 'S', rank: 1 },
    { name: 'James L.', xp: 2180, avatar: 'J', rank: 2 },
    { name: 'Maria G.', xp: 1920, avatar: 'M', rank: 3 },
    { name: 'You', xp: 1850, avatar: 'A', rank: 4 },
    { name: 'David K.', xp: 1640, avatar: 'D', rank: 5 },
    { name: 'Emily R.', xp: 1520, avatar: 'E', rank: 6 },
    { name: 'Carlos P.', xp: 1430, avatar: 'C', rank: 7 },
    { name: 'Anna W.', xp: 1280, avatar: 'A', rank: 8 },
    { name: 'Tom H.', xp: 1150, avatar: 'T', rank: 9 },
    { name: 'Lisa N.', xp: 980, avatar: 'L', rank: 10 },
  ],
  monthly: [
    { name: 'Maria G.', xp: 8920, avatar: 'M', rank: 1 },
    { name: 'Sarah M.', xp: 8450, avatar: 'S', rank: 2 },
    { name: 'James L.', xp: 7810, avatar: 'J', rank: 3 },
    { name: 'You', xp: 6550, avatar: 'A', rank: 4 },
    { name: 'David K.', xp: 5940, avatar: 'D', rank: 5 },
  ],
  all: [
    { name: 'Sarah M.', xp: 28450, avatar: 'S', rank: 1 },
    { name: 'James L.', xp: 25180, avatar: 'J', rank: 2 },
    { name: 'Maria G.', xp: 22920, avatar: 'M', rank: 3 },
    { name: 'David K.', xp: 20640, avatar: 'D', rank: 4 },
    { name: 'You', xp: 18550, avatar: 'A', rank: 5 },
  ],
}

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32']

export default function Leaderboard() {
  const [period, setPeriod] = useState<Period>('weekly')
  const data = leaderboardData[period]

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Leaderboard" showStreak={false} showXp={false} />

      <main className="px-5 space-y-5 animate-fade-in">
        {/* Period Selector */}
        <div className="flex gap-2 bg-surface-2 rounded-2xl p-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                period === p.key
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Podium (Top 3) */}
        <div className="flex items-end justify-center gap-3 pt-4">
          {data.slice(0, 3).map((entry) => {
            const isUser = entry.name === 'You'
            const position = [2, 1, 3][entry.rank - 1] // Reorder: 2nd, 1st, 3rd
            const heights = ['h-28', 'h-36', 'h-24']

            return (
              <div key={entry.rank} className={`flex flex-col items-center gap-2 ${isUser ? '-mt-2' : ''}`}>
                {entry.rank === 1 && (
                  <span className="material-symbols-rounded text-2xl" style={{ color: medalColors[0] }}>emoji_events</span>
                )}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${
                  isUser
                    ? 'bg-gradient-primary text-white ring-2 ring-primary/50'
                    : 'bg-surface-2 text-text-primary'
                }`}>
                  {entry.avatar}
                </div>
                <p className={`text-xs font-semibold ${isUser ? 'text-primary' : 'text-text-primary'}`}>
                  {entry.name}
                </p>
                <p className="text-[10px] text-text-tertiary">{entry.xp.toLocaleString()} XP</p>
                <div className={`w-16 ${heights[entry.rank - 1]} rounded-t-2xl ${
                  entry.rank === 1 ? 'bg-gradient-primary' :
                  entry.rank === 2 ? 'bg-surface-3' : 'bg-surface-2'
                }`} style={{
                  boxShadow: entry.rank === 1 ? '0 -4px 20px rgba(255,122,0,0.3)' : 'none'
                }} />
              </div>
            )
          })}
        </div>

        {/* Rank List */}
        <div className="space-y-1">
          {data.slice(3).map((entry) => {
            const isUser = entry.name === 'You'
            return (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isUser
                    ? 'bg-gradient-card border border-primary/20'
                    : 'hover:bg-surface-2'
                }`}
              >
                <span className="w-6 text-center text-sm font-semibold text-text-tertiary">
                  {entry.rank}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isUser
                    ? 'bg-gradient-primary text-white'
                    : 'bg-surface-2 text-text-primary'
                }`}>
                  {entry.avatar}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isUser ? 'text-primary' : 'text-text-primary'}`}>
                    {entry.name}
                    {isUser && (
                      <span className="ml-2 text-[10px] text-primary/70">(You)</span>
                    )}
                  </p>
                </div>
                <p className="text-sm font-semibold text-text-secondary">
                  {entry.xp.toLocaleString()}
                </p>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
