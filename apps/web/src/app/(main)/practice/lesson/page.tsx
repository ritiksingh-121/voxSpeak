'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/shared/TopBar'
import { CircularProgress } from '@/components/shared/CircularProgress'

const lessonTopics = [
  { emoji: '📖', title: 'Past Tense Stories', desc: 'Practice telling stories in the past tense', level: 'Intermediate', duration: '10 min' },
  { emoji: '🗣️', title: 'Th Sound Mastery', desc: 'Perfect your pronunciation of th sounds', level: 'All Levels', duration: '8 min' },
  { emoji: '📞', title: 'Phone Conversations', desc: 'Learn phone etiquette and phrases', level: 'Intermediate', duration: '12 min' },
  { emoji: '✍️', title: 'Email Writing', desc: 'Practice formal and informal emails', level: 'Advanced', duration: '15 min' },
  { emoji: '🎯', title: 'Phrasal Verbs', desc: 'Common phrasal verbs for daily use', level: 'Intermediate', duration: '10 min' },
  { emoji: '🤝', title: 'Small Talk Skills', desc: 'Master casual conversation openers', level: 'Beginner', duration: '8 min' },
  { emoji: '📊', title: 'Presentation Skills', desc: 'Practice giving presentations confidently', level: 'Advanced', duration: '15 min' },
  { emoji: '🎭', title: 'Expressing Opinions', desc: 'Learn to agree, disagree, and debate', level: 'Upper Intermediate', duration: '12 min' },
]

export default function Lesson() {
  const router = useRouter()
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)

  if (selectedLesson) {
    const lesson = lessonTopics.find((l) => l.title === selectedLesson)!
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopBar title={lesson.title} showStreak={false} showXp={false} />
        <div className="px-5 space-y-6 animate-fade-in">
          {/* Lesson Header */}
          <div className="card-premium text-center py-10 space-y-4">
            <span className="text-7xl">{lesson.emoji}</span>
            <div>
              <h2 className="heading-md text-white">{lesson.title}</h2>
              <p className="text-text-secondary mt-1">{lesson.desc}</p>
            </div>
            <div className="flex justify-center gap-3">
              <span className="badge-primary">{lesson.level}</span>
              <span className="badge-primary">{lesson.duration}</span>
            </div>
          </div>

          {/* Lesson Progress */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">Lesson Progress</h3>
              <span className="text-sm text-primary font-semibold">0 / 4</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '0%' }} />
            </div>
          </div>

          {/* Lesson Steps Preview */}
          <div className="space-y-3">
            <h3 className="section-title">Lesson Steps</h3>
            {[
              { num: 1, title: 'Introduction', desc: 'Learn key vocabulary and phrases' },
              { num: 2, title: 'Practice', desc: 'Guided speaking exercise' },
              { num: 3, title: 'Conversation', desc: 'Free-form practice with AI' },
              { num: 4, title: 'Review', desc: 'Feedback and corrections' },
            ].map((step) => (
              <div key={step.num} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center">
                  <span className="text-sm font-bold text-text-secondary">{step.num}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{step.title}</p>
                  <p className="text-xs text-text-tertiary">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => router.push('/practice/conversation?topic=lesson')} className="btn-primary w-full">Start Lesson</button>
          <button onClick={() => setSelectedLesson(null)} className="btn-ghost w-full">
            Browse Other Lessons
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="AI Lessons" showStreak={false} showXp={false} />

      <main className="px-5 space-y-4 animate-fade-in">
        {/* AI Recommendation */}
        <div className="card-premium flex items-center gap-4">
          <CircularProgress progress={72} size={60} strokeWidth={4} label="match" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Recommended for you</p>
            <p className="text-xs text-text-secondary">
              Based on your weak areas
            </p>
          </div>
          <span className="material-symbols-rounded text-primary">auto_awesome</span>
        </div>

        <div className="space-y-3">
          {lessonTopics.map((lesson) => (
            <button
              key={lesson.title}
              onClick={() => setSelectedLesson(lesson.title)}
              className="w-full card flex items-center gap-4 text-left transition-all active:scale-[0.99] hover:bg-surface-2"
            >
              <span className="text-3xl w-12 text-center">{lesson.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary text-sm">{lesson.title}</h3>
                <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{lesson.desc}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="badge-surface text-[10px]">{lesson.level}</span>
                  <span className="badge-surface text-[10px]">{lesson.duration}</span>
                </div>
              </div>
              <span className="material-symbols-rounded text-text-tertiary">play_arrow</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
