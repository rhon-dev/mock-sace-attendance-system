"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  UserCheck,
  Clock,
  Users,
  ChevronRight,
  MoreVertical,
} from "lucide-react"

interface Attendee {
  id: string
  name: string
  email: string
  checkedIn: boolean
  checkInTime?: string
}

const mockAttendees: Attendee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    checkedIn: true,
    checkInTime: "9:15 AM",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    checkedIn: true,
    checkInTime: "9:32 AM",
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@email.com",
    checkedIn: false,
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@email.com",
    checkedIn: true,
    checkInTime: "9:48 AM",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    checkedIn: false,
  },
  {
    id: "6",
    name: "David Martinez",
    email: "david.martinez@email.com",
    checkedIn: true,
    checkInTime: "10:02 AM",
  },
  {
    id: "7",
    name: "Jessica Brown",
    email: "jessica.brown@email.com",
    checkedIn: false,
  },
  {
    id: "8",
    name: "Robert Taylor",
    email: "robert.taylor@email.com",
    checkedIn: true,
    checkInTime: "10:15 AM",
  },
]

type FilterTab = "all" | "checked_in" | "not_yet"

export function AttendeeList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTab, setFilterTab] = useState<FilterTab>("all")

  const filteredAttendees = useMemo(() => {
    let result = mockAttendees

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (attendee) =>
          attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by tab
    if (filterTab === "checked_in") {
      result = result.filter((a) => a.checkedIn)
    } else if (filterTab === "not_yet") {
      result = result.filter((a) => !a.checkedIn)
    }

    return result
  }, [searchQuery, filterTab])

  const stats = {
    all: mockAttendees.length,
    checked_in: mockAttendees.filter((a) => a.checkedIn).length,
    not_yet: mockAttendees.filter((a) => !a.checkedIn).length,
  }

  const tabs: { label: string; value: FilterTab; count: number }[] = [
    { label: "All", value: "all", count: stats.all },
    { label: "Checked In", value: "checked_in", count: stats.checked_in },
    { label: "Not Yet", value: "not_yet", count: stats.not_yet },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
        <h1 className="font-serif text-3xl font-bold text-ghost md:text-4xl">
          Attendee List
        </h1>
        <p className="mt-2 text-silver/70">
          Manage and track event attendees
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-silver/40" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-silver/20 bg-maroon/30 pl-12 pr-4 py-3 text-ghost placeholder:text-silver/40 transition-all focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20 hover:border-silver/30"
        />
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterTab(tab.value)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 font-medium text-sm transition-all ${
              filterTab === tab.value
                ? "bg-crimson text-white shadow-lg shadow-crimson/30"
                : "border border-silver/20 text-silver/70 hover:border-silver/40 hover:text-ghost"
            }`}
          >
            <span>{tab.label}</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Attendee Cards Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredAttendees.length > 0 ? (
            filteredAttendees.map((attendee) => (
              <motion.div
                key={attendee.id}
                variants={item}
                exit={{ opacity: 0, x: -20 }}
                layoutId={attendee.id}
              >
                <AttendeeCard attendee={attendee} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-silver/10 bg-maroon/20 py-12 text-center"
            >
              <Users className="mx-auto h-12 w-12 text-silver/30 mb-3" />
              <p className="text-silver/60">No attendees found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Manual Check-in Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-2xl border border-crimson/50 bg-gradient-to-r from-crimson/20 to-red-600/20 px-6 py-3 font-semibold text-crimson hover:border-crimson hover:bg-gradient-to-r hover:from-crimson/30 hover:to-red-600/30 transition-all"
      >
        Manual Check-In
      </motion.button>
    </div>
  )
}

function AttendeeCard({ attendee }: { attendee: Attendee }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, translateX: 4 }}
      className="group relative overflow-hidden rounded-2xl border border-silver/10 bg-gradient-to-r from-maroon-deep/50 to-ebony/50 p-4 backdrop-blur-md transition-all hover:border-silver/30"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-crimson/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-center justify-between gap-4">
        {/* Attendee Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white ${
                attendee.checkedIn
                  ? "bg-emerald-500/30 border border-emerald-500/50"
                  : "bg-amber-500/30 border border-amber-500/50"
              }`}
            >
              {attendee.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-ghost truncate">
                {attendee.name}
              </p>
              <p className="text-xs text-silver/50 truncate">{attendee.email}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            {attendee.checkedIn ? (
              <>
                <p className="text-xs font-medium text-emerald-400">
                  Checked In
                </p>
                <p className="text-xs text-silver/50">{attendee.checkInTime}</p>
              </>
            ) : (
              <p className="text-xs font-medium text-amber-400">Pending</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {attendee.checkedIn ? (
              <div className="rounded-full bg-emerald-500/20 p-2">
                <UserCheck className="h-4 w-4 text-emerald-400" />
              </div>
            ) : (
              <div className="rounded-full bg-amber-500/20 p-2">
                <Clock className="h-4 w-4 text-amber-400" />
              </div>
            )}

            <button className="p-2 text-silver/50 hover:text-ghost transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
