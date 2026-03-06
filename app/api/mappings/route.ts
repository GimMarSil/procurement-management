import { NextRequest, NextResponse } from 'next/server'
import sql from 'mssql'
import { getDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { responseId, mappings } = await req.json()

  if (!responseId || !mappings || typeof mappings !== 'object') {
    return NextResponse.json({ error: 'Missing responseId or mappings' }, { status: 400 })
  }

  const db = await getDb()
  const transaction = db.transaction()
  await transaction.begin()

  try {
    // Clear existing mappings for this response
    await transaction
      .request()
      .input('responseId', sql.NVarChar(255), responseId)
      .query('DELETE FROM ResponseMappings WHERE responseId = @responseId')

    // Insert new mappings
    for (const [itemId, articuladoIds] of Object.entries(mappings)) {
      if (!Array.isArray(articuladoIds)) continue
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
  } catch {
    await transaction.rollback()
    return NextResponse.json({ error: 'Failed to save mappings' }, { status: 500 })
  }
}
