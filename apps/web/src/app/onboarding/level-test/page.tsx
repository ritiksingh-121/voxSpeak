'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const levels = [
  { id: 'beginner', label: 'Beginner', icon: 'eco', desc: 'I know a few words', color: 'text-success' },
  { id: 'elementary', label: 'Elementary', icon: 'spa', desc: 'I can introduce myself', color: 'text-accent' },
  { id: 'intermediate', label: 'Intermediate', icon: 'forest', desc: 'I can hold conversations', color: 'text-primary' },
  { id: 'upper-intermediate', label: 'Upper Intermediate', icon: 'whatshot', desc: 'I can discuss complex topics', color: 'text-orange-400' },
  { id: 'advanced', label: 'Advanced', icon: 'rocket_launch', desc: 'I\'m nearly fluent', color: 'text-red-400' },
]

const interests = [
  { emoji: '🍔', label: 'Food', topic: 'food' },
  { emoji: '✈️', label: 'Travel', topic: 'travel' },
  { emoji: '💻', label: 'Technology', topic: 'technology' },
  { emoji: '🎵', label: 'Music', topic: 'music' },
  { emoji: '🎬', label: 'Movies', topic: 'movies' },
  { emoji: '📚', label: 'Books', topic: 'books' },
  { emoji: '⚽', label: 'Sports', topic: 'sports' },
  { emoji: '🏢', label: 'Business', topic: 'business' },
  { emoji: '🎓', label: 'Education', topic: 'education' },
  { emoji: '❤️', label: 'Health', topic: 'health' },
  { emoji: '🎮', label: 'Gaming', topic: 'gaming' },
  { emoji: '🎨', label: 'Art', topic: 'art' },
]

export default function LevelTest() {
  const router = useRouter()
  const [step, setStep] = useState<'level' | 'interests' | 'goals' | 'done'>('level')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const goals = [
    { id: 'conversation', label: 'Daily Conversation', icon: 'chat' },
    { id: 'interview', label: 'Job Interview', icon: 'work' },
    { id: 'business', label: 'Business English', icon: 'business' },
    { id: 'travel', label: 'Travel', icon: 'flight' },
    { id: 'exam', label: 'Exam Prep (IELTS/TOEFL)', icon: 'school' },
    { id: 'fluency', label: 'General Fluency', icon: 'auto_awesome' },
  ]

  const toggleInterest = (topic: string) => {
    setSelectedInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  const handleComplete = () => {
    localStorage.setItem('onboardingDone', 'true')
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-background flex flex-col px-6">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
          <div className="text-center space-y-4 animate-fade-down">
            <div className="w-28 h-28 rounded-4xl bg-gradient-primary mx-auto flex items-center justify-center shadow-glow-lg">
              <span className="material-symbols-rounded text-white text-6xl">auto_awesome</span>
            </div>
            <div className="space-y-2">
              <h1 className="heading-lg">You&apos;re All Set!</h1>
              <p className="body-text">We&apos;ve personalized your learning plan. Ready to start speaking?</p>
            </div>
          </div>
          <div className="space-y-4 animate-fade-up">
            <button onClick={() => router.replace('/signup')} className="btn-primary w-full">
              Create Account
            </button>
            <button onClick={() => router.replace('/login')} className="btn-secondary w-full">
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6">
      <div className="pt-12 pb-8 text-center space-y-2">
        {step === 'level' && (
          <>
            <h1 className="heading-md">What&apos;s your level?</h1>
            <p className="body-text">This helps me personalize your experience</p>
          </>
        )}
        {step === 'interests' && (
          <>
            <h1 className="heading-md">What interests you?</h1>
            <p className="body-text">Pick topics you&apos;d like to discuss</p>
          </>
        )}
        {step === 'goals' && (
          <>
            <h1 className="heading-md">What&apos;s your goal?</h1>
            <p className="body-text">I&apos;ll tailor lessons to your needs</p>
          </>
        )}
      </div>

      {step === 'level' && (
        <div className="flex-1 space-y-3 max-w-sm mx-auto w-full">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`w-full card flex items-center gap-4 transition-all active:scale-[0.99] ${
                selectedLevel === level.id
                  ? 'border-primary/50 bg-gradient-card'
                  : 'hover:bg-surface-2'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center`}>
                <span className={`material-symbols-rounded text-2xl ${level.color}`}>
                  {level.icon}
                </span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-text-primary">{level.label}</h3>
                <p className="text-xs text-text-secondary">{level.desc}</p>
              </div>
              {selectedLevel === level.id && (
                <span className="material-symbols-rounded text-primary">check_circle</span>
              )}
            </button>
          ))}
        </div>
      )}

      {step === 'interests' && (
        <div className="flex-1 max-w-sm mx-auto w-full">
          <div className="flex flex-wrap gap-2.5 justify-center">
            {interests.map((item) => (
              <button
                key={item.topic}
                onClick={() => toggleInterest(item.topic)}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  selectedInterests.includes(item.topic)
                    ? 'bg-gradient-primary text-white shadow-glow'
                    : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                }`}
              >
                <span className="mr-1.5">{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'goals' && (
        <div className="flex-1 space-y-3 max-w-sm mx-auto w-full">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`w-full card flex items-center gap-4 transition-all active:scale-[0.99] ${
                selectedGoals.includes(goal.id)
                  ? 'border-primary/50 bg-gradient-card'
                  : 'hover:bg-surface-2'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center">
                <span className="material-symbols-rounded text-primary text-2xl">{goal.icon}</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-text-primary">{goal.label}</h3>
              </div>
              {selectedGoals.includes(goal.id) && (
                <span className="material-symbols-rounded text-primary">check_circle</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="pb-12 space-y-3 max-w-sm mx-auto w-full pt-6">
        <button
          onClick={() => {
            if (step === 'level') setStep('interests')
            else if (step === 'interests') setStep('goals')
            else handleComplete()
          }}
          disabled={
            (step === 'level' && !selectedLevel) ||
            (step === 'interests' && selectedInterests.length === 0) ||
            (step === 'goals' && selectedGoals.length === 0)
          }
          className="btn-primary w-full"
        >
          {step === 'goals' ? 'Start Speaking' : 'Continue'}
        </button>
        <button
          onClick={() => {
            if (step === 'interests') setStep('level')
            else if (step === 'goals') setStep('interests')
          }}
          className="btn-ghost w-full text-center"
          style={{ visibility: step === 'level' ? 'hidden' : 'visible' }}
        >
          Back
        </button>
      </div>
    </div>
  )
}
