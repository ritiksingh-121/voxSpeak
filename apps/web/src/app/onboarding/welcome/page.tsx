'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  {
    title: 'Welcome to VoxSpeak',
    subtitle: 'Your personal AI English coach',
    description: 'Practice speaking English naturally with an AI that adapts to your level, remembers your progress, and helps you improve every day.',
    icon: 'record_voice_over',
  },
  {
    title: 'Speak Naturally',
    subtitle: 'Real conversations, real progress',
    description: 'Have unlimited voice conversations. Get instant feedback on pronunciation, grammar, and vocabulary.',
    icon: 'chat',
  },
  {
    title: 'Track Your Growth',
    subtitle: 'See yourself improve',
    description: 'Watch your speaking skills grow with detailed analytics, personalized lessons, and smart recommendations.',
    icon: 'trending_up',
  },
]

export default function OnboardingWelcome() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const current = steps[step]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      localStorage.setItem('onboardingDone', 'true')
      router.replace('/onboarding/level-test')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6">
      <div className="flex justify-center gap-2 pt-12">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === step
                ? 'w-8 bg-gradient-primary'
                : idx < step
                  ? 'w-2 bg-primary/50'
                  : 'w-2 bg-divider'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 max-w-sm mx-auto">
        <div className="w-32 h-32 rounded-4xl bg-gradient-card flex items-center justify-center animate-scale-in shadow-soft-xl">
          <span className="material-symbols-rounded text-primary text-6xl">
            {current.icon}
          </span>
        </div>

        <div className="space-y-3 animate-fade-up" key={step}>
          <p className="text-sm font-semibold text-primary tracking-wide uppercase">
            {current.subtitle}
          </p>
          <h1 className="heading-lg">{current.title}</h1>
          <p className="body-text leading-relaxed">{current.description}</p>
        </div>
      </div>

      <div className="pb-12 space-y-3 max-w-sm mx-auto w-full">
        <button onClick={handleNext} className="btn-primary w-full">
          {step < steps.length - 1 ? 'Continue' : 'Get Started'}
        </button>
        {step < steps.length - 1 && (
          <button onClick={() => {
            localStorage.setItem('onboardingDone', 'true')
            router.replace('/onboarding/level-test')
          }} className="btn-ghost w-full text-center">
            Skip
          </button>
        )}
        {step === 0 && (
          <p className="text-center text-xs text-text-tertiary pt-4">
            Already have an account?{' '}
            <button onClick={() => router.replace('/login')} className="text-primary font-semibold">
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
