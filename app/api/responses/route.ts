import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withErrorHandling } from '@/lib/api-handler'

export const GET = withErrorHandling(async () => {
  const db = await getDb()

  const result = await db.request().query(
    `SELECT sr.id, sr.rfqId, sr.supplier, sr.responseDate, sr.totalValue,
            ri.id AS itemId, ri.supplierArticle, ri.brand, ri.description AS supplierDescription,
            ri.unit, ri.quantity, ri.unitPrice, ri.supplierRef, ri.comments
     FROM SupplierResponses sr
     LEFT JOIN ResponseItems ri ON ri.responseId = CAST(sr.id AS NVARCHAR(255))
     ORDER BY sr.id`
  )

  const responses: any[] = []
  for (const row of result.recordset) {
    let resp = responses.find((r) => r.id === String(row.id))
    if (!resp) {
      resp = {
        id: String(row.id),
        rfqId: row.rfqId,
        supplier: row.supplier,
        responseDate: row.responseDate,
        totalValue: row.totalValue,
        items: [],
      }
      responses.push(resp)
    }
    if (row.itemId) {
      // Load articulado mappings for this item
      const mappings = await db
        .request()
        .input('responseId', String(row.id))
        .input('itemId', String(row.itemId))
        .query(
          'SELECT articuladoId FROM ResponseMappings WHERE responseId = @responseId AND itemId = @itemId'
        )

      resp.items.push({
        id: String(row.itemId),
        articuladoIds: mappings.recordset.map((m: any) => m.articuladoId),
        supplierArticle: row.supplierArticle,
        brand: row.brand,
        supplierDescription: row.supplierDescription,
        unit: row.unit,
        quantity: row.quantity,
        unitPrice: row.unitPrice,
        supplierRef: row.supplierRef,
        comments: row.comments,
      })
    }
  }

  return NextResponse.json(responses)
})
