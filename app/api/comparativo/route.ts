import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withErrorHandling } from '@/lib/api-handler'

export const GET = withErrorHandling(async () => {
  const db = await getDb()

  // Fetch articulado lines
  const artResult = await db.request().query(
    'SELECT id, familyProduct, description, unit, plannedQuantity, observations, code, projectId FROM ArticuladoLines'
  )
  const articuladoLines = artResult.recordset

  // Fetch responses with items and mappings
  const respResult = await db.request().query(
    `SELECT sr.id AS responseId, sr.rfqId, sr.supplier, sr.responseDate, sr.totalValue,
            ri.id AS itemId, ri.supplierArticle, ri.brand, ri.description AS supplierDescription,
            ri.unit, ri.quantity, ri.unitPrice, ri.supplierRef, ri.comments
     FROM SupplierResponses sr
     LEFT JOIN ResponseItems ri ON ri.responseId = CAST(sr.id AS NVARCHAR(255))
     ORDER BY sr.id`
  )

  // Build responses with items
  const responses: any[] = []
  for (const row of respResult.recordset) {
    let resp = responses.find((r) => r.id === String(row.responseId))
    if (!resp) {
      resp = {
        id: String(row.responseId),
        rfqId: row.rfqId,
        supplier: row.supplier,
        responseDate: row.responseDate,
        totalValue: row.totalValue,
        items: [],
      }
      responses.push(resp)
    }
    if (row.itemId) {
      const mappings = await db
        .request()
        .input('responseId', String(row.responseId))
        .input('itemId', String(row.itemId))
        .query('SELECT articuladoId FROM ResponseMappings WHERE responseId = @responseId AND itemId = @itemId')

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

  // Build comparative matrix
  const suppliers = [...new Set(responses.map((r: any) => r.supplier))]
  const matrix: any = {}

  for (const line of articuladoLines) {
    matrix[String(line.id)] = {}
    for (const supplier of suppliers) {
      const resp = responses.find((r: any) => r.supplier === supplier)
      if (!resp) {
        matrix[String(line.id)][supplier] = { available: false }
        continue
      }
      const item = resp.items.find((i: any) => i.articuladoIds.includes(String(line.id)))
      if (item) {
        matrix[String(line.id)][supplier] = {
          available: true,
          price: item.unitPrice,
          item,
        }
      } else {
        matrix[String(line.id)][supplier] = { available: false }
      }
    }
  }

  return NextResponse.json({
    articuladoLines,
    suppliers,
    responses,
    matrix,
  })
})
