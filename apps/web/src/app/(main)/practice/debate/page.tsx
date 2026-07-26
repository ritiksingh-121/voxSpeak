'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/shared/TopBar'

const debateTopics = [
  { title: 'AI: Friend or Foe?', stance: 'AI will benefit humanity', difficulty: 'Advanced' },
  { title: 'Remote Work Forever', stance: 'Remote work is better than office', difficulty: 'Intermediate' },
  { title: 'Social Media Impact', stance: 'Social media does more harm than good', difficulty: 'Intermediate' },
  { title: 'Universal Basic Income', stance: 'UBI should be implemented globally', difficulty: 'Advanced' },
  { title: 'Space Exploration', stance: 'We should prioritize space exploration', difficulty: 'Advanced' },
  { title: 'Education Reform', stance: 'Traditional education is outdated', difficulty: 'Intermediate' },
]

export default function Debate() {
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  if (selectedTopic) {
    const topic = debateTopics.find((t) => t.title === selectedTopic)!
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopBar title="Debate Mode" showStreak={false} showXp={false} />
        <div className="px-5 space-y-6 animate-fade-in">
          <div className="card-premium text-center py-10 space-y-4">
            <span className="material-symbols-rounded text-white text-5xl">swords</span>
            <div>
              <h2 className="heading-md text-white">{topic.title}</h2>
              <p className="text-text-secondary mt-2 text-sm">Your position:</p>
              <p className="text-accent font-semibold">&ldquo;{topic.stance}&rdquo;</p>
            </div>
            <span className="badge-primary">{topic.difficulty}</span>
          </div>

          <div className="card space-y-3">
            <h3 className="font-semibold text-text-primary">How It Works</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="material-symbols-rounded text-primary text-sm">1</span>
                You&apos;ll present your argument for this position
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-rounded text-primary text-sm">2</span>
                The AI will counter-argue as the opposition
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-rounded text-primary text-sm">3</span>
                You get feedback on persuasion and vocabulary
              </li>
            </ul>
          </div>

          <button onClick={() => router.push('/practice/conversation?topic=debate')} className="btn-primary w-full">Start Debate</button>
          <button onClick={() => setSelectedTopic(null)} className="btn-ghost w-full">
            Choose Another Topic
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Debate Mode" showStreak={false} showXp={false} />

      <main className="px-5 space-y-4 animate-fade-in">
        <p className="body-text">Choose a topic to debate with AI</p>

        <div className="space-y-3">
          {debateTopics.map((topic) => (
            <button
              key={topic.title}
              onClick={() => setSelectedTopic(topic.title)}
              className="w-full card hover:bg-surface-2 transition-all active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-rounded text-primary">swords</span>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-text-primary text-sm">{topic.title}</h3>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-1">{topic.stance}</p>
                  <span className="badge-surface text-[10px] mt-1.5 inline-block">{topic.difficulty}</span>
                </div>
                <span className="material-symbols-rounded text-text-tertiary">chevron_right</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
