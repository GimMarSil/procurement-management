import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { Award } from '@/types/procurement'

const DATA_PATH = path.join(process.cwd(), 'data', 'awards.json')

async function readData(): Promise<Award[]> {
  let data: string
  try {
    data = await fs.readFile(DATA_PATH, 'utf8')
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
  // If file exists but JSON is corrupt, throw instead of silently returning []
  return JSON.parse(data)
}

async function writeData(data: Award[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2))
}

export async function GET() {
  const awards = await readData()
  return NextResponse.json(awards)
}

export async function POST(req: NextRequest) {
  const newAward: Award = await req.json()
  const lines = Array.isArray(newAward.lines) ? newAward.lines : []
  const awards = await readData()

  // conflict detection: check if any line articulado already awarded
  for (const line of lines) {
    if (awards.some(a => a.lines.some(l => l.articuladoId === line.articuladoId))) {
      return NextResponse.json({ error: 'Line already awarded' }, { status: 409 })
    }
  }

  const safeAward = { ...newAward, lines }
  awards.push(safeAward)
  await writeData(awards)
  return NextResponse.json(safeAward, { status: 201 })
}
