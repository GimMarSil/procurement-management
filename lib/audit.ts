import { getDb } from './db'

let initialized = false

async function ensureTable() {
  if (initialized) return
  const pool = await getDb()
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Logs' AND xtype='U')
    CREATE TABLE Logs (
      id INT IDENTITY(1,1) PRIMARY KEY,
      timestamp NVARCHAR(50) NOT NULL,
      [user] NVARCHAR(255) NOT NULL,
      action NVARCHAR(255) NOT NULL,
      details NVARCHAR(MAX) NOT NULL
    )
  `)
  initialized = true
}

export async function logAction(user: string, action: string, details: string) {
  await ensureTable()
  const pool = await getDb()
  const timestamp = new Date().toISOString()
  await pool
    .request()
    .input('timestamp', timestamp)
    .input('user', user)
    .input('action', action)
    .input('details', details)
    .query(
      'INSERT INTO Logs (timestamp, [user], action, details) VALUES (@timestamp, @user, @action, @details)'
    )
}

export interface LogEntry {
  timestamp: string
  user: string
  action: string
  details: string
}

export async function getLogs(): Promise<LogEntry[]> {
  await ensureTable()
  const pool = await getDb()
  const result = await pool
    .request()
    .query('SELECT timestamp, [user], action, details FROM Logs ORDER BY id DESC')
  return result.recordset
}
