'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard', icon: 'home', label: 'Home' },
  { href: '/practice', icon: 'mic', label: 'Practice' },
  { href: '/ai-tutor', icon: 'auto_awesome', label: 'AI Tutor' },
  { href: '/progress/overview', icon: 'trending_up', label: 'Progress' },
  { href: '/profile', icon: 'person', label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="bg-surface/95 backdrop-blur-xl border-t border-divider">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                <span className="material-symbols-rounded text-[26px]">
                  {item.icon}
                </span>
                <span className={`text-[10px] font-medium ${
                  isActive ? 'text-primary' : 'text-text-tertiary'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
