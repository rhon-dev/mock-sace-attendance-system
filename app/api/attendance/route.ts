import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
    const search = searchParams.get("search") || ""
    const offset = (page - 1) * limit

    const db = await getDb()

    let whereClause = "WHERE DATE(a.scan_time) = ?"
    const params: (string | number)[] = [date]

    if (search) {
      const searchPattern = `%${search.toLowerCase()}%`
      whereClause += ` AND (LOWER(a.student_id) LIKE ? OR LOWER(s.name) LIKE ? OR LOWER(s.course) LIKE ?)`
      params.push(searchPattern, searchPattern, searchPattern)
    }

    const total = await db.get(
      `SELECT COUNT(*) as count FROM attendance a 
       LEFT JOIN students s ON a.student_id = s.student_id 
       ${whereClause}`,
      params
    )

    const records = await db.all(
      `SELECT a.id, a.student_id, s.name, s.course, s.year_level, 
              a.scan_time as time_in, a.time_out
       FROM attendance a 
       LEFT JOIN students s ON a.student_id = s.student_id 
       ${whereClause}
       ORDER BY a.scan_time DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    return NextResponse.json({
      records,
      total: total?.count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error("Attendance fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}
