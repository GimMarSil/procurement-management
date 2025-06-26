import { ConnectionPool } from 'mssql'

let pool: ConnectionPool | null = null

export async function getDb() {
  if (!process.env.SQLSERVER_CONN) {
    throw new Error('SQLSERVER_CONN env var not set')
  }
  if (!pool) {
    pool = new ConnectionPool(process.env.SQLSERVER_CONN)
    await pool.connect()
  }
  return pool
}
