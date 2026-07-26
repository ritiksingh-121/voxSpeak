'use client'

import { useState, useMemo } from 'react'
import { TopBar } from '@/components/shared/TopBar'
import { useVocabularyStore } from '@/stores/vocabulary.store'

const categories = [
  { label: 'All', key: 'all' as const },
  { label: 'Learning', key: 'learning' as const },
  { label: 'Reviewing', key: 'reviewing' as const },
  { label: 'Mastered', key: 'mastered' as const },
]

const difficultyColors: Record<string, string> = {
  easy: 'bg-success/15 text-success',
  medium: 'bg-primary/15 text-primary',
  hard: 'bg-error/15 text-error',
}

const statusColors: Record<string, string> = {
  new: 'bg-surface-3 text-text-secondary',
  learning: 'bg-primary/15 text-primary',
  reviewing: 'bg-accent/15 text-accent',
  mastered: 'bg-success/15 text-success',
}

export default function Vocabulary() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const words = useVocabularyStore((s) => s.words)
  const toggleStatus = useVocabularyStore((s) => s.toggleStatus)

  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      const matchesSearch = search === '' ||
        w.word.toLowerCase().includes(search.toLowerCase()) ||
        w.def.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'all' || w.status === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory, words])

  const stats = useMemo(() => ({
    total: words.length,
    learning: words.filter((w) => w.status === 'learning').length,
    mastered: words.filter((w) => w.status === 'mastered').length,
  }), [words])

  const categoryCounts = useMemo(() => ({
    all: words.length,
    learning: words.filter((w) => w.status === 'learning').length,
    reviewing: words.filter((w) => w.status === 'reviewing').length,
    mastered: words.filter((w) => w.status === 'mastered').length,
  }), [words])

  const selectedWordData = selectedWord ? words.find((w) => w.word === selectedWord) : null

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Vocabulary" />

      <main className="px-5 space-y-5 animate-fade-in">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-text-tertiary text-xl">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words..."
            className="input-field pl-12"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
            >
              <span className="material-symbols-rounded text-xl">close</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-primary' },
            { label: 'Learning', value: stats.learning, color: 'text-accent' },
            { label: 'Mastered', value: stats.mastered, color: 'text-success' },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 card text-center py-4">
              <p className={`heading-sm ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-text-tertiary">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 rounded-pill text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
              }`}
            >
              {cat.label} ({categoryCounts[cat.key]})
            </button>
          ))}
        </div>

        {/* Word List */}
        <div className="space-y-2">
          {filteredWords.length === 0 ? (
            <div className="card text-center py-8">
              <span className="material-symbols-rounded text-4xl text-text-tertiary mb-3 block">menu_book</span>
              <p className="text-text-secondary text-sm">No words found</p>
              {search && <p className="text-text-tertiary text-xs mt-1">Try a different search term</p>}
            </div>
          ) : (
            filteredWords.map((word) => (
              <div
                key={word.word}
                onClick={() => setSelectedWord(word.word === selectedWord ? null : word.word)}
                className="card hover:bg-surface-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-text-primary">{word.word}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-pill ${difficultyColors[word.difficulty]}`}>
                        {word.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{word.def}</p>
                    <p className="text-xs text-text-tertiary italic">&ldquo;{word.context}&rdquo;</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2.5 py-1 rounded-pill whitespace-nowrap ${statusColors[word.status]}`}>
                    {word.status}
                  </span>
                </div>

                {selectedWord === word.word && (
                  <div className="mt-4 pt-4 border-t border-divider space-y-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStatus(word.word) }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-surface-2 hover:bg-surface-3 transition-all text-sm text-text-primary"
                    >
                      <span className="material-symbols-rounded text-lg">autorenew</span>
                      Mark as {word.status === 'new' ? 'Learning' : word.status === 'learning' ? 'Reviewing' : word.status === 'reviewing' ? 'Mastered' : 'New'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
