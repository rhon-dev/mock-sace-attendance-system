"use client"

import { ReactNode } from "react"
import { VelvetSidebar } from "./velvet-sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-charcoal">
      {/* Spotlight background effect */}
      <div className="pointer-events-none fixed inset-0 spotlight" />

      <VelvetSidebar />

      <main className="relative flex-1 overflow-x-hidden">
        {/* Curtain transition effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen p-4 md:p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Decorative corner ornaments */}
        <div className="pointer-events-none fixed right-0 top-0 h-32 w-32 opacity-10">
          <svg viewBox="0 0 100 100" className="h-full w-full text-crimson">
            <path
              d="M100 0 L100 100 L0 100 Q50 50 100 0"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="pointer-events-none fixed bottom-0 left-0 h-32 w-32 rotate-180 opacity-10 md:left-[280px]">
          <svg viewBox="0 0 100 100" className="h-full w-full text-crimson">
            <path
              d="M100 0 L100 100 L0 100 Q50 50 100 0"
              fill="currentColor"
            />
          </svg>
        </div>
      </main>
    </div>
  )
}
