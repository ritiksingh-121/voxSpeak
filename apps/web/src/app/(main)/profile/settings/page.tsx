'use client'

import { useState } from 'react'
import { TopBar } from '@/components/shared/TopBar'
import { useRouter } from 'next/navigation'
import { useThemeContext } from '@/providers/ThemeProvider'
import { useSettingsStore, AiVoice, NativeLanguage, ProficiencyLevel, SpeechSpeed, VoiceVolume, DailyGoal } from '@/stores/settings.store'

const languages: { value: NativeLanguage; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'russian', label: 'Russian' },
]

const levels: { value: ProficiencyLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner (A1-A2)' },
  { value: 'intermediate', label: 'Intermediate (B1-B2)' },
  { value: 'advanced', label: 'Advanced (C1-C2)' },
]

const goals: { value: DailyGoal; label: string }[] = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
]

const voices: { value: AiVoice; label: string }[] = [
  { value: 'american-female', label: 'American Female' },
  { value: 'american-male', label: 'American Male' },
  { value: 'british-female', label: 'British Female' },
  { value: 'british-male', label: 'British Male' },
  { value: 'australian-female', label: 'Australian Female' },
]

const speeds: { value: SpeechSpeed; label: string }[] = [
  { value: 0.5, label: 'Slow (0.5x)' },
  { value: 0.75, label: 'Reduced (0.75x)' },
  { value: 1.0, label: 'Normal (1.0x)' },
  { value: 1.25, label: 'Fast (1.25x)' },
  { value: 1.5, label: 'Very Fast (1.5x)' },
]

const volumes: { value: VoiceVolume; label: string }[] = [
  { value: 25, label: '25%' },
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 80, label: '80%' },
  { value: 100, label: '100%' },
]

const microphones = ['Default', 'Built-in', 'Headset', 'External']

interface SelectOption<T> {
  value: T
  label: string
}

