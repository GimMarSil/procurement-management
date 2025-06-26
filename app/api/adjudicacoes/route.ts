import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { Award } from '@/types/procurement'

const DATA_PATH = path.join(process.cwd(), 'data', 'awards.json')

async function readData(): Promise<Award[]> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
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
  const awards = await readData()

  // conflict detection: check if any line articulado already awarded
  for (const line of newAward.lines) {
    if (awards.some(a => a.lines.some(l => l.articuladoId === line.articuladoId))) {
      return NextResponse.json({ error: 'Line already awarded' }, { status: 409 })
    }
  }

  awards.push(newAward)
  await writeData(awards)
  return NextResponse.json(newAward, { status: 201 })
}
