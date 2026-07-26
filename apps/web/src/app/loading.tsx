export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-3 h-3 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-3 h-3 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
