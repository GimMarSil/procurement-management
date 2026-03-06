import { NextRequest, NextResponse } from 'next/server'
import sql from 'mssql'
import { getDb } from '@/lib/db'
import { withErrorHandling, parseBody } from '@/lib/api-handler'
import { createAwardSchema } from '@/lib/schemas'

export const GET = withErrorHandling(async () => {
  const db = await getDb()
  const result = await db.request().query(
    `SELECT a.id, a.projectId, a.awardDate, a.totalValue, a.status,
            al.id AS lineId, al.articuladoId, al.supplier, al.responseItemId,
            al.quantity, al.unitPrice, al.totalPrice
     FROM Awards a
     LEFT JOIN AwardLines al ON al.awardId = a.id
     ORDER BY a.id`
  )

  const awards: any[] = []
  for (const row of result.recordset) {
    let award = awards.find((a) => a.id === row.id)
    if (!award) {
      award = {
        id: String(row.id),
        projectId: row.projectId,
        awardDate: row.awardDate,
        totalValue: row.totalValue,
        status: row.status,
        lines: [],
      }
      awards.push(award)
    }
    if (row.lineId) {
      award.lines.push({
        id: String(row.lineId),
        articuladoId: row.articuladoId,
        supplier: row.supplier,
        responseItemId: row.responseItemId,
        quantity: row.quantity,
        unitPrice: row.unitPrice,
        totalPrice: row.totalPrice,
      })
    }
  }

  return NextResponse.json(awards)
})

export const POST = withErrorHandling(async (req: NextRequest) => {
  const parsed = await parseBody(req, createAwardSchema)
  if (!parsed.success) return parsed.response

  const { projectId, awardDate, lines, totalValue, status } = parsed.data

  const db = await getDb()

  // Conflict detection: check if any articulado line is already awarded
  for (const line of lines) {
    const existing = await db
      .request()
      .input('articuladoId', sql.NVarChar(255), line.articuladoId)
      .query('SELECT id FROM AwardLines WHERE articuladoId = @articuladoId')
    if (existing.recordset.length > 0) {
      return NextResponse.json({ error: 'Line already awarded' }, { status: 409 })
    }
  }

  const transaction = db.transaction()
  await transaction.begin()

  try {
    const result = await transaction
      .request()
      .input('projectId', sql.NVarChar(255), projectId)
      .input('awardDate', sql.NVarChar(50), awardDate || new Date().toISOString())
      .input('totalValue', sql.Float, totalValue)
      .input('status', sql.NVarChar(50), status)
      .query(
        'INSERT INTO Awards (projectId, awardDate, totalValue, status) OUTPUT INSERTED.id VALUES (@projectId, @awardDate, @totalValue, @status)'
      )

    const awardId = result.recordset[0].id

    for (const line of lines) {
      await transaction
        .request()
        .input('awardId', sql.NVarChar(255), String(awardId))
        .input('articuladoId', sql.NVarChar(255), line.articuladoId)
        .input('supplier', sql.NVarChar(255), line.supplier)
        .input('responseItemId', sql.NVarChar(255), line.responseItemId)
        .input('quantity', sql.Float, line.quantity)
        .input('unitPrice', sql.Float, line.unitPrice)
        .input('totalPrice', sql.Float, line.totalPrice)
        .query(
          `INSERT INTO AwardLines (awardId, articuladoId, supplier, responseItemId, quantity, unitPrice, totalPrice)
           VALUES (@awardId, @articuladoId, @supplier, @responseItemId, @quantity, @unitPrice, @totalPrice)`
        )
    }

    await transaction.commit()
    return NextResponse.json({ id: String(awardId) }, { status: 201 })
  } catch (err) {
    await transaction.rollback()
    throw err
  }
})
