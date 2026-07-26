'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-sm mx-auto">
        <div className="w-24 h-24 rounded-4xl bg-error/10 mx-auto flex items-center justify-center">
          <span className="material-symbols-rounded text-error text-5xl">error_outline</span>
        </div>

        <div className="space-y-2">
          <h1 className="heading-lg text-text-primary">Something went wrong</h1>
          <p className="body-text">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
      </div>
    </div>
  )
}
