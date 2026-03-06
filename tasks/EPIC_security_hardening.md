# EPIC: Security Hardening

## Objective

Eliminate all critical security vulnerabilities and establish authentication/authorization foundations. The system currently has an open email relay, path traversal vulnerability, and zero authentication — making it dangerous to expose on any network.

## Evidence

- BUG-010: Open email relay — arbitrary recipient/content accepted
- BUG-011: Path traversal via nodemailer attachments
- BUG-012: `params.id` ignored in send route — no RFQ validation
- ISSUE-009: Email endpoint architectural security failure
- ISSUE-015: No authentication or authorization anywhere
- IMP-006: Add NextAuth.js authentication
- IMP-013: Add rate limiting to sensitive endpoints

## Tasks

### BUG-010 / BUG-011 / BUG-012 / ISSUE-009 — Secure Email Endpoint

**Description:** `app/api/rfqs/[id]/send/route.ts` accepts arbitrary `to`, `subject`, `text`, and `attachments` from the request body with no validation. This enables:
- Sending spam/phishing through the company's SMTP server
- Exfiltrating server files via `attachments: [{ path: "/etc/passwd" }]`
- The `params.id` (RFQ ID) is completely ignored

**Steps to fix:**
1. **Remove arbitrary input acceptance.** The endpoint should load RFQ data from the database using `params.id` and construct the email itself:
```typescript
import { getDb } from '@/lib/db'
import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

// Singleton transporter
let transporter: nodemailer.Transporter | null = null
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  }
  return transporter
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Load RFQ from database
  const db = await getDb()
  const rfq = await db.request()
    .input('id', id)
    .query('SELECT id, project, supplier, dueDate FROM RFQs WHERE id = @id')

  if (!rfq.recordset.length) {
    return NextResponse.json({ error: 'RFQ not found' }, { status: 404 })
  }

  const rfqData = rfq.recordset[0]

  // Load supplier email from a Suppliers table (requires schema addition)
  // For now, accept only the custom message body from the request
  const { message } = await req.json()

  // Construct email from RFQ data — never accept 'to' from client
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to: rfqData.supplierEmail, // from database, NOT from request
    subject: `RFQ ${rfqData.id} - ${rfqData.project}`,
    text: message || `Pedido de proposta para ${rfqData.project}`,
    // NO attachments from client — generate from RFQ data if needed
  })

  return NextResponse.json({ success: true })
}
```
2. **Never pass client-provided `attachments` to nodemailer.** If attachments are needed, generate them server-side (e.g., PDF from RFQ data).
3. **Add authentication check** (once IMP-006 is complete) to ensure only authorized users can send emails.

**Effort:** 2-3 hours

---

### ISSUE-015 / IMP-006 — Add Authentication

**Description:** No endpoint requires authentication. Any network-adjacent client can read all data, create awards, upload files, and send emails.

**Steps to fix:**
1. Install NextAuth.js:
```bash
pnpm add next-auth
```
2. Create `app/api/auth/[...nextauth]/route.ts` with credentials provider (for internal tool, company LDAP/AD integration is ideal; for MVP, simple credentials)
3. Create auth middleware in `middleware.ts`:
```typescript
export { default } from 'next-auth/middleware'
export const config = {
  matcher: ['/api/:path*', '/((?!api/auth|_next/static|_next/image|favicon.ico).*)']
}
```
4. Add session provider wrapper in `app/layout.tsx`
5. Update all API routes to check session:
```typescript
import { getServerSession } from 'next-auth'
// In each route handler:
const session = await getServerSession()
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**Effort:** 4-6 hours for MVP credentials auth. 1-2 days for AD/LDAP integration.

**Dependencies:** None — can be done in parallel with other Phase 2 work.

---

### IMP-013 — Add Rate Limiting

**Description:** Email send and file upload endpoints have no rate limiting. Even with authentication, a compromised or malicious account could abuse these endpoints.

**Steps to fix:**
1. Install a rate limiting library:
```bash
pnpm add rate-limiter-flexible
```
2. Create `lib/rate-limit.ts`:
```typescript
import { RateLimiterMemory } from 'rate-limiter-flexible'

export const emailLimiter = new RateLimiterMemory({
  points: 10,    // 10 emails
  duration: 3600 // per hour
})

export const uploadLimiter = new RateLimiterMemory({
  points: 20,    // 20 uploads
  duration: 3600 // per hour
})
```
3. Apply in email and upload route handlers before processing

**Effort:** 1-2 hours

**Dependencies:** IMP-006 (auth) should be in place first so rate limits are per-user.

---

## Expected Impact

After completing this epic:
- The email endpoint cannot be used as a spam relay or for file exfiltration
- All routes require authentication — no anonymous access
- Sensitive operations (email, upload) are rate-limited
- The system is safe to deploy on an internal network
- Foundation is laid for FEAT-015 (Role-Based Access Control)
