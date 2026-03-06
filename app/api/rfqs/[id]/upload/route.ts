import { NextResponse } from 'next/server'
import sql from 'mssql'
import * as XLSX from 'xlsx'
import { getDb } from '@/lib/db'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const formData = await req.formData()
  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 })
  }

  if (file.type && !ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only Excel files are accepted' }, { status: 415 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer, { type: 'buffer' })

  if (!workbook.SheetNames.length) {
    return NextResponse.json({ error: 'Workbook has no sheets' }, { status: 400 })
  }

  const sheet = workbook.SheetNames[0]
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]) as Record<string, unknown>[]

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Sheet is empty' }, { status: 400 })
  }

  // Validate RFQ exists
  const db = await getDb()
  const rfqCheck = await db.request().input('id', sql.Int, id).query('SELECT id FROM RFQs WHERE id = @id')
  if (rfqCheck.recordset.length === 0) {
    return NextResponse.json({ error: 'RFQ not found' }, { status: 404 })
  }

  const transaction = db.transaction()
  await transaction.begin()

  try {
    for (const row of rows) {
      await transaction
        .request()
        .input('rfqId', sql.NVarChar(255), id)
        .input('supplier', sql.NVarChar(255), String(row['Fornecedor'] || row['supplier'] || ''))
        .input('responseDate', sql.NVarChar(50), new Date().toISOString())
        .input('totalValue', sql.Float, Number(row['Valor Total'] || row['totalValue'] || 0))
        .query(
          'INSERT INTO SupplierResponses (rfqId, supplier, responseDate, totalValue) VALUES (@rfqId, @supplier, @responseDate, @totalValue)'
        )
    }

    await transaction.commit()
    return NextResponse.json({ success: true, rows: rows.length })
  } catch (err) {
    await transaction.rollback()
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 })
  }
}