function SettingsSelect<T extends string | number>({ options, value, onChange, label }: { options: SelectOption<T>[]; value: T; onChange: (v: T) => void; label: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 py-3 -mx-4 px-4 rounded-2xl hover:bg-surface-2 transition-all"
      >
        <div className="flex-1 text-left">
          <p className="text-xs text-text-tertiary">{label}</p>
          <p className="text-sm text-text-primary">{options.find((o) => o.value === value)?.label || String(value)}</p>
        </div>
        <span className="material-symbols-rounded text-text-tertiary text-lg">{open ? 'expand_less' : 'expand_more'}</span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-surface border border-divider rounded-2xl shadow-soft-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={String(option.value)}
              onClick={() => { onChange(option.value); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-surface-2 ${
                option.value === value ? 'text-primary font-semibold' : 'text-text-primary'
              }`}
            >
              <span className={`material-symbols-rounded text-lg ${option.value === value ? 'text-primary' : 'text-transparent'}`}>
                check
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Settings() {
  const router = useRouter()
  const { mode, setMode } = useThemeContext()
  const {
    notifications,
    learning,
    voice,
    data,
    soundEnabled,
    setNotification,
    setLearning,
    setVoice,
    setData,
    setSoundEnabled,
  } = useSettingsStore()

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar title="Settings" showStreak={false} showXp={false} onBack={() => router.push('/profile')} />

      <main className="px-5 space-y-6 animate-fade-in">
        {/* Profile */}
        <div className="card space-y-4">
          <h2 className="section-title">Profile</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="material-symbols-rounded text-white text-3xl">person</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-text-primary">Alex Johnson</p>
              <p className="text-sm text-text-secondary">alex@example.com</p>
            </div>
            <button className="btn-ghost text-sm" onClick={() => router.push('/profile')}>Edit</button>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="card space-y-1">
          <h2 className="section-title mb-2">Learning</h2>
          <SettingsSelect label="Native Language" options={languages} value={learning.nativeLanguage} onChange={(v) => setLearning('nativeLanguage', v)} />
          <SettingsSelect label="Proficiency Level" options={levels} value={learning.proficiencyLevel} onChange={(v) => setLearning('proficiencyLevel', v)} />
          <SettingsSelect label="Daily Goal" options={goals} value={learning.dailyGoalMinutes} onChange={(v) => setLearning('dailyGoalMinutes', v)} />
        </div>

        {/* Voice & Audio */}
        <div className="card space-y-1">
          <h2 className="section-title mb-2">Voice & Audio</h2>
          <SettingsSelect label="AI Voice" options={voices} value={voice.aiVoice} onChange={(v) => setVoice('aiVoice', v)} />
          <SettingsSelect label="Speech Speed" options={speeds} value={voice.speechSpeed} onChange={(v) => setVoice('speechSpeed', v)} />
          <SettingsSelect label="Voice Volume" options={volumes} value={voice.voiceVolume} onChange={(v) => setVoice('voiceVolume', v)} />
          <SettingsSelect label="Microphone" options={microphones.map((m) => ({ value: m, label: m }))} value={voice.microphone} onChange={(v) => setVoice('microphone', v)} />
        </div>

        {/* Notifications */}
        <div className="card space-y-3">
          <h2 className="section-title">Notifications</h2>
          {[
            { icon: 'notifications', label: 'Push Notifications', key: 'push' as const },
            { icon: 'local_fire_department', label: 'Streak Reminders', key: 'streakReminders' as const },
            { icon: 'school', label: 'Daily Lesson Reminder', key: 'dailyLessonReminder' as const },
            { icon: 'campaign', label: 'Product Updates', key: 'productUpdates' as const },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-3 py-3">
              <span className="material-symbols-rounded text-text-secondary text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-text-primary">{item.label}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={(e) => setNotification(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-3 rounded-full peer peer-checked:bg-gradient-primary transition-all" />
              </label>
            </div>
          ))}
        </div>

        {/* Sound Effects */}
        <div className="card space-y-3">
          <h2 className="section-title">Sound</h2>
          <div className="flex items-center gap-3 py-3">
            <span className="material-symbols-rounded text-text-secondary text-xl">volume_up</span>
            <div className="flex-1">
              <p className="text-sm text-text-primary">Sound Effects</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-3 rounded-full peer peer-checked:bg-gradient-primary transition-all" />
            </label>
          </div>
        </div>

        {/* Appearance */}
        <div className="card space-y-3">
          <h2 className="section-title">Appearance</h2>
          <div className="flex gap-2">
            {(['dark', 'light', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setMode(t)}
                className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all capitalize ${
                  mode === t
                    ? 'bg-gradient-primary text-white shadow-glow'
                    : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="card space-y-3">
          <h2 className="section-title">Data & Privacy</h2>
          {[
            { icon: 'memory', label: 'AI Memory', desc: 'AI remembers your conversations', key: 'aiMemory' as const },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-3 py-3">
              <span className="material-symbols-rounded text-text-secondary text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-text-primary">{item.label}</p>
                {item.desc && <p className="text-xs text-text-tertiary">{item.desc}</p>}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={data[item.key]}
                  onChange={(e) => setData(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-3 rounded-full peer peer-checked:bg-gradient-primary transition-all" />
              </label>
            </div>
          ))}
          <button
            onClick={() => {}}
            className="w-full flex items-center gap-3 py-3 -mx-4 px-4 rounded-2xl hover:bg-surface-2 transition-all"
          >
            <span className="material-symbols-rounded text-text-secondary text-xl">download</span>
            <div className="flex-1 text-left">
              <p className="text-sm text-text-primary">Export Data</p>
            </div>
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                router.push('/')
              }
            }}
            className="w-full flex items-center gap-3 py-3 -mx-4 px-4 rounded-2xl hover:bg-error/5 transition-all"
          >
            <span className="material-symbols-rounded text-error text-xl">delete_forever</span>
            <div className="flex-1 text-left">
              <p className="text-sm text-error">Delete Account</p>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center space-y-2 py-4">
          <p className="text-sm font-semibold text-gradient-accent">VoxSpeak</p>
          <p className="text-xs text-text-tertiary">Version 1.0.0</p>
          <p className="text-xs text-text-tertiary">Built with open-source AI</p>
        </div>
      </main>
    </div>
  )
}
