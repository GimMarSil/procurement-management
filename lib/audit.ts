import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(process.cwd(), 'logs.db'))

// Ensure Logs table exists
const init = db.prepare(
  `CREATE TABLE IF NOT EXISTS Logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    user TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL
  )`
)
init.run()

export function logAction(user: string, action: string, details: string) {
  const timestamp = new Date().toISOString()
  db.prepare(
    'INSERT INTO Logs (timestamp, user, action, details) VALUES (?,?,?,?)'
  ).run(timestamp, user, action, details)
}

export interface LogEntry {
  timestamp: string
  user: string
  action: string
  details: string
}

export function getLogs(): LogEntry[] {
  return db
    .prepare('SELECT timestamp, user, action, details FROM Logs ORDER BY id DESC')
    .all()
}
