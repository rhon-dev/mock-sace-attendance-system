"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BentoStats } from "@/components/bento-stats"
import { ScannerInterface } from "@/components/scanner-interface"
import { motion } from "framer-motion"
import Image from "next/image"

export default function ScannerPage() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    liveAttendance: 0,
    activeEvent: "Daily Assembly",
  })

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        const data = await response.json()
        setStats({
          totalMembers: data.totalStudents || 0,
          liveAttendance: data.todayAttendance || 0,
          activeEvent: "Daily Assembly",
        })
      } catch {
        // Use fallback values
      }
    }

    fetchStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleScan = () => {
    // Refresh stats after a scan
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats((prev) => ({
          ...prev,
          totalMembers: data.totalStudents || prev.totalMembers,
          liveAttendance: data.todayAttendance || prev.liveAttendance,
        }))
      })
      .catch(() => {})
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-crimson/50 bg-maroon-deep glow-crimson">
            <Image
              src="/secap.png"
              alt="SACE Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-wide text-ghost md:text-4xl">
              Attendance Scanner
            </h1>
            <p className="mt-2 text-silver/70">
              Scan member barcodes for the Scarlet Protocol
            </p>
          </div>
        </motion.div>

        {/* Stats Bento Grid */}
        <BentoStats
          totalMembers={stats.totalMembers}
          liveAttendance={stats.liveAttendance}
          activeEvent={stats.activeEvent}
        />

        {/* Scanner Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ScannerInterface onScan={handleScan} />
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
