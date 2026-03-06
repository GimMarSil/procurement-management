import { NextRequest, NextResponse } from 'next/server'
import sql from 'mssql'
import { getDb } from '@/lib/db'
import { logAction } from '@/lib/audit'
import { withErrorHandling, parseBody } from '@/lib/api-handler'
import { sendRfqSchema } from '@/lib/schemas'

export const POST = withErrorHandling(async (req: NextRequest) => {
  const parsed = await parseBody(req, sendRfqSchema)
  if (!parsed.success) return parsed.response

  const { rfqId, user } = parsed.data

  const db = await getDb()

  const rfqResult = await db
    .request()
    .input('id', sql.Int, rfqId)
    .query('SELECT id, project, supplier FROM RFQs WHERE id = @id')

  if (rfqResult.recordset.length === 0) {
    return NextResponse.json({ error: 'RFQ not found' }, { status: 404 })
  }

  await db
    .request()
    .input('id', sql.Int, rfqId)
    .input('sentAt', sql.NVarChar(50), new Date().toISOString())
    .query('UPDATE RFQs SET sentAt = @sentAt WHERE id = @id')

  const rfq = rfqResult.recordset[0]
  await logAction(user ?? 'unknown', 'RFQ_SENT', JSON.stringify({ rfqId, project: rfq.project, supplier: rfq.supplier }))
  return NextResponse.json({ success: true, rfqId })
})
