'use client'

import { TopBar } from '@/components/shared/TopBar'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useThemeContext } from '@/providers/ThemeProvider'
import { useSettingsStore } from '@/stores/settings.store'
import { useAuthStore } from '@/stores/auth.store'

const profileMenuItems = [
  { icon: 'card_membership', label: 'Subscription', href: '/subscription' },
  { icon: 'emoji_events', label: 'Achievements', href: '/profile/achievements' },
  { icon: 'leaderboard', label: 'Leaderboard', href: '/leaderboard' },
  { icon: 'bookmark', label: 'Bookmarks', href: '/vocabulary' },
  { icon: 'download', label: 'Downloads', href: '/profile/settings' },
  { icon: 'language', label: 'Language', href: '/profile/settings' },
  { icon: 'palette', label: 'Theme', href: '/profile/settings' },
  { icon: 'settings', label: 'Settings', href: '/profile/settings' },
]

export default function Profile() {
  const router = useRouter()
  const { mode } = useThemeContext()
  const settings = useSettingsStore()
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)

  const levelLabel = settings.learning.proficiencyLevel.charAt(0).toUpperCase() + settings.learning.proficiencyLevel.slice(1)

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Profile" showXp={false} showStreak={false} />

      <main className="px-5 space-y-6 animate-fade-in">
        <Link href="/profile/settings" className="card-premium flex flex-col items-center py-8 space-y-4 cursor-pointer active:scale-[0.99] transition-all">
          <div className="w-24 h-24 rounded-4xl bg-gradient-primary flex items-center justify-center shadow-glow-lg">
            <span className="material-symbols-rounded text-white text-5xl">person</span>
          </div>
          <div className="text-center">
            <h1 className="heading-sm text-white">{user?.name || 'Alex Johnson'}</h1>
            <p className="text-sm text-text-secondary">{user?.email || 'alex@example.com'}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="badge-primary">{levelLabel}</span>
              <span className="badge-primary">Level 8</span>
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            {[
              { label: 'XP', value: '1,280' },
              { label: 'Streak', value: '7 days' },
              { label: 'Sessions', value: '47' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </Link>

        <div className="card space-y-1">
          <h2 className="section-title mb-2">Menu</h2>
          {profileMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 py-3 hover:bg-surface-2 -mx-4 px-4 rounded-2xl transition-all"
            >
              <span className="material-symbols-rounded text-text-secondary text-xl">{item.icon}</span>
              <span className="flex-1 text-sm text-text-primary">{item.label}</span>
              <span className="material-symbols-rounded text-text-tertiary text-lg">chevron_right</span>
            </Link>
          ))}
        </div>

        <div className="card space-y-1">
          <h2 className="section-title mb-2">Support</h2>
          {[
            { icon: 'help', label: 'Help & FAQ', href: '#' },
            { icon: 'info', label: 'About', href: '#' },
            { icon: 'privacy_tip', label: 'Privacy Policy', href: '#' },
            { icon: 'description', label: 'Terms of Service', href: '#' },
            { icon: 'mail', label: 'Contact Support', href: '#' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {/* TODO: open modal or navigate */}}
              className="w-full flex items-center gap-3 py-3 hover:bg-surface-2 -mx-4 px-4 rounded-2xl transition-all"
            >
              <span className="material-symbols-rounded text-text-secondary text-xl">{item.icon}</span>
              <span className="flex-1 text-sm text-text-primary text-left">{item.label}</span>
              <span className="material-symbols-rounded text-text-tertiary text-lg">chevron_right</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 text-sm font-medium text-error hover:bg-error/5 rounded-2xl transition-all"
        >
          Sign Out
        </button>
      </main>
    </div>
  )
}
