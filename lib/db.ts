import sqlite3 from "sqlite3"
import { open, Database } from "sqlite"
import path from "path"

let db: Database | null = null

export async function getDb() {
  if (db) return db

  const dbPath = path.join(process.cwd(), "data", "attendance.db")

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      course TEXT,
      year_level INTEGER
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      scan_time DATETIME NOT NULL,
      time_out DATETIME,
      FOREIGN KEY (student_id) REFERENCES students(student_id)
    )
  `)

  return db
}
