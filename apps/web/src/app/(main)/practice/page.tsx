'use client'

import { TopBar } from '@/components/shared/TopBar'
import Link from 'next/link'

const practiceModes = [
  {
    id: 'free',
    title: 'Free Conversation',
    description: 'Talk about anything. The AI adapts to your interests and level.',
    icon: 'question_answer',
    color: 'from-primary to-accent',
    gradient: 'bg-gradient-card',
    time: '5-30 min',
    difficulty: 'All levels',
    href: '/practice/conversation',
  },
  {
    id: 'lesson',
    title: 'AI Lesson',
    description: 'Personalized lessons generated just for you based on your weak areas.',
    icon: 'school',
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-purple-500/10',
    time: '10-20 min',
    difficulty: 'Adaptive',
    href: '/practice/lesson',
  },
  {
    id: 'roleplay',
    title: 'Roleplay',
    description: 'Practice real-world scenarios like ordering food, checking into a hotel, or making friends.',
    icon: 'theater_comedy',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-blue-500/10',
    time: '5-15 min',
    difficulty: 'Beginner+',
    href: '/practice/roleplay',
  },
  {
    id: 'interview',
    title: 'Interview Coach',
    description: 'Practice job interviews with realistic questions and personalized feedback.',
    icon: 'work',
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-green-500/10',
    time: '15-30 min',
    difficulty: 'Intermediate+',
    href: '/practice/interview',
  },
  {
    id: 'shadowing',
    title: 'Shadowing',
    description: 'Listen and repeat to improve pronunciation, intonation, and rhythm.',
    icon: 'hearing',
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-amber-500/10',
    time: '5-10 min',
    difficulty: 'All levels',
    href: '/practice/shadowing',
  },
  {
    id: 'debate',
    title: 'Debate Mode',
    description: 'Argue your point of view on interesting topics. Great for advanced learners.',
    icon: 'swords',
    color: 'from-red-500 to-rose-500',
    gradient: 'bg-red-500/10',
    time: '10-20 min',
    difficulty: 'Advanced',
    href: '/practice/debate',
  },
]

export default function Practice() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Practice" />

      <main className="px-5 space-y-4 animate-fade-in">
        <p className="body-text">Choose your practice mode</p>

        {practiceModes.map((mode, idx) => (
          <Link
            key={mode.id}
            href={mode.href}
            className={`card flex items-start gap-4 transition-all active:scale-[0.99] 
                        hover:bg-surface-2 block animate-fade-up`}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className={`w-14 h-14 rounded-3xl ${mode.gradient} flex items-center justify-center flex-shrink-0`}>
              <span className={`material-symbols-rounded text-2xl bg-gradient-to-br ${mode.color} bg-clip-text text-transparent`}>
                {mode.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary">{mode.title}</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{mode.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge-surface text-[10px]">{mode.time}</span>
                <span className="badge-surface text-[10px]">{mode.difficulty}</span>
              </div>
            </div>
            <span className="material-symbols-rounded text-text-tertiary mt-1">chevron_right</span>
          </Link>
        ))}
      </main>
    </div>
  )
}
