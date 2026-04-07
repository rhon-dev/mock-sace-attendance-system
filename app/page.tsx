"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrganizerDashboard } from "@/components/organizer-dashboard"
import { CheckinScreen } from "@/components/checkin-screen"
import { ActivityFeed } from "@/components/activity-feed"
import { ToastProvider } from "@/components/toast-provider"
import { motion } from "framer-motion"
import { LayoutGrid } from "lucide-react"

export default function HomePage() {
  const [view, setView] = useState<"dashboard" | "checkin" | "activity">(
    "dashboard"
  )

  return (
    <ToastProvider>
      <DashboardLayout>
        <div className="space-y-6">
          {/* View Switcher */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={() => setView("dashboard")}
              className={`flex items-center gap-2 rounded-full px-6 py-2 font-medium text-sm transition-all ${
                view === "dashboard"
                  ? "bg-crimson text-white shadow-lg shadow-crimson/30"
                  : "border border-silver/20 text-silver/70 hover:border-silver/40 hover:text-ghost"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => setView("checkin")}
              className={`flex items-center gap-2 rounded-full px-6 py-2 font-medium text-sm transition-all ${
                view === "checkin"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "border border-silver/20 text-silver/70 hover:border-silver/40 hover:text-ghost"
              }`}
            >
              Quick Check-In
            </button>
            <button
              onClick={() => setView("activity")}
              className={`flex items-center gap-2 rounded-full px-6 py-2 font-medium text-sm transition-all ${
                view === "activity"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "border border-silver/20 text-silver/70 hover:border-silver/40 hover:text-ghost"
              }`}
            >
              Live Activity
            </button>
          </motion.div>

          {/* Content */}
          {view === "dashboard" && <OrganizerDashboard />}
          {view === "checkin" && <CheckinScreen />}
          {view === "activity" && <ActivityFeed />}
        </div>
      </DashboardLayout>
    </ToastProvider>
  )
}
