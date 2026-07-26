'use client'

import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/shared/TopBar'
import { useProgressStore } from '@/stores/progress.store'

const grammarTopics = [
  { topic: 'Present Perfect', score: 38, status: 'weak' },
  { topic: 'Conditionals', score: 45, status: 'weak' },
  { topic: 'Passive Voice', score: 55, status: 'weak' },
  { topic: 'Reported Speech', score: 62, status: 'fair' },
  { topic: 'Relative Clauses', score: 70, status: 'fair' },
  { topic: 'Articles (a/an/the)', score: 78, status: 'good' },
  { topic: 'Prepositions', score: 72, status: 'fair' },
  { topic: 'Phrasal Verbs', score: 52, status: 'weak' },
  { topic: 'Verb Tenses', score: 68, status: 'fair' },
  { topic: 'Subject-Verb Agreement', score: 85, status: 'good' },
]

export default function GrammarProgress() {
  const router = useRouter()
  const { grammarScore } = useProgressStore()

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Grammar" />

      <main className="px-5 space-y-6 animate-fade-in">
        {/* Overall Score */}
        <div className="card-premium text-center py-8 space-y-3">
          <p className="text-5xl font-bold text-white">{grammarScore}</p>
          <p className="text-sm text-text-secondary">Average Grammar Score</p>
          <div className="flex justify-center gap-4 text-xs">
            <span className="text-success">↑ 3% this week</span>
            <span className="text-text-tertiary">Last 30 days</span>
          </div>
        </div>

        {/* Grammar Topics */}
        <div className="card space-y-4">
          <h2 className="section-title">Grammar Topics</h2>
          {grammarTopics.map((item) => (
            <div key={item.topic} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-primary">{item.topic}</span>
                  <span className={`font-semibold ${
                    item.score >= 80 ? 'text-success' :
                    item.score >= 60 ? 'text-accent' : 'text-error'
                  }`}>{item.score}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.score}%`,
                      background: item.score >= 80
                        ? 'linear-gradient(135deg, #22C55E, #4ADE80)'
                        : item.score >= 60
                          ? 'linear-gradient(135deg, #FFC857, #FFD980)'
                          : 'linear-gradient(135deg, #EF4444, #F87171)',
                    }}
                  />
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-pill capitalize ${
                item.status === 'weak' ? 'bg-error/15 text-error' :
                item.status === 'fair' ? 'bg-accent/15 text-accent' :
                'bg-success/15 text-success'
              }`}>{item.status}</span>
            </div>
          ))}
        </div>

        {/* Practice Recommendations */}
        <div className="card space-y-3">
          <h2 className="section-title">Practice These</h2>
          {[
            { topic: 'Present Perfect Tense', tip: 'Use "have/has + past participle" for past actions with present relevance', icon: 'psychology' },
            { topic: 'Conditional Sentences', tip: 'If + present, will + base verb for real conditions', icon: 'tips_and_updates' },
          ].map((item) => (
            <div key={item.topic} className="bg-surface-2 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-primary text-lg">{item.icon}</span>
                <h3 className="text-sm font-semibold text-text-primary">{item.topic}</h3>
              </div>
              <p className="text-xs text-text-secondary">{item.tip}</p>
              <button
                onClick={() => router.push('/practice/lesson')}
                className="text-xs text-primary font-semibold"
              >
                Practice Now →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
