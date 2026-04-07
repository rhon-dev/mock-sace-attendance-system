import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const db = await getDb()

    const records = await db.all(
      `SELECT a.student_id, s.name, s.course, s.year_level, 
              a.scan_time as time_in, a.time_out
       FROM attendance a 
       LEFT JOIN students s ON a.student_id = s.student_id 
       WHERE DATE(a.scan_time) = ?
       ORDER BY a.scan_time DESC`,
      [date]
    )

    // Generate CSV
    const headers = ["Student ID", "Name", "Course", "Year Level", "Date", "Time In", "Time Out"]
    const rows = records.map((r) => {
      const timeIn = new Date(r.time_in)
      const dateStr = timeIn.toISOString().split("T")[0]
      const timeInStr = timeIn.toLocaleTimeString()
      const timeOutStr = r.time_out ? new Date(r.time_out).toLocaleTimeString() : ""

      return [
        r.student_id,
        `"${r.name || ""}"`,
        r.course || "",
        r.year_level || "",
        dateStr,
        timeInStr,
        timeOutStr,
      ].join(",")
    })

    const csv = [headers.join(","), ...rows].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="attendance_${date}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { message: "Failed to export attendance" },
      { status: 500 }
    )
  }
}
