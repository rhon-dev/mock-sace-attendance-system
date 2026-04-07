import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const rawBarcode = formData.get("barcode") as string
    const mode = (formData.get("mode") as string) || "time_in"

    if (!rawBarcode) {
      return NextResponse.json(
        { status: "error", message: "No barcode provided" },
        { status: 400 }
      )
    }

    const raw = rawBarcode.trim()
    // Remove first two and last digit like existing logic
    let id = raw
    if (raw.length > 3) {
      id = raw.slice(2, -1)
    }

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Empty barcode" },
        { status: 400 }
      )
    }

    const db = await getDb()

    // Find student
    const student = await db.get(
      "SELECT name FROM students WHERE student_id = ?",
      [id]
    )

    if (!student) {
      return NextResponse.json({
        status: "not_found",
        message: "Student not on the list",
        student_name: null,
      })
    }

    const name = student.name
    const today = new Date().toISOString().split("T")[0]

    if (mode === "time_out") {
      // Find the latest attendance record for today without time_out
      const existing = await db.get(
        `SELECT id, scan_time FROM attendance 
         WHERE student_id = ? 
         AND DATE(scan_time) = ? 
         AND (time_out IS NULL OR time_out = '')
         ORDER BY id DESC LIMIT 1`,
        [id, today]
      )

      if (existing) {
        const now = new Date().toISOString()
        await db.run("UPDATE attendance SET time_out = ? WHERE id = ?", [
          now,
          existing.id,
        ])

        return NextResponse.json({
          status: "out",
          message: `TIME OUT recorded at ${new Date().toLocaleTimeString()}`,
          student_name: name,
        })
      } else {
        return NextResponse.json({
          status: "error",
          message: `No active TIME IN record found for ${name} today`,
          student_name: name,
        })
      }
    }

    // Handle TIME IN mode
    // Check if already marked today
    const existingTimeIn = await db.get(
      `SELECT id, scan_time FROM attendance 
       WHERE student_id = ? 
       AND DATE(scan_time) = ? 
       AND (time_out IS NULL OR time_out = '')
       LIMIT 1`,
      [id, today]
    )

    if (existingTimeIn) {
      return NextResponse.json({
        status: "already",
        message: `Already marked TIME IN at ${new Date(existingTimeIn.scan_time).toLocaleTimeString()}`,
        student_name: name,
      })
    }

    // Insert new time_in record
    const now = new Date().toISOString()
    await db.run(
      "INSERT INTO attendance (student_id, scan_time) VALUES (?, ?)",
      [id, now]
    )

    return NextResponse.json({
      status: "in",
      message: `TIME IN recorded at ${new Date().toLocaleTimeString()}`,
      student_name: name,
    })
  } catch (error) {
    console.error("Scan error:", error)
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    )
  }
}
