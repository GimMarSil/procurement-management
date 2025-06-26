<<<<<<< codex/implement-email-sending-with-attachments
import sql from 'mssql'

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER || 'localhost',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getDb() {
  if (!pool) {
    pool = await sql.connect(config)
=======
import { ConnectionPool } from 'mssql'

let pool: ConnectionPool | null = null

export async function getDb() {
  if (!process.env.SQLSERVER_CONN) {
    throw new Error('SQLSERVER_CONN env var not set')
  }
  if (!pool) {
    pool = new ConnectionPool(process.env.SQLSERVER_CONN)
    await pool.connect()
>>>>>>> main
  }
  return pool
}
