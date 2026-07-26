'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/shared/TopBar'

const industries = [
  { id: 'tech', label: 'Technology', icon: 'laptop' },
  { id: 'finance', label: 'Finance', icon: 'account_balance' },
  { id: 'healthcare', label: 'Healthcare', icon: 'local_hospital' },
  { id: 'education', label: 'Education', icon: 'school' },
  { id: 'retail', label: 'Retail', icon: 'storefront' },
  { id: 'consulting', label: 'Consulting', icon: 'business' },
]

const experienceLevels = [
  { id: 'entry', label: 'Entry Level', years: '0-2 years' },
  { id: 'mid', label: 'Mid Level', years: '3-5 years' },
  { id: 'senior', label: 'Senior', years: '6-10 years' },
  { id: 'lead', label: 'Lead/Manager', years: '10+ years' },
]

const questionTypes = [
  { id: 'behavioral', label: 'Behavioral', icon: 'diversity_3', desc: 'Tell me about a time when...' },
  { id: 'technical', label: 'Technical', icon: 'code', desc: 'Technical skills and knowledge' },
  { id: 'situational', label: 'Situational', icon: 'psychology', desc: 'How would you handle...' },
  { id: 'general', label: 'General', icon: 'question_answer', desc: 'Tell me about yourself' },
]

export default function Interview() {
  const router = useRouter()
  const [step, setStep] = useState<'setup' | 'ready'>('setup')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const toggleType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  if (step === 'ready') {
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopBar title="Interview Coach" showStreak={false} showXp={false} />
        <div className="px-5 space-y-6 animate-fade-in">
          <div className="card-premium text-center py-10 space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-white/10 mx-auto flex items-center justify-center">
              <span className="material-symbols-rounded text-white text-4xl">work</span>
            </div>
            <div>
              <h2 className="heading-md text-white">Interview Ready</h2>
              <p className="text-text-secondary mt-1">
                I&apos;ll ask you real interview questions and give you feedback
              </p>
            </div>
          </div>

          <div className="card space-y-3">
            <h3 className="font-semibold text-text-primary">Session Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Industry</span>
                <span className="text-text-primary font-medium">Technology</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Level</span>
                <span className="text-text-primary font-medium">Mid Level (3-5 years)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Questions</span>
                <span className="text-text-primary font-medium">Behavioral + General</span>
              </div>
            </div>
          </div>

          <div className="card space-y-3">
            <h3 className="font-semibold text-text-primary">Tips</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="material-symbols-rounded text-success text-sm">check</span>
                Use the STAR method (Situation, Task, Action, Result)
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-rounded text-success text-sm">check</span>
                Speak confidently, take your time
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-rounded text-success text-sm">check</span>
                I&apos;ll give you feedback after each answer
              </li>
            </ul>
          </div>

          <button onClick={() => router.push('/practice/conversation?topic=interview')} className="btn-primary w-full">Start Interview</button>
          <button onClick={() => setStep('setup')} className="btn-ghost w-full">Change Settings</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Interview Coach" showStreak={false} showXp={false} />

      <main className="px-5 space-y-6 animate-fade-in">
        <p className="body-text">Configure your interview practice</p>

        {/* Industry */}
        <div className="space-y-3">
          <h2 className="section-title">Industry</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {industries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl transition-all ${
                  selectedIndustry === ind.id
                    ? 'bg-gradient-card border border-primary/30'
                    : 'bg-surface-2 hover:bg-surface-3 border border-transparent'
                }`}
              >
                <span className={`material-symbols-rounded text-2xl ${
                  selectedIndustry === ind.id ? 'text-primary' : 'text-text-secondary'
                }`}>{ind.icon}</span>
                <span className={`text-xs font-medium ${
                  selectedIndustry === ind.id ? 'text-primary' : 'text-text-secondary'
                }`}>{ind.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-3">
          <h2 className="section-title">Experience Level</h2>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                  selectedLevel === level.id
                    ? 'bg-gradient-card border border-primary/30'
                    : 'bg-surface-2 hover:bg-surface-3 border border-transparent'
                }`}
              >
                <span className={`text-sm font-medium ${
                  selectedLevel === level.id ? 'text-primary' : 'text-text-primary'
                }`}>{level.label}</span>
                <span className="text-xs text-text-tertiary">{level.years}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Types */}
        <div className="space-y-3">
          <h2 className="section-title">Question Types</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {questionTypes.map((qt) => (
              <button
                key={qt.id}
                onClick={() => toggleType(qt.id)}
                className={`flex flex-col items-center text-center gap-2 py-4 px-3 rounded-2xl transition-all ${
                  selectedTypes.includes(qt.id)
                    ? 'bg-gradient-card border border-primary/30'
                    : 'bg-surface-2 hover:bg-surface-3 border border-transparent'
                }`}
              >
                <span className={`material-symbols-rounded text-2xl ${
                  selectedTypes.includes(qt.id) ? 'text-primary' : 'text-text-secondary'
                }`}>{qt.icon}</span>
                <span className={`text-xs font-medium ${
                  selectedTypes.includes(qt.id) ? 'text-primary' : 'text-text-primary'
                }`}>{qt.label}</span>
                <span className="text-[10px] text-text-tertiary">{qt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setStep('ready')}
          disabled={!selectedIndustry || !selectedLevel || selectedTypes.length === 0}
          className="btn-primary w-full"
        >
          Continue
        </button>
      </main>
    </div>
  )
}
