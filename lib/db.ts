import sql from 'mssql'

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getDb() {
  if (!pool) {
    pool = await sql.connect(config)
  }
  return pool
}
