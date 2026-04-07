"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Calendar,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogIn,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AttendanceRecord {
  id: number
  student_id: string
  name: string
  course: string
  year_level: number
  time_in: string
  time_out: string | null
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const perPage = 10

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: perPage.toString(),
        date: dateFilter,
        ...(search && { search }),
      })
      const response = await fetch(`/api/attendance?${params}`)
      const data = await response.json()
      setRecords(data.records || [])
      setTotal(data.total || 0)
    } catch {
      setMessage({ type: "error", text: "Failed to fetch records" })
    }
    setLoading(false)
  }, [page, dateFilter, search])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const handleDeleteRecord = async (id: number) => {
    if (!confirm("Delete this attendance record?")) return

    try {
      const response = await fetch(`/api/attendance/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setMessage({ type: "success", text: "Record deleted" })
        fetchRecords()
      } else {
        setMessage({ type: "error", text: "Failed to delete record" })
      }
    } catch {
      setMessage({ type: "error", text: "Network error" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleResetDay = async () => {
    if (
      !confirm(
        `Reset all attendance for ${dateFilter}? This cannot be undone!`
      )
    )
      return

    try {
      const response = await fetch(`/api/attendance/reset?date=${dateFilter}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setMessage({ type: "success", text: "Attendance reset for this date" })
        fetchRecords()
      } else {
        setMessage({ type: "error", text: "Failed to reset attendance" })
      }
    } catch {
      setMessage({ type: "error", text: "Network error" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleExport = () => {
    window.open(`/api/attendance/export?date=${dateFilter}`, "_blank")
  }

  const formatTime = (datetime: string | null) => {
    if (!datetime) return null
    return new Date(datetime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-wide text-ghost">
              Attendance Log
            </h1>
            <p className="mt-1 text-silver/70">
              View and manage attendance records for {dateFilter}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-silver/10 bg-maroon/30 px-4 py-2">
            <Clock className="h-5 w-5 text-crimson" />
            <span className="text-lg font-semibold text-ghost">{total}</span>
            <span className="text-silver/70">records</span>
          </div>
        </motion.div>

        {/* Message Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-center",
                message.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              )}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 rounded-2xl border border-silver/10 bg-maroon/20 p-6 md:flex-row md:items-center md:justify-between"
        >
          {/* Date Filter */}
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-crimson" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-xl border border-silver/20 bg-ebony/50 px-4 py-2 text-ghost focus:border-crimson focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-emerald-400 transition-all hover:bg-emerald-500/30"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={handleResetDay}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-400 transition-all hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              Reset Day
            </button>
          </div>
        </motion.div>

        {/* Records Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-silver/10 bg-maroon/20 p-6"
        >
          {/* Search */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="font-serif text-lg font-semibold text-ghost">
              Records
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver/50" />
              <input
                type="text"
                placeholder="Search by name, ID, or course..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="w-full rounded-xl border border-silver/20 bg-ebony/50 py-2 pl-10 pr-4 text-ghost placeholder:text-silver/40 focus:border-crimson focus:outline-none md:w-80"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-silver/10 text-left">
                  <th className="pb-4 font-sans text-sm font-medium tracking-wide text-silver/70">
                    Student ID
                  </th>
                  <th className="pb-4 font-sans text-sm font-medium tracking-wide text-silver/70">
                    Name
                  </th>
                  <th className="pb-4 font-sans text-sm font-medium tracking-wide text-silver/70">
                    Course
                  </th>
                  <th className="pb-4 text-center font-sans text-sm font-medium tracking-wide text-silver/70">
                    Year
                  </th>
                  <th className="pb-4 font-sans text-sm font-medium tracking-wide text-silver/70">
                    Time In
                  </th>
                  <th className="pb-4 font-sans text-sm font-medium tracking-wide text-silver/70">
                    Time Out
                  </th>
                  <th className="pb-4 font-sans text-sm font-medium tracking-wide text-silver/70">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-silver/50">
                      Loading...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-silver/50">
                      No records found for this date
                    </td>
                  </tr>
                ) : (
                  records.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group border-b border-silver/5 bg-row-gradient transition-colors hover:bg-maroon/30"
                    >
                      <td className="py-4 font-mono text-sm text-silver">
                        {record.student_id}
                      </td>
                      <td className="py-4 text-ghost">{record.name}</td>
                      <td className="py-4 text-silver/70">{record.course}</td>
                      <td className="py-4 text-center text-silver/70">
                        {record.year_level}
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-400">
                          <LogIn className="h-3.5 w-3.5" />
                          {formatTime(record.time_in)}
                        </span>
                      </td>
                      <td className="py-4">
                        {record.time_out ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-crimson/20 px-3 py-1.5 text-sm text-crimson">
                            <LogOut className="h-3.5 w-3.5" />
                            {formatTime(record.time_out)}
                          </span>
                        ) : (
                          <span className="text-silver/40">—</span>
                        )}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="rounded-lg bg-red-500/10 px-3 py-1.5 text-sm text-red-400 opacity-0 transition-all hover:bg-red-500/20 group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-lg bg-maroon/30 px-3 py-2 text-silver transition-all hover:bg-maroon/50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <span className="px-4 text-silver/70">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 rounded-lg bg-maroon/30 px-3 py-2 text-silver transition-all hover:bg-maroon/50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
