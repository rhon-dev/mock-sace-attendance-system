import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())

    // Skip header row if it exists
    const startIndex = lines[0].toLowerCase().includes("student_id") ? 1 : 0

    const db = await getDb()
    let imported = 0

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim().replace(/"/g, ""))

      if (parts.length >= 2) {
        const [student_id, name, course = "", year_level = "0"] = parts

        if (student_id && name) {
          await db.run(
            `INSERT INTO students (student_id, name, course, year_level) 
             VALUES (?, ?, ?, ?)
             ON CONFLICT(student_id) DO UPDATE SET 
             name = excluded.name, course = excluded.course, year_level = excluded.year_level`,
            [student_id, name, course, parseInt(year_level) || 0]
          )
          imported++
        }
      }
    }

    return NextResponse.json({ message: "Import successful", imported })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ message: "Import failed" }, { status: 500 })
  }
}
