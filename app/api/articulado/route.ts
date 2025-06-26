import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const db = await getDb()
    const result = await db.request().query(
      'SELECT id, familyProduct, description, unit, plannedQuantity, observations, code, projectId FROM ArticuladoLines'
    )
    return NextResponse.json(result.recordset)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch articulado' },
      { status: 500 }
    )
  }
}

