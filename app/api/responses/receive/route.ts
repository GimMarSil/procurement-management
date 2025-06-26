import { NextRequest, NextResponse } from 'next/server'
import { logAction } from '@/lib/audit'

export async function POST(req: NextRequest) {
  const body = await req.json()
  logAction(body.user ?? 'unknown', 'RESPONSE_RECEIVED', JSON.stringify(body))
  return NextResponse.json({ ok: true })
}
