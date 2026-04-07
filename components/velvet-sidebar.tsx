"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Users,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Scan,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navItems = [
  {
    href: "/",
    label: "Scanner",
    icon: Home,
  },
  {
    href: "/members",
    label: "Members",
    icon: Users,
  },
  {
    href: "/attendance",
    label: "Attendance",
    icon: CalendarCheck,
  },
]

export function VelvetSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen",
          "glass-velvet border-r border-silver/20",
          "flex flex-col",
          "md:relative md:z-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-silver/10 px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-crimson/50 bg-maroon-deep">
              <Image
                src="/secap.png"
                alt="SACE Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="font-serif text-xl font-bold tracking-widest text-ghost">
                    SACE
                  </h1>
                  <p className="text-xs tracking-wider text-silver/70">
                    Scarlet Protocol
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-3 py-6">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300",
                    isActive
                      ? "bg-crimson/20 text-ghost"
                      : "text-silver/70 hover:bg-maroon/30 hover:text-ghost"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-crimson glow-crimson-sm"
                    />
                  )}

                  {/* Icon with glow on hover/active */}
                  <div
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300",
                      isActive
                        ? "bg-crimson/30 glow-crimson-sm"
                        : "group-hover:bg-crimson/20 group-hover:shadow-[0_0_15px_hsla(0,85%,50%,0.25)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-crimson-glow" : "text-silver"
                      )}
                    />
                  </div>

                  {/* Label */}
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-sans text-sm font-medium tracking-wide"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-silver/10 p-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-maroon/30 px-4 py-3 text-silver/70 transition-all hover:bg-maroon/50 hover:text-ghost"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm tracking-wide">Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-t border-silver/10 px-4 py-4"
            >
              <p className="text-center text-xs text-silver/40">
                &copy; {new Date().getFullYear()} SACE Council
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "fixed left-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-xl",
          "glass-velvet border border-silver/20",
          "text-silver transition-all hover:text-ghost md:hidden",
          !collapsed && "opacity-0"
        )}
      >
        <Scan className="h-5 w-5" />
      </button>
    </>
  )
}
