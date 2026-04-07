import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const db = await getDb()
    await db.run("DELETE FROM attendance WHERE DATE(scan_time) = ?", [date])

    return NextResponse.json({ message: "Attendance reset for " + date })
  } catch (error) {
    console.error("Reset attendance error:", error)
    return NextResponse.json(
      { message: "Failed to reset attendance" },
      { status: 500 }
    )
  }
}
