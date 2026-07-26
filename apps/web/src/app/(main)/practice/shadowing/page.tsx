'use client'

import { useState } from 'react'
import { TopBar } from '@/components/shared/TopBar'
import { WaveformAnimation } from '@/components/shared/WaveformAnimation'

export default function Shadowing() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Shadowing" showStreak={false} showXp={false} />

      <main className="px-5 space-y-8 animate-fade-in">
        <div className="card-premium text-center py-8 space-y-3">
          <span className="material-symbols-rounded text-white text-5xl">hearing</span>
          <h2 className="heading-md text-white">Listen & Repeat</h2>
          <p className="text-text-secondary text-sm">Listen to the sentence, then repeat it exactly</p>
        </div>

        <div className="card space-y-6 py-8">
          {/* Target Sentence */}
          <div className="text-center space-y-2">
            <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">Listen</p>
            <p className="text-lg font-medium text-text-primary leading-relaxed px-4">
              &ldquo;The weather is beautiful today, isn&apos;t it?&rdquo;
            </p>
          </div>

          {/* Play Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow-lg active:scale-95 transition-all"
            >
              <span className="material-symbols-rounded text-white text-3xl">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>

          {isPlaying && <WaveformAnimation isActive={true} />}

          <div className="divider" />

          {/* Record */}
          <div className="text-center space-y-4">
            <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">Now Repeat</p>

            <button
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              onTouchStart={() => setIsRecording(true)}
              onTouchEnd={() => setIsRecording(false)}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${
                isRecording
                  ? 'bg-error scale-110 shadow-glow-lg'
                  : 'bg-surface-2 hover:bg-surface-3 border-2 border-primary/30'
              }`}
            >
              <span className="material-symbols-rounded text-3xl text-text-primary">
                {isRecording ? 'stop' : 'mic'}
              </span>
            </button>

            <p className="text-xs text-text-tertiary">
              {isRecording ? 'Recording... Release to stop' : 'Hold to record'}
            </p>
          </div>

          {isRecording && <WaveformAnimation isActive={true} color="#22C55E" />}
        </div>

        <div className="card space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Tips</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="material-symbols-rounded text-primary text-sm">volume_up</span>
              Focus on the intonation and rhythm
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-rounded text-primary text-sm">hearing</span>
              Listen to the full sentence before repeating
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-rounded text-primary text-sm">mic</span>
              Try to match the speaker&apos;s exact pronunciation
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
