'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2.5 h-2.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}
