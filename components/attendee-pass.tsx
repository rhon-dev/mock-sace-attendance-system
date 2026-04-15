"use client"

import { motion } from "framer-motion"
import { QrCode, Check, Clock } from "lucide-react"
import Image from "next/image"

interface AttendeePassProps {
  name?: string
  eventName?: string
  qrCode?: string
  isCheckedIn?: boolean
}

export function AttendeePass({
  name = "Sarah Johnson",
  eventName = "Tech Conference 2025",
  isCheckedIn = false,
}: AttendeePassProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Main Ticket Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-silver/20 bg-gradient-to-br from-maroon via-maroon-deep to-ebony shadow-2xl">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-crimson/10 via-transparent to-amber-500/5" />

        {/* Top section - Event info */}
        <div className="relative px-6 pt-8 pb-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-silver/60 uppercase tracking-wider">
                Event Pass
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-ghost">
                {eventName}
              </h2>
            </div>
            <motion.div
              animate={{ rotate: isCheckedIn ? 360 : 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-xl bg-crimson/20 p-2"
            >
              <QrCode className="h-6 w-6 text-crimson" />
            </motion.div>
          </div>

          {/* Attendee name */}
          <div className="mt-6 rounded-2xl bg-ebony/50 px-4 py-3 border border-silver/10">
            <p className="text-xs text-silver/60">Attendee Name</p>
            <p className="mt-1 font-serif text-xl font-bold text-ghost">{name}</p>
          </div>
        </div>

        {/* Divider with ticket perforation effect */}
        <div className="relative h-1 bg-gradient-to-r from-transparent via-silver/20 to-transparent">
          <div className="absolute top-1/2 left-0 right-0 flex -translate-y-1/2 justify-between px-6">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-1 rounded-full bg-maroon-deep"
              />
            ))}
          </div>
        </div>

        {/* Bottom section - QR code and status */}
        <div className="relative space-y-4 px-6 py-6">
          {/* QR Code placeholder */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <div className="h-48 w-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400 text-sm">
                  <QrCode className="h-12 w-12 mx-auto mb-2" />
                  <p>QR Code</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl px-4 py-3 flex items-center justify-center gap-2 border-2 ${
              isCheckedIn
                ? "border-emerald-500/50 bg-emerald-900/20"
                : "border-amber-500/50 bg-amber-900/20"
            }`}
          >
            {isCheckedIn ? (
              <>
                <Check className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold text-emerald-200">
                  Checked In
                </span>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-amber-400" />
                <span className="font-semibold text-amber-200">
                  Not Yet Checked In
                </span>
              </>
            )}
          </motion.div>

          {/* Event details footer */}
          <div className="pt-2 grid grid-cols-2 gap-3 text-xs text-silver/60">
            <div className="text-center">
              <p>Date</p>
              <p className="mt-1 font-semibold text-ghost">Dec 15, 2025</p>
            </div>
            <div className="text-center">
              <p>Time</p>
              <p className="mt-1 font-semibold text-ghost">9:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional info below ticket */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 space-y-3 text-center text-sm text-silver/70"
      >
        <p>
          {isCheckedIn
            ? "Welcome to the event! Show this pass at the entrance."
            : "Have your pass ready at check-in. Scan the QR code above."}
        </p>
        <p className="text-xs text-silver/50">ID: {name.split(" ").join("").toLowerCase()}-2025</p>
      </motion.div>
    </motion.div>
  )
}
