'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/shared/TopBar'

const scenarios = [
  {
    emoji: '☕',
    title: 'Ordering Coffee',
    desc: 'Practice ordering at a coffee shop',
    difficulty: 'Beginner',
    duration: '5 min',
    setting: 'Cafe in New York',
  },
  {
    emoji: '🏨',
    title: 'Hotel Check-in',
    desc: 'Check into a hotel and ask about amenities',
    difficulty: 'Beginner',
    duration: '5 min',
    setting: 'Grand Hotel, London',
  },
  {
    emoji: '🍽️',
    title: 'Restaurant Booking',
    desc: 'Make a reservation and order food',
    difficulty: 'Beginner',
    duration: '8 min',
    setting: 'Italian Restaurant',
  },
  {
    emoji: '🏥',
    title: 'Doctor Visit',
    desc: 'Describe symptoms and get advice',
    difficulty: 'Intermediate',
    duration: '10 min',
    setting: 'Medical Clinic',
  },
  {
    emoji: '✈️',
    title: 'Airport Check-in',
    desc: 'Check in for a flight and go through security',
    difficulty: 'Intermediate',
    duration: '8 min',
    setting: 'International Airport',
  },
  {
    emoji: '👔',
    title: 'Networking Event',
    desc: 'Introduce yourself and make small talk',
    difficulty: 'Intermediate',
    duration: '10 min',
    setting: 'Business Conference',
  },
  {
    emoji: '🏦',
    title: 'Bank Account',
    desc: 'Open a bank account and ask about services',
    difficulty: 'Intermediate',
    duration: '8 min',
    setting: 'City Bank',
  },
  {
    emoji: '📞',
    title: 'Customer Service',
    desc: 'Make a complaint and resolve an issue',
    difficulty: 'Advanced',
    duration: '10 min',
    setting: 'Call Center',
  },
]

export default function Roleplay() {
  const router = useRouter()
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)

  if (selectedScenario) {
    const scenario = scenarios.find((s) => s.title === selectedScenario)!
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopBar
          title={scenario.title}
          showStreak={false}
          showXp={false}
        />
        <div className="px-5 space-y-6 animate-fade-in">
          <div className="card-premium text-center py-10 space-y-4">
            <span className="text-8xl">{scenario.emoji}</span>
            <div>
              <h2 className="heading-md text-white">{scenario.title}</h2>
              <p className="text-text-secondary mt-1">{scenario.desc}</p>
              <p className="text-sm text-text-tertiary mt-1">📍 {scenario.setting}</p>
            </div>
            <div className="flex justify-center gap-3">
              <span className="badge-primary">{scenario.difficulty}</span>
              <span className="badge-primary">{scenario.duration}</span>
            </div>
          </div>

          <div className="card space-y-3">
            <h3 className="font-semibold text-text-primary">Scenario Context</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              You are at {scenario.setting.toLowerCase()}. The AI will play the role of the person you&apos;re interacting with.
              Try to stay in character and use appropriate language for the situation.
            </p>
          </div>

          <div className="card space-y-3">
            <h3 className="font-semibold text-text-primary">Tips</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="material-symbols-rounded text-success text-sm">check</span>
                Use polite phrases like &quot;Excuse me&quot; and &quot;Thank you&quot;
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-rounded text-success text-sm">check</span>
                Speak clearly and at a natural pace
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-rounded text-success text-sm">check</span>
                Ask follow-up questions to extend the conversation
              </li>
            </ul>
          </div>

          <button
            onClick={() => router.push(`/practice/conversation?topic=${encodeURIComponent(scenario.title.toLowerCase())}`)}
            className="btn-primary w-full"
          >
            Start Roleplay
          </button>

          <button
            onClick={() => setSelectedScenario(null)}
            className="btn-ghost w-full"
          >
            Choose Another Scenario
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Roleplay" showStreak={false} showXp={false} />

      <main className="px-5 space-y-4 animate-fade-in">
        <p className="body-text">Choose a scenario to practice</p>

        <div className="space-y-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.title}
              onClick={() => setSelectedScenario(scenario.title)}
              className="w-full card flex items-center gap-4 text-left transition-all active:scale-[0.99] hover:bg-surface-2"
            >
              <span className="text-3xl w-12 text-center">{scenario.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary text-sm">{scenario.title}</h3>
                <p className="text-xs text-text-secondary mt-0.5">{scenario.desc}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="badge-surface text-[10px]">{scenario.difficulty}</span>
                  <span className="badge-surface text-[10px]">{scenario.duration}</span>
                </div>
              </div>
              <span className="material-symbols-rounded text-text-tertiary">chevron_right</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
