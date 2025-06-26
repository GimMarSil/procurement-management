import { NextRequest, NextResponse } from 'next/server'
import sql from 'mssql'
import { getDb } from '@/lib/db'

export async function GET() {
  const db = await getDb()
  const result = await db
    .request()
    .query(`SELECT r.id, r.project, r.supplier, r.dueDate, r.createdAt,
                   l.id AS lineId, l.description, l.quantity
            FROM RFQs r
            LEFT JOIN RFQLines l ON l.rfqId = r.id
            ORDER BY r.id`)

  const rfqs: any[] = []
  for (const row of result.recordset) {
    let rfq = rfqs.find((r) => r.id === row.id)
    if (!rfq) {
      rfq = {
        id: row.id,
        project: row.project,
        supplier: row.supplier,
        dueDate: row.dueDate,
        createdAt: row.createdAt,
        lines: [],
      }
      rfqs.push(rfq)
    }
    if (row.lineId) {
      rfq.lines.push({
        id: row.lineId,
        description: row.description,
        quantity: row.quantity,
      })
    }
  }

  return NextResponse.json(rfqs)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { project, supplier, dueDate, lines = [] } = body

  if (!project || !supplier || !dueDate) {
    return NextResponse.json(
      { error: 'Missing fields' },
      { status: 400 }
    )
  }

  const db = await getDb()
  const rfqResult = await db
    .request()
    .input('project', sql.NVarChar(255), project)
    .input('supplier', sql.NVarChar(255), supplier)
    .input('dueDate', sql.Date, dueDate)
    .query(
      'INSERT INTO RFQs (project, supplier, dueDate) OUTPUT INSERTED.id VALUES (@project, @supplier, @dueDate)'
    )
  const rfqId = rfqResult.recordset[0].id

  for (const line of lines) {
    await db
      .request()
      .input('rfqId', sql.Int, rfqId)
      .input('description', sql.NVarChar(255), line.description)
      .input('quantity', sql.Int, line.quantity)
      .query(
        'INSERT INTO RFQLines (rfqId, description, quantity) VALUES (@rfqId, @description, @quantity)'
      )
  }

  return NextResponse.json({ id: rfqId }, { status: 201 })
}
