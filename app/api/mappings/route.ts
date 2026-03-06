import { NextRequest, NextResponse } from 'next/server'
import sql from 'mssql'
import { getDb } from '@/lib/db'
import { withErrorHandling, parseBody } from '@/lib/api-handler'
import { saveMappingsSchema } from '@/lib/schemas'

export const POST = withErrorHandling(async (req: NextRequest) => {
  const parsed = await parseBody(req, saveMappingsSchema)
  if (!parsed.success) return parsed.response

  const { responseId, mappings } = parsed.data

  const db = await getDb()
  const transaction = db.transaction()
  await transaction.begin()

  try {
    await transaction
      .request()
      .input('responseId', sql.NVarChar(255), responseId)
      .query('DELETE FROM ResponseMappings WHERE responseId = @responseId')

    for (const [itemId, articuladoIds] of Object.entries(mappings)) {
      for (const articuladoId of articuladoIds) {
        await transaction
          .request()
          .input('responseId', sql.NVarChar(255), responseId)
          .input('itemId', sql.NVarChar(255), itemId)
          .input('articuladoId', sql.NVarChar(255), articuladoId)
          .query(
            'INSERT INTO ResponseMappings (responseId, itemId, articuladoId) VALUES (@responseId, @itemId, @articuladoId)'
          )
      }
    }

    await transaction.commit()
    return NextResponse.json({ success: true })
  } catch (err) {
    await transaction.rollback()
    throw err
  }
})
