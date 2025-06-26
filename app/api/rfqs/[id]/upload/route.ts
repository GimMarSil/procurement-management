import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { getDb } from '@/lib/db'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheet = workbook.SheetNames[0]
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]) as any[]

    const db = await getDb()
    for (const row of rows) {
      await db
        .request()
        .input('RFQId', params.id)
        .input('Data', JSON.stringify(row))
        .query('INSERT INTO SupplierResponses (RFQId, Data) VALUES (@RFQId, @Data)')
    }

    return NextResponse.json({ success: true, rows: rows.length })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to upload responses' },
      { status: 500 }
    )
  }
}
