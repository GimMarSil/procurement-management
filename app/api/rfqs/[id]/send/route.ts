import nodemailer from 'nodemailer'
import path from 'path'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// Allowed attachment directory (only files uploaded to the project)
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads')

// Allowed recipient domains (configure via env or extend as needed)
const ALLOWED_DOMAINS = (process.env.EMAIL_ALLOWED_DOMAINS || '').split(',').filter(Boolean)

function isAllowedRecipient(email: string): boolean {
  if (ALLOWED_DOMAINS.length === 0) return true // no restriction configured
  const domain = email.split('@')[1]?.toLowerCase()
  return ALLOWED_DOMAINS.some((d) => d.trim().toLowerCase() === domain)
}

function sanitizeAttachments(
  attachments: Array<{ filename?: string; path?: string }> | undefined
): Array<{ filename: string; path: string }> {
  if (!attachments || !Array.isArray(attachments)) return []

  return attachments
    .filter((a) => a.path && typeof a.path === 'string')
    .map((a) => {
      const resolved = path.resolve(UPLOADS_DIR, path.basename(a.path!))
      // Block path traversal: resolved path must be inside UPLOADS_DIR
      if (!resolved.startsWith(UPLOADS_DIR)) {
        throw new Error(`Attachment path not allowed: ${a.path}`)
      }
      return { filename: a.filename || path.basename(resolved), path: resolved }
    })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Validate RFQ exists
  const pool = await getDb()
  const rfqResult = await pool.request().input('id', id).query('SELECT Id FROM RFQs WHERE Id = @id')
  if (rfqResult.recordset.length === 0) {
    return NextResponse.json({ error: 'RFQ not found' }, { status: 404 })
  }

  const body = await req.json()
  const { to, subject, text, attachments } = body

  // Validate required fields
  if (!to || typeof to !== 'string' || !subject || typeof subject !== 'string') {
    return NextResponse.json({ error: 'Missing required fields: to, subject' }, { status: 400 })
  }

  // Validate recipient
  const recipients = to.split(',').map((e: string) => e.trim()).filter(Boolean)
  if (recipients.length === 0 || recipients.length > 10) {
    return NextResponse.json({ error: 'Invalid recipients (1-10 allowed)' }, { status: 400 })
  }
  for (const r of recipients) {
    if (!r.includes('@') || !isAllowedRecipient(r)) {
      return NextResponse.json({ error: `Recipient not allowed: ${r}` }, { status: 403 })
    }
  }

  // Sanitize attachments (block path traversal)
  let safeAttachments: Array<{ filename: string; path: string }> = []
  try {
    safeAttachments = sanitizeAttachments(attachments)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Invalid attachment'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  // Limit subject/text length
  const safeSubject = String(subject).slice(0, 500)
  const safeText = String(text || '').slice(0, 50000)

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: recipients.join(', '),
    subject: safeSubject,
    text: safeText,
    attachments: safeAttachments,
  })

  return NextResponse.json({ success: true })
}
