import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDb()
    await db.run("DELETE FROM students WHERE student_id = ?", [id])
    return NextResponse.json({ message: "Student deleted" })
  } catch (error) {
    console.error("Delete student error:", error)
    return NextResponse.json(
      { message: "Failed to delete student" },
      { status: 500 }
    )
  }
}
