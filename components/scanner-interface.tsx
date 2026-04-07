"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LogIn, LogOut, Check, X, AlertCircle, Keyboard } from "lucide-react"
import { BaroqueFrame } from "./baroque-frame"
import { cn } from "@/lib/utils"

type ScanMode = "time_in" | "time_out"
type ScanStatus = "idle" | "success" | "error" | "warning" | "processing"

interface ScanResult {
  status: "in" | "out" | "already" | "not_found" | "error"
  message: string
  student_name?: string | null
}

interface ScannerInterfaceProps {
  onScan?: (result: ScanResult) => void
}

export function ScannerInterface({ onScan }: ScannerInterfaceProps) {
  const [mode, setMode] = useState<ScanMode>("time_in")
  const [barcode, setBarcode] = useState("")
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle")
  const [lastResult, setLastResult] = useState<ScanResult | null>(null)
  const [showFlash, setShowFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Keep focus on input
  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const processBarcode = useCallback(
    async (code: string) => {
      if (!code.trim()) return

      setScanStatus("processing")

      try {
        const formData = new FormData()
        formData.append("barcode", code)
        formData.append("mode", mode)

        const response = await fetch("/api/scan", {
          method: "POST",
          body: formData,
        })

        const result: ScanResult = await response.json()
        setLastResult(result)

        if (result.status === "in" || result.status === "out") {
          setScanStatus("success")
          setShowFlash(true)
          setTimeout(() => setShowFlash(false), 500)
        } else if (result.status === "already") {
          setScanStatus("warning")
        } else {
          setScanStatus("error")
        }

        onScan?.(result)
      } catch {
        setScanStatus("error")
        setLastResult({
          status: "error",
          message: "Network error. Please try again.",
        })
      }

      setBarcode("")
      setTimeout(() => setScanStatus("idle"), 3000)
    },
    [mode, onScan]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    processBarcode(barcode)
  }

  // Handle rapid scanner input
  useEffect(() => {
    let scanTimer: NodeJS.Timeout
    const handleKeyDown = () => {
      clearTimeout(scanTimer)
      scanTimer = setTimeout(() => {
        if (barcode.length >= 5) {
          processBarcode(barcode)
        }
      }, 100)
    }

    if (barcode) {
      handleKeyDown()
    }

    return () => clearTimeout(scanTimer)
  }, [barcode, processBarcode])

  return (
    <div
      className="flex flex-col items-center gap-8"
      onClick={handleContainerClick}
    >
      {/* Success Flash Overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-crimson"
          />
        )}
      </AnimatePresence>

      {/* Mode Toggle */}
      <div className="flex gap-2 rounded-2xl border border-silver/10 bg-maroon-deep/50 p-2">
        <button
          onClick={() => setMode("time_in")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-6 py-3 font-sans text-sm font-medium tracking-wide transition-all",
            mode === "time_in"
              ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25"
              : "text-silver/70 hover:bg-silver/5 hover:text-ghost"
          )}
        >
          <LogIn className="h-4 w-4" />
          Time In
        </button>
        <button
          onClick={() => setMode("time_out")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-6 py-3 font-sans text-sm font-medium tracking-wide transition-all",
            mode === "time_out"
              ? "bg-gradient-to-r from-crimson to-red-500 text-white shadow-lg shadow-crimson/25"
              : "text-silver/70 hover:bg-silver/5 hover:text-ghost"
          )}
        >
          <LogOut className="h-4 w-4" />
          Time Out
        </button>
      </div>

      {/* Scanner Frame */}
      <BaroqueFrame
        showScanLine={scanStatus === "processing"}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center gap-6 p-8">
          {/* Scanner Icon */}
          <motion.div
            animate={{
              scale: scanStatus === "processing" ? [1, 1.05, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 1 }}
            className={cn(
              "flex h-24 w-24 items-center justify-center rounded-full border-2 transition-all duration-300",
              scanStatus === "success" &&
                "border-emerald-500 bg-emerald-500/20 glow-crimson",
              scanStatus === "error" &&
                "border-red-500 bg-red-500/20 glow-crimson",
              scanStatus === "warning" &&
                "border-amber-500 bg-amber-500/20 glow-crimson",
              scanStatus === "idle" && "border-silver/30 bg-maroon/30",
              scanStatus === "processing" &&
                "animate-pulse-glow border-crimson bg-crimson/20"
            )}
          >
            <AnimatePresence mode="wait">
              {scanStatus === "success" && (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="h-12 w-12 text-emerald-400" />
                </motion.div>
              )}
              {scanStatus === "error" && (
                <motion.div
                  key="error"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <X className="h-12 w-12 text-red-400" />
                </motion.div>
              )}
              {scanStatus === "warning" && (
                <motion.div
                  key="warning"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <AlertCircle className="h-12 w-12 text-amber-400" />
                </motion.div>
              )}
              {(scanStatus === "idle" || scanStatus === "processing") && (
                <motion.div
                  key="idle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Keyboard className="h-12 w-12 text-silver" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Status Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={lastResult?.message || "waiting"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              {lastResult ? (
                <>
                  <p
                    className={cn(
                      "font-serif text-lg font-semibold",
                      lastResult.status === "in" ||
                        lastResult.status === "out"
                        ? "text-emerald-400"
                        : lastResult.status === "already"
                          ? "text-amber-400"
                          : "text-red-400"
                    )}
                  >
                    {lastResult.student_name || "Unknown"}
                  </p>
                  <p className="mt-1 text-sm text-silver/70">
                    {lastResult.message}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-serif text-lg font-semibold text-ghost">
                    Ready to Scan
                  </p>
                  <p className="mt-1 text-sm text-silver/70">
                    Scan a barcode or enter ID manually
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Scan barcode here..."
                className={cn(
                  "w-full rounded-xl border-2 bg-ebony/50 px-4 py-4 text-center font-mono text-lg text-ghost",
                  "placeholder:text-silver/40",
                  "transition-all duration-300",
                  "focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20",
                  "border-silver/20 hover:border-silver/30"
                )}
                autoComplete="off"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className={cn(
                "mt-4 w-full rounded-xl py-4 font-sans font-semibold tracking-wide transition-all",
                mode === "time_in"
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  : "bg-gradient-to-r from-crimson to-red-500 text-white shadow-lg shadow-crimson/25 hover:shadow-crimson/40"
              )}
            >
              Submit {mode === "time_in" ? "Time In" : "Time Out"}
            </button>
          </form>

          {/* Help Text */}
          <div className="flex items-center gap-2 text-xs text-silver/50">
            <span>Format:</span>
            <code className="rounded bg-ebony px-2 py-1 text-silver/70">
              00[ID]0
            </code>
            <span>e.g., 0023037240</span>
          </div>
        </div>
      </BaroqueFrame>
    </div>
  )
}
