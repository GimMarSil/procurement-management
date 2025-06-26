import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import sql from 'mssql'

export async function GET() {
  const db = await getDb()
  const result = await db.request().query(
    `SELECT r.id, r.rfqId, r.data, r.createdAt, q.project, q.supplier
       FROM SupplierResponses r
       JOIN RFQs q ON q.id = r.rfqId
       ORDER BY r.createdAt DESC`
  )

  const responses = result.recordset.map((row: any) => {
    const data = JSON.parse(row.data)
    const totalValue = Array.isArray(data.items)
      ? data.items.reduce(
          (sum: number, i: any) => sum + (i.quantity ?? 0) * (i.unitPrice ?? 0),
          0
        )
      : 0
    return {
      id: row.id,
      rfqId: row.rfqId,
      project: row.project,
      supplier: row.supplier,
      ...data,
      totalValue,
      createdAt: row.createdAt,
    }
  })

  return NextResponse.json(responses)
}
