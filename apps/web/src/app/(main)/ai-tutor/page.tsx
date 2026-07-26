'use client'

import { useState } from 'react'
import { TopBar } from '@/components/shared/TopBar'
import { useRouter } from 'next/navigation'

const suggestions = [
  'Explain present perfect tense',
  'Help me with business vocabulary',
  'Correct my pronunciation',
  'Practice job interview',
  'Improve my writing',
]

export default function AiTutor() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMsg }] }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content || data.error || 'No response' }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I had an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      <TopBar title="AI Tutor" />

      <main className="flex-1 px-5 space-y-4 animate-fade-in flex flex-col">
        <p className="body-text">Ask me anything about English!</p>

        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
            <div className="w-20 h-20 rounded-4xl bg-gradient-card flex items-center justify-center">
              <span className="material-symbols-rounded text-primary text-4xl">auto_awesome</span>
            </div>
            <p className="text-text-tertiary text-sm text-center max-w-xs">
              Ask me about grammar, vocabulary, pronunciation, or anything you want to learn
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s) }}
                  className="px-4 py-2 rounded-pill bg-surface-2 text-xs text-text-secondary hover:bg-surface-3 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="flex-1 space-y-3 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-primary text-white'
                    : 'bg-surface-2 text-text-primary'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface-2 px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask something..."
            className="input-field flex-1"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow disabled:opacity-50 transition-all active:scale-95"
          >
            <span className="material-symbols-rounded text-white">send</span>
          </button>
        </div>
      </main>
    </div>
  )
}
