import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { withErrorHandling } from '@/lib/api-handler'

export const GET = withErrorHandling(async () => {
  const db = await getDb()
  const result = await db.request().query(
    'SELECT id, familyProduct, description, unit, plannedQuantity, observations, code, projectId FROM ArticuladoLines'
  )
  return NextResponse.json(result.recordset)
})

