import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const today = new Date().toISOString().split("T")[0]

    const totalStudents = await db.get(
      "SELECT COUNT(*) as count FROM students"
    )
    const todayAttendance = await db.get(
      "SELECT COUNT(DISTINCT student_id) as count FROM attendance WHERE DATE(scan_time) = ?",
      [today]
    )

    return NextResponse.json({
      totalStudents: totalStudents?.count || 0,
      todayAttendance: todayAttendance?.count || 0,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json(
      { totalStudents: 0, todayAttendance: 0 },
      { status: 500 }
    )
  }
}
