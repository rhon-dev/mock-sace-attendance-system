import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDb()
    await db.run("DELETE FROM attendance WHERE id = ?", [parseInt(id)])
    return NextResponse.json({ message: "Record deleted" })
  } catch (error) {
    console.error("Delete attendance error:", error)
    return NextResponse.json(
      { message: "Failed to delete record" },
      { status: 500 }
    )
  }
}
