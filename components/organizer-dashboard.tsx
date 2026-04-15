"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, UserCheck, Clock } from "lucide-react"

interface DashboardStats {
  totalAttendees: number
  checkedIn: number
  notYetChecked: number
}

interface CheckinTimepoint {
  time: string
  count: number
}

export function OrganizerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAttendees: 300,
    checkedIn: 120,
    notYetChecked: 180,
  })

  const [checkinData, setCheckinData] = useState<CheckinTimepoint[]>([
    { time: "9:00 AM", count: 5 },
    { time: "9:15 AM", count: 15 },
    { time: "9:30 AM", count: 35 },
    { time: "9:45 AM", count: 42 },
    { time: "10:00 AM", count: 23 },
  ])

  const checkinPercentage = Math.round(
    (stats.checkedIn / stats.totalAttendees) * 100
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl font-bold text-ghost md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-silver/70">Event summary and quick stats</p>
      </motion.div>

      {/* Summary Cards Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-3"
      >
        {/* Total Attendees Card */}
        <motion.div
          variants={item}
          className="group relative overflow-hidden rounded-2xl border border-silver/10 bg-gradient-to-br from-maroon-deep/50 to-ebony/50 p-6 backdrop-blur-md transition-all hover:border-crimson/30 hover:shadow-lg hover:shadow-crimson/20"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-crimson/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-silver/70">Total Attendees</p>
              <p className="mt-4 text-4xl font-bold text-ghost">
                {stats.totalAttendees}
              </p>
            </div>
            <div className="rounded-lg bg-blue-500/20 p-3">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-silver/60">
            <div className="h-1 w-8 rounded-full bg-blue-500/30" />
            <span>All registered attendees</span>
          </div>
        </motion.div>

        {/* Checked In Card */}
        <motion.div
          variants={item}
          className="group relative overflow-hidden rounded-2xl border border-silver/10 bg-gradient-to-br from-maroon-deep/50 to-ebony/50 p-6 backdrop-blur-md transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-silver/70">Checked In</p>
              <p className="mt-4 text-4xl font-bold text-ghost">
                {stats.checkedIn}
              </p>
              <p className="mt-1 text-xs text-emerald-400/80">
                {checkinPercentage}% of total
              </p>
            </div>
            <div className="rounded-lg bg-emerald-500/20 p-3">
              <UserCheck className="h-6 w-6 text-emerald-400" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-silver/60">
            <div className="h-1 w-12 rounded-full bg-emerald-500/30" />
            <span>Successfully checked in</span>
          </div>
        </motion.div>

        {/* Not Yet Checked Card */}
        <motion.div
          variants={item}
          className="group relative overflow-hidden rounded-2xl border border-silver/10 bg-gradient-to-br from-maroon-deep/50 to-ebony/50 p-6 backdrop-blur-md transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/20"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-silver/70">Not Yet</p>
              <p className="mt-4 text-4xl font-bold text-ghost">
                {stats.notYetChecked}
              </p>
              <p className="mt-1 text-xs text-amber-400/80">
                {100 - checkinPercentage}% remaining
              </p>
            </div>
            <div className="rounded-lg bg-amber-500/20 p-3">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-silver/60">
            <div className="h-1 w-8 rounded-full bg-amber-500/30" />
            <span>Awaiting check-in</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Check-in Timeline Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-hidden rounded-2xl border border-silver/10 bg-gradient-to-br from-maroon-deep/50 to-ebony/50 p-6 backdrop-blur-md"
      >
        <h3 className="mb-6 font-serif text-lg font-semibold text-ghost">
          Check-ins Over Time
        </h3>

        <div className="space-y-4">
          {checkinData.map((dataPoint, idx) => {
            const maxCount = Math.max(...checkinData.map((d) => d.count))
            const percentage = (dataPoint.count / maxCount) * 100

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <span className="w-16 text-sm font-medium text-silver/70">
                    {dataPoint.time}
                  </span>
                  <div className="flex-1 overflow-hidden rounded-full bg-ebony/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{
                        delay: idx * 0.1 + 0.2,
                        duration: 0.8,
                      }}
                      className="h-2 rounded-full bg-gradient-to-r from-crimson to-amber-500"
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-semibold text-ghost">
                    {dataPoint.count}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <div className="rounded-2xl border border-silver/10 bg-maroon-deep/30 p-4 backdrop-blur-md">
          <p className="text-sm text-silver/70">Average Check-in Rate</p>
          <p className="mt-2 text-2xl font-bold text-crimson">
            {checkinPercentage}%/min
          </p>
        </div>
        <div className="rounded-2xl border border-silver/10 bg-maroon-deep/30 p-4 backdrop-blur-md">
          <p className="text-sm text-silver/70">Event Duration</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">Live</p>
        </div>
      </motion.div>
    </div>
  )
}
