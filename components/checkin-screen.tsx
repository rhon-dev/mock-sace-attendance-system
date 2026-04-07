"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QrCode, CheckCircle, XCircle, AlertCircle, Zap } from "lucide-react"
import { useToast } from "./toast-provider"

interface CheckinScanResult {
  success: boolean
  name: string
  status: "success" | "error" | "already_checked"
  message: string
}

export function CheckinScreen() {
  const { addToast } = useToast()
  const [scanInput, setScanInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [lastResult, setLastResult] = useState<CheckinScanResult | null>(null)
  const [attendeesCount, setAttendeesCount] = useState(120)
  const [totalAttendees, setTotalAttendees] = useState(300)
  const [showFlash, setShowFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Simulate QR scanning
  const handleScan = async () => {
    if (!scanInput.trim()) return

    setIsScanning(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock response
    const success = Math.random() > 0.3
    const alreadyChecked = success && Math.random() > 0.8

    const result: CheckinScanResult = {
      success: success && !alreadyChecked,
      name: ["Sarah Johnson", "Michael Chen", "Emma Davis"][
        Math.floor(Math.random() * 3)
      ],
      status: !success
        ? "error"
        : alreadyChecked
          ? "already_checked"
          : "success",
      message: !success
        ? "Invalid QR code"
        : alreadyChecked
          ? "Already checked in"
          : "Checked in successfully",
    }

    setLastResult(result)

    if (result.status === "success") {
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 300)
      setAttendeesCount((prev) => Math.min(prev + 1, totalAttendees))
      addToast(`${result.name} checked in!`, "success")
    } else if (result.status === "already_checked") {
      addToast(`${result.name} already checked in`, "warning")
    } else {
      addToast(result.message, "error")
    }

    setScanInput("")
    setIsScanning(false)

    // Clear result after 3 seconds
    setTimeout(() => setLastResult(null), 3000)

    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleScan()
  }

  const progressPercentage = (attendeesCount / totalAttendees) * 100

  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 py-8 lg:px-0">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 h-96 w-96 bg-crimson/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-96 w-96 bg-maroon/5 rounded-full blur-3xl" />
      </div>

      {/* Success Flash Overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-emerald-500"
          />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-4 flex justify-center"
          >
            <div className="rounded-2xl border border-crimson/30 bg-maroon/20 p-4">
              <QrCode className="h-12 w-12 text-crimson" />
            </div>
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-ghost md:text-4xl">
            Live Check-In
          </h1>
          <p className="mt-2 text-silver/70">Scan attendee QR codes or IDs</p>
        </div>

        {/* Live Counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-silver/10 bg-gradient-to-br from-maroon-deep/50 to-ebony/50 p-8 backdrop-blur-md"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-silver/70">
              Real-time Attendance
            </span>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
              Live
            </span>
          </div>

          <div className="mb-6 text-center">
            <div className="text-5xl font-bold text-ghost">
              {attendeesCount}
              <span className="text-2xl text-silver/50">/{totalAttendees}</span>
            </div>
            <p className="mt-2 text-sm text-silver/60">attendees checked in</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="h-3 overflow-hidden rounded-full bg-ebony/50 border border-silver/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-crimson via-amber-500 to-emerald-500 shadow-lg shadow-crimson/50"
              />
            </div>
            <div className="flex justify-between text-xs text-silver/50">
              <span>0%</span>
              <span className="font-semibold text-ghost">
                {Math.round(progressPercentage)}%
              </span>
              <span>100%</span>
            </div>
          </div>
        </motion.div>

        {/* Scanner Input Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Scan QR code or enter ID..."
              disabled={isScanning}
              className="w-full rounded-2xl border-2 border-silver/20 bg-maroon/30 px-6 py-4 font-mono text-lg text-ghost placeholder:text-silver/40 transition-all focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20 hover:border-silver/30 disabled:opacity-50"
              autoFocus
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              {isScanning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-5 w-5 text-crimson" />
                </motion.div>
              ) : (
                <QrCode className="h-5 w-5 text-silver/40" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isScanning || !scanInput.trim()}
            className="w-full rounded-2xl border border-crimson/50 bg-gradient-to-r from-crimson to-red-600 px-6 py-4 font-semibold text-white transition-all hover:border-crimson hover:shadow-lg hover:shadow-crimson/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? "Processing..." : "Confirm Check-In"}
          </button>
        </motion.form>

        {/* Last Scan Result */}
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-2xl border-2 p-6 backdrop-blur-md ${
                lastResult.status === "success"
                  ? "border-emerald-500/50 bg-emerald-900/20"
                  : lastResult.status === "already_checked"
                    ? "border-amber-500/50 bg-amber-900/20"
                    : "border-red-500/50 bg-red-900/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {lastResult.status === "success" && (
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  )}
                  {lastResult.status === "already_checked" && (
                    <AlertCircle className="h-6 w-6 text-amber-400" />
                  )}
                  {lastResult.status === "error" && (
                    <XCircle className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      lastResult.status === "success"
                        ? "text-emerald-200"
                        : lastResult.status === "already_checked"
                          ? "text-amber-200"
                          : "text-red-200"
                    }`}
                  >
                    {lastResult.name}
                  </p>
                  <p className="mt-1 text-sm text-silver/70">
                    {lastResult.message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Text */}
        <div className="text-center text-sm text-silver/50">
          <p>Point scanner at QR codes or type attendee IDs</p>
          <p className="mt-1">IDs are typically 8-10 digits</p>
        </div>
      </motion.div>
    </div>
  )
}
