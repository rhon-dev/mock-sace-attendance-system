"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BaroqueFrameProps {
  children: ReactNode
  className?: string
  showScanLine?: boolean
}

export function BaroqueFrame({
  children,
  className,
  showScanLine = false,
}: BaroqueFrameProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Outer ornate frame */}
      <div className="absolute -inset-4 rounded-3xl border-2 border-silver/20 opacity-50" />

      {/* Corner ornaments */}
      <svg
        className="absolute -left-6 -top-6 h-12 w-12 text-silver/30"
        viewBox="0 0 48 48"
      >
        <path
          d="M4 44 C4 20, 20 4, 44 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="44" cy="4" r="3" fill="currentColor" />
        <circle cx="4" cy="44" r="3" fill="currentColor" />
        <path
          d="M12 36 Q12 24 24 24 Q24 12 36 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <svg
        className="absolute -right-6 -top-6 h-12 w-12 rotate-90 text-silver/30"
        viewBox="0 0 48 48"
      >
        <path
          d="M4 44 C4 20, 20 4, 44 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="44" cy="4" r="3" fill="currentColor" />
        <circle cx="4" cy="44" r="3" fill="currentColor" />
        <path
          d="M12 36 Q12 24 24 24 Q24 12 36 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <svg
        className="absolute -bottom-6 -right-6 h-12 w-12 rotate-180 text-silver/30"
        viewBox="0 0 48 48"
      >
        <path
          d="M4 44 C4 20, 20 4, 44 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="44" cy="4" r="3" fill="currentColor" />
        <circle cx="4" cy="44" r="3" fill="currentColor" />
        <path
          d="M12 36 Q12 24 24 24 Q24 12 36 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <svg
        className="absolute -bottom-6 -left-6 h-12 w-12 -rotate-90 text-silver/30"
        viewBox="0 0 48 48"
      >
        <path
          d="M4 44 C4 20, 20 4, 44 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="44" cy="4" r="3" fill="currentColor" />
        <circle cx="4" cy="44" r="3" fill="currentColor" />
        <path
          d="M12 36 Q12 24 24 24 Q24 12 36 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      {/* Main frame */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-silver/30 bg-maroon-deep/50">
        {/* Inner glow border */}
        <div className="absolute inset-0 rounded-2xl border border-crimson/20" />

        {/* Scanning line animation */}
        {showScanLine && (
          <div className="pointer-events-none absolute inset-x-0 h-0.5 animate-scan-line bg-gradient-to-r from-transparent via-crimson to-transparent shadow-[0_0_10px_hsla(0,85%,50%,0.8)]" />
        )}

        {children}
      </div>
    </div>
  )
}
