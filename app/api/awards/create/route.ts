import { NextRequest, NextResponse } from 'next/server'
import sql from 'mssql'
import { getDb } from '@/lib/db'
import { logAction } from '@/lib/audit'
import { withErrorHandling, parseBody } from '@/lib/api-handler'
import { createAwardSchema } from '@/lib/schemas'

export const POST = withErrorHandling(async (req: NextRequest) => {
  const parsed = await parseBody(req, createAwardSchema)
  if (!parsed.success) return parsed.response

  const { projectId, awardDate, lines, totalValue, status, user } = parsed.data

  const db = await getDb()
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
    await logAction(user ?? 'unknown', 'AWARD_CREATED', JSON.stringify({ awardId, projectId }))
    return NextResponse.json({ id: awardId }, { status: 201 })
  } catch (err) {
    await transaction.rollback()
    throw err
  }
})
