'use client'

import { useState } from 'react'
import { TopBar } from '@/components/shared/TopBar'
import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '30 min conversation per day',
      'Basic pronunciation feedback',
      'Grammar correction',
      '100 vocabulary words',
      '5 roleplay scenarios',
      '3 interview templates',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    description: 'For serious learners',
    features: [
      'Unlimited conversations',
      'Advanced pronunciation analysis',
      'Full grammar explanations',
      'Unlimited vocabulary',
      '50+ roleplay scenarios',
      '20+ interview templates',
      '10+ premium TTS voices',
      'Detailed progress analytics',
      'Offline mode',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Premium Plus',
    price: '$19.99',
    period: '/month',
    description: 'The ultimate learning experience',
    features: [
      'Everything in Premium',
      '1:1 AI coaching sessions',
      'Native language support',
      'Priority AI processing',
      'Export conversation history',
      'Advanced speech analytics',
      'Personalized training plan',
      'Early access to new features',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
]

export default function Subscription() {
  const router = useRouter()
  const [selected, setSelected] = useState('Free')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (plan: string) => {
    if (plan === 'Free') return
    setSelected(plan)
    setLoading(true)
    try {
      const res = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.toLowerCase().replace(' ', '-'), period: plan === 'Premium Plus' ? 'monthly' : 'monthly' }),
      })
      if (!res.ok) throw new Error('Checkout failed')
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        router.push('/dashboard')
      }
    } catch {
      router.push('/subscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Upgrade" showStreak={false} showXp={false} />

      <main className="px-5 space-y-6 animate-fade-in">
        <div className="text-center space-y-2 pt-2">
          <h1 className="heading-lg text-gradient-accent">Unlock Your Potential</h1>
          <p className="body-text">Get more speaking practice with premium features</p>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card relative ${
                plan.popular
                  ? 'border-primary/40 bg-gradient-card shadow-glow'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-[10px] font-bold px-4 py-1 rounded-pill">
                  MOST POPULAR
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="heading-sm text-text-primary">{plan.name}</h2>
                    <p className="text-xs text-text-secondary">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                    <span className="text-sm text-text-tertiary">{plan.period}</span>
                  </div>
                </div>

                <div className="divider" />

                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span className="material-symbols-rounded text-success text-sm mt-0.5">check</span>
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={loading || plan.name === 'Free'}
                  className={`w-full py-3.5 rounded-pill text-sm font-semibold transition-all ${
                    plan.name === 'Free'
                      ? 'bg-surface-2 text-text-primary border border-divider'
                      : 'bg-gradient-primary text-white shadow-glow hover:shadow-glow-lg active:scale-[0.98]'
                  }`}
                >
                  {loading && selected === plan.name ? 'Processing...' : plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-2 pb-4">
          <p className="text-xs text-text-tertiary">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
          <p className="text-xs text-text-tertiary">
            Premium features are optional upgrades. Core features remain free forever.
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="text-xs text-primary font-semibold hover:underline"
          >
            Manage Subscription
          </button>
        </div>
      </main>
    </div>
  )
}
