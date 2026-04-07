"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Plus,
  Trash2,
  Upload,
  Save,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Student {
  id: number
  student_id: string
  name: string
  course: string
  year_level: number
}

export default function MembersPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    course: "",
    year_level: "",
  })
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const perPage = 10

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: perPage.toString(),
        ...(search && { search }),
      })
      const response = await fetch(`/api/students?${params}`)
      const data = await response.json()
      setStudents(data.students || [])
      setTotal(data.total || 0)
    } catch {
      setMessage({ type: "error", text: "Failed to fetch students" })
    }
    setLoading(false)
  }, [page, search])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          year_level: parseInt(formData.year_level) || 0,
        }),
      })
      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Student added successfully" })
        setShowAddModal(false)
        setFormData({ student_id: "", name: "", course: "", year_level: "" })
        fetchStudents()
      } else {
        setMessage({ type: "error", text: data.message || "Failed to add student" })
      }
    } catch {
      setMessage({ type: "error", text: "Network error" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("Delete this member from the ledger?")) return

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setMessage({ type: "success", text: "Student deleted" })
        fetchStudents()
      } else {
        setMessage({ type: "error", text: "Failed to delete student" })
      }
    } catch {
      setMessage({ type: "error", text: "Network error" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDeleteAll = async () => {
    if (!confirm("Delete ALL members? This cannot be undone!")) return

    try {
      const response = await fetch("/api/students", {
        method: "DELETE",
      })
      if (response.ok) {
        setMessage({ type: "success", text: "All students deleted" })
        fetchStudents()
      } else {
        setMessage({ type: "error", text: "Failed to delete students" })
      }
    } catch {
      setMessage({ type: "error", text: "Network error" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/students/import", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Imported ${data.imported} students`,
        })
        setShowImportModal(false)
        fetchStudents()
      } else {
        setMessage({ type: "error", text: data.message || "Import failed" })
      }
    } catch {
      setMessage({ type: "error", text: "Network error" })
    }
    setTimeout(() => setMessage(null), 3000)
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
              Member Ledger
            </h1>
            <p className="mt-1 text-silver/70">
              Manage the council&apos;s enthusiast roster
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-silver/10 bg-maroon/30 px-4 py-2">
            <Users className="h-5 w-5 text-crimson" />
            <span className="text-lg font-semibold text-ghost">{total}</span>
            <span className="text-silver/70">members</span>
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

        {/* Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-silver/10 bg-maroon/20 p-6"
        >
          <h2 className="mb-4 font-serif text-lg font-semibold text-ghost">
            Add Member
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-crimson/20 px-4 py-3 text-crimson transition-all hover:bg-crimson/30 hover:glow-crimson-sm"
            >
              <Plus className="h-4 w-4" />
              Add Manually
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 rounded-xl border border-silver/20 bg-maroon/30 px-4 py-3 text-silver transition-all hover:border-silver/40 hover:text-ghost"
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </button>
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 transition-all hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              Delete All
            </button>
          </div>
        </motion.div>

        {/* Members Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-silver/10 bg-maroon/20 p-6"
        >
          {/* Search */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="font-serif text-lg font-semibold text-ghost">
              All Members
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-silver/50">
                      Loading...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-silver/50">
                      No members found
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <motion.tr
                      key={student.student_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group border-b border-silver/5 bg-row-gradient transition-colors hover:bg-maroon/30"
                    >
                      <td className="py-4 font-mono text-sm text-silver">
                        {student.student_id}
                      </td>
                      <td className="py-4 text-ghost">{student.name}</td>
                      <td className="py-4 text-silver/70">{student.course}</td>
                      <td className="py-4 text-center text-silver/70">
                        {student.year_level}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleDeleteStudent(student.student_id)}
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

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-silver/20 bg-maroon-deep p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold text-ghost">
                  Add New Member
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-2 text-silver transition-colors hover:bg-silver/10 hover:text-ghost"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-silver/70">
                    Student ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.student_id}
                    onChange={(e) =>
                      setFormData({ ...formData, student_id: e.target.value })
                    }
                    className="w-full rounded-xl border border-silver/20 bg-ebony/50 px-4 py-3 text-ghost focus:border-crimson focus:outline-none"
                    placeholder="e.g. 2300247"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-silver/70">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-silver/20 bg-ebony/50 px-4 py-3 text-ghost focus:border-crimson focus:outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-silver/70">
                    Course
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) =>
                      setFormData({ ...formData, course: e.target.value })
                    }
                    className="w-full rounded-xl border border-silver/20 bg-ebony/50 px-4 py-3 text-ghost focus:border-crimson focus:outline-none"
                    placeholder="e.g. BSCS"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-silver/70">
                    Year Level
                  </label>
                  <input
                    type="number"
                    value={formData.year_level}
                    onChange={(e) =>
                      setFormData({ ...formData, year_level: e.target.value })
                    }
                    className="w-full rounded-xl border border-silver/20 bg-ebony/50 px-4 py-3 text-ghost focus:border-crimson focus:outline-none"
                    placeholder="e.g. 3"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-crimson py-3 font-semibold text-white transition-all hover:bg-crimson/80"
                >
                  <Save className="h-4 w-4" />
                  Save Member
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import CSV Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-silver/20 bg-maroon-deep p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold text-ghost">
                  Import CSV
                </h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="rounded-lg p-2 text-silver transition-colors hover:bg-silver/10 hover:text-ghost"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mb-4 text-sm text-silver/70">
                Upload a CSV file with columns: student_id, name, course,
                year_level
              </p>
              <label className="flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed border-silver/20 p-8 transition-colors hover:border-crimson/50">
                <Upload className="h-8 w-8 text-silver/50" />
                <span className="text-silver/70">
                  Click to select CSV file
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="hidden"
                />
              </label>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
