'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-sm mx-auto">
        <div className="w-24 h-24 rounded-4xl bg-surface-2 mx-auto flex items-center justify-center">
          <span className="material-symbols-rounded text-text-tertiary text-5xl">search_off</span>
        </div>

        <div className="space-y-2">
          <h1 className="heading-lg text-text-primary">Page Not Found</h1>
          <p className="body-text">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Link href="/dashboard" className="btn-primary inline-block">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
