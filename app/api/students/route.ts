import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const offset = (page - 1) * limit

    const db = await getDb()

    let students
    let total

    if (search) {
      const searchPattern = `%${search.toLowerCase()}%`
      total = await db.get(
        `SELECT COUNT(*) as count FROM students 
         WHERE LOWER(student_id) LIKE ? OR LOWER(name) LIKE ? OR LOWER(course) LIKE ?`,
        [searchPattern, searchPattern, searchPattern]
      )
      students = await db.all(
        `SELECT * FROM students 
         WHERE LOWER(student_id) LIKE ? OR LOWER(name) LIKE ? OR LOWER(course) LIKE ?
         ORDER BY name ASC LIMIT ? OFFSET ?`,
        [searchPattern, searchPattern, searchPattern, limit, offset]
      )
    } else {
      total = await db.get("SELECT COUNT(*) as count FROM students")
      students = await db.all(
        "SELECT * FROM students ORDER BY name ASC LIMIT ? OFFSET ?",
        [limit, offset]
      )
    }

    return NextResponse.json({
      students,
      total: total?.count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error("Students fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch students" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { student_id, name, course, year_level } = body

    if (!student_id || !name) {
      return NextResponse.json(
        { message: "Student ID and name are required" },
        { status: 400 }
      )
    }

    const db = await getDb()

    await db.run(
      `INSERT INTO students (student_id, name, course, year_level) 
       VALUES (?, ?, ?, ?)
       ON CONFLICT(student_id) DO UPDATE SET 
       name = excluded.name, course = excluded.course, year_level = excluded.year_level`,
      [student_id, name, course || "", year_level || 0]
    )

    return NextResponse.json({ message: "Student saved successfully" })
  } catch (error) {
    console.error("Student add error:", error)
    return NextResponse.json(
      { message: "Failed to add student" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const db = await getDb()
    await db.run("DELETE FROM students")
    return NextResponse.json({ message: "All students deleted" })
  } catch (error) {
    console.error("Delete all error:", error)
    return NextResponse.json(
      { message: "Failed to delete students" },
      { status: 500 }
    )
  }
}
