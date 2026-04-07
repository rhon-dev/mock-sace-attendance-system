"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LogIn, Zap, MessageCircle, Clock } from "lucide-react"

interface Activity {
  id: string
  type: "check_in" | "notification" | "update"
  name: string
  message: string
  timestamp: string
  timeAgo: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "check_in",
      name: "Robert Taylor",
      message: "checked in",
      timestamp: "10:15 AM",
      timeAgo: "Just now",
    },
    {
      id: "2",
      type: "check_in",
      name: "David Martinez",
      message: "checked in",
      timestamp: "10:02 AM",
      timeAgo: "13 min ago",
    },
    {
      id: "3",
      type: "notification",
      name: "System",
      message: "Event started successfully",
      timestamp: "9:00 AM",
      timeAgo: "1h ago",
    },
    {
      id: "4",
      type: "check_in",
      name: "James Wilson",
      message: "checked in",
      timestamp: "9:48 AM",
      timeAgo: "27 min ago",
    },
    {
      id: "5",
      type: "check_in",
      name: "Michael Chen",
      message: "checked in",
      timestamp: "9:32 AM",
      timeAgo: "43 min ago",
    },
  ])

  // Simulate new activities
  useEffect(() => {
    const interval = setInterval(() => {
      const names = [
        "Sarah Johnson",
        "Emma Davis",
        "Jessica Brown",
        "Lisa Anderson",
      ]
      const randomName = names[Math.floor(Math.random() * names.length)]

      const newActivity: Activity = {
        id: Math.random().toString(),
        type: "check_in",
        name: randomName,
        message: "checked in",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        timeAgo: "Just now",
      }

      setActivities((prev) => [newActivity, ...prev].slice(0, 10))
    }, 8000)

    return () => clearInterval(interval)
  }, [])

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-ghost md:text-4xl">
              Live Activity
            </h1>
            <p className="mt-2 text-silver/70">
              Real-time check-ins and event updates
            </p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-full bg-emerald-500/20 border border-emerald-500/50 p-3"
          >
            <Zap className="h-6 w-6 text-emerald-400" />
          </motion.div>
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              variants={item}
              layoutId={activity.id}
              exit={{ opacity: 0, x: 20 }}
              className={`relative overflow-hidden rounded-2xl border px-6 py-4 backdrop-blur-md transition-all hover:scale-105 ${
                activity.type === "check_in"
                  ? "border-emerald-500/30 bg-emerald-900/20 hover:border-emerald-500/50"
                  : activity.type === "notification"
                    ? "border-blue-500/30 bg-blue-900/20 hover:border-blue-500/50"
                    : "border-amber-500/30 bg-amber-900/20 hover:border-amber-500/50"
              }`}
            >
              {/* Background accent line */}
              <div
                className={`absolute left-0 top-0 h-full w-1 ${
                  activity.type === "check_in"
                    ? "bg-gradient-to-b from-emerald-500 to-emerald-500/0"
                    : activity.type === "notification"
                      ? "bg-gradient-to-b from-blue-500 to-blue-500/0"
                      : "bg-gradient-to-b from-amber-500 to-amber-500/0"
                }`}
              />

              <div className="ml-4 flex items-start justify-between gap-4">
                {/* Activity content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-full p-2 ${
                        activity.type === "check_in"
                          ? "bg-emerald-500/20"
                          : activity.type === "notification"
                            ? "bg-blue-500/20"
                            : "bg-amber-500/20"
                      }`}
                    >
                      {activity.type === "check_in" && (
                        <LogIn
                          className={`h-4 w-4 ${
                            activity.type === "check_in"
                              ? "text-emerald-400"
                              : ""
                          }`}
                        />
                      )}
                      {activity.type === "notification" && (
                        <MessageCircle className="h-4 w-4 text-blue-400" />
                      )}
                      {activity.type === "update" && (
                        <Zap className="h-4 w-4 text-amber-400" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-ghost">
                        {activity.name}
                        <span className="ml-2 font-normal text-silver/70">
                          {activity.message}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-silver/50">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time ago badge */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-silver/60 hover:bg-white/10 transition-colors"
                >
                  <Clock className="h-3 w-3" />
                  <span>{activity.timeAgo}</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-2xl border border-silver/20 bg-maroon/30 px-6 py-3 font-medium text-silver/70 transition-all hover:border-silver/40 hover:text-ghost hover:bg-maroon/50"
      >
        Load More Activities
      </motion.button>
    </div>
  )
}
