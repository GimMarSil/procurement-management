import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { getDb } from '@/lib/db'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const formData = await req.formData()
  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 })
  }

  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]
  if (file.type && !allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Only Excel files are accepted' }, { status: 415 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer, { type: 'buffer' })

  if (!workbook.SheetNames.length) {
    return NextResponse.json({ error: 'Workbook has no sheets' }, { status: 400 })
  }

  const sheet = workbook.SheetNames[0]
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]) as any[]

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Sheet is empty' }, { status: 400 })
  }

  const db = await getDb()
  for (const row of rows) {
    await db.request()
      .input('RFQId', id)
      .input('Data', JSON.stringify(row))
      .query('INSERT INTO SupplierResponses (RFQId, Data) VALUES (@RFQId, @Data)')
  }

  return NextResponse.json({ success: true, rows: rows.length })
}
