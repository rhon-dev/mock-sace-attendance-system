"use client"

import { motion } from "framer-motion"
import { Users, UserCheck, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface BentoStatsProps {
  totalMembers: number
  liveAttendance: number
  activeEvent: string
}

export function BentoStats({
  totalMembers,
  liveAttendance,
  activeEvent,
}: BentoStatsProps) {
  const stats = [
    {
      label: "Total Enthusiasts",
      value: totalMembers,
      icon: Users,
      delay: 0,
    },
    {
      label: "Live Attendance",
      value: liveAttendance,
      icon: UserCheck,
      delay: 0.1,
    },
    {
      label: "Active Event",
      value: activeEvent,
      icon: Calendar,
      delay: 0.2,
      isText: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay, duration: 0.5 }}
          className={cn(
            "group relative overflow-hidden rounded-2xl",
            "border border-silver/10 bg-maroon/30",
            "p-6 transition-all duration-300",
            "hover:border-crimson/30 hover:bg-maroon/40"
          )}
        >
          {/* Background glow */}
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-crimson/10 blur-2xl transition-all group-hover:bg-crimson/20" />

          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/20 text-crimson transition-all group-hover:glow-crimson-sm">
            <stat.icon className="h-6 w-6" />
          </div>

          {/* Label */}
          <p className="mb-1 text-sm tracking-wide text-silver/70">
            {stat.label}
          </p>

          {/* Value */}
          {stat.isText ? (
            <p className="truncate font-serif text-lg font-semibold text-ghost">
              {stat.value}
            </p>
          ) : (
            <p className="font-serif text-3xl font-bold text-ghost">
              {stat.value.toLocaleString()}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  )
}
