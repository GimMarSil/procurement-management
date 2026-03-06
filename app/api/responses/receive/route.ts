import { NextRequest, NextResponse } from 'next/server'
import sql from 'mssql'
import { getDb } from '@/lib/db'
import { logAction } from '@/lib/audit'
import { withErrorHandling, parseBody } from '@/lib/api-handler'
import { receiveResponseSchema } from '@/lib/schemas'

export const POST = withErrorHandling(async (req: NextRequest) => {
  const parsed = await parseBody(req, receiveResponseSchema)
  if (!parsed.success) return parsed.response

  const { rfqId, supplier, responseDate, totalValue, items, user } = parsed.data

  const db = await getDb()
  const transaction = db.transaction()
  await transaction.begin()

  try {
    const result = await transaction
      .request()
      .input('rfqId', sql.NVarChar(255), rfqId)
      .input('supplier', sql.NVarChar(255), supplier)
      .input('responseDate', sql.NVarChar(50), responseDate || new Date().toISOString())
      .input('totalValue', sql.Float, totalValue)
      .query(
        'INSERT INTO SupplierResponses (rfqId, supplier, responseDate, totalValue) OUTPUT INSERTED.id VALUES (@rfqId, @supplier, @responseDate, @totalValue)'
      )

    const responseId = result.recordset[0].id

    for (const item of items) {
      await transaction
        .request()
        .input('responseId', sql.NVarChar(255), String(responseId))
        .input('supplierArticle', sql.NVarChar(255), item.supplierArticle)
        .input('brand', sql.NVarChar(255), item.brand)
        .input('description', sql.NVarChar(500), item.supplierDescription)
        .input('unit', sql.NVarChar(50), item.unit)
        .input('quantity', sql.Float, item.quantity)
        .input('unitPrice', sql.Float, item.unitPrice)
        .input('supplierRef', sql.NVarChar(255), item.supplierRef)
        .input('comments', sql.NVarChar(500), item.comments)
        .query(
          `INSERT INTO ResponseItems (responseId, supplierArticle, brand, description, unit, quantity, unitPrice, supplierRef, comments)
           VALUES (@responseId, @supplierArticle, @brand, @description, @unit, @quantity, @unitPrice, @supplierRef, @comments)`
        )
    }

    await transaction.commit()
    await logAction(user ?? 'unknown', 'RESPONSE_RECEIVED', JSON.stringify({ responseId, rfqId, supplier }))
    return NextResponse.json({ id: responseId }, { status: 201 })
  } catch (err) {
    await transaction.rollback()
    throw err
  }
})
