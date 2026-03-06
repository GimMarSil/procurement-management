# EPIC: API Reliability & Robustness

## Objective

Transform the API layer from fragile, unvalidated routes into a robust, consistent backend with proper validation, error handling, transactions, and server-side business logic. Currently, routes lack input validation, error handling is inconsistent (only 1 of 7 routes has try/catch), and multi-table writes are not transactional.

## Evidence

- ISSUE-008: No input validation despite Zod being installed
- ISSUE-010: Non-transactional multi-table writes
- ISSUE-011: Inconsistent error handling across API routes
- ISSUE-004: Business logic embedded in React components
- IMP-002: Implement Zod schemas for all API routes
- IMP-003: Extract business logic into server-side service layer
- IMP-004: Wrap multi-table writes in SQL transactions
- IMP-005: Add centralized error handling middleware
- IMP-008: Move comparative matrix computation server-side
- BUG-004: No error handling in RFQ POST
- BUG-005: Destructuring default doesn't protect against null
- BUG-013: No file size/type validation on Excel upload
- BUG-022: fetchRfqs doesn't check res.ok
- BUG-027: No sheet validation on Excel upload

## Tasks

### ISSUE-008 / IMP-002 — Implement Zod Validation

**Description:** `zod: ^3.24.1` is installed but never imported. All API routes accept raw `await req.json()` with no schema validation, trusting client input blindly.

**Steps to fix:**

1. Create `lib/schemas.ts` with Zod schemas for each entity:
```typescript
import { z } from 'zod'

export const createRfqSchema = z.object({
  project: z.string().min(1, 'Project is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  lines: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().int().positive(),
  })).default([]),
})

export const createAwardSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  awardDate: z.string(),
  lines: z.array(z.object({
    id: z.string(),
    articuladoId: z.string(),
    supplier: z.string(),
    responseItemId: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().min(0),
    totalPrice: z.number().min(0),
  })).min(1, 'At least one line required'),
  totalValue: z.number().min(0),
  status: z.enum(['Criada', 'Aprovada', 'Executada']),
})

export const sendEmailSchema = z.object({
  message: z.string().optional(),
})
```

2. Apply validation in each route handler:
```typescript
export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = createRfqSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }
  const { project, supplier, dueDate, lines } = parsed.data
  // ... proceed with validated data
}
```

**Effort:** 3-4 hours

---

### ISSUE-010 / IMP-004 / BUG-004 — Add SQL Transactions

**Description:** `app/api/rfqs/route.ts` POST inserts an RFQ header then loops to insert lines without a transaction. If a line insert fails, the header remains orphaned with no cleanup.

**Steps to fix:**

1. Wrap multi-table writes in transactions:
```typescript
export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = createRfqSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { project, supplier, dueDate, lines } = parsed.data
  const db = await getDb()
  const transaction = new sql.Transaction(db)

  try {
    await transaction.begin()

    const rfqResult = await new sql.Request(transaction)
      .input('project', sql.NVarChar(255), project)
      .input('supplier', sql.NVarChar(255), supplier)
      .input('dueDate', sql.Date, dueDate)
      .query('INSERT INTO RFQs (project, supplier, dueDate) OUTPUT INSERTED.id VALUES (@project, @supplier, @dueDate)')

    const rfqId = rfqResult.recordset[0].id

    for (const line of lines) {
      await new sql.Request(transaction)
        .input('rfqId', sql.Int, rfqId)
        .input('description', sql.NVarChar(255), line.description)
        .input('quantity', sql.Int, line.quantity)
        .query('INSERT INTO RFQLines (rfqId, description, quantity) VALUES (@rfqId, @description, @quantity)')
    }

    await transaction.commit()
    return NextResponse.json({ id: rfqId }, { status: 201 })
  } catch (err) {
    await transaction.rollback()
    console.error('RFQ creation failed:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

2. Apply same pattern to award creation (once migrated to SQL Server) and upload route.

**Effort:** 2-3 hours

---

### ISSUE-011 / IMP-005 — Centralized Error Handling

**Description:** Only `/api/articulado` has try/catch. All other routes let exceptions propagate as raw 500 errors with stack traces.

**Steps to fix:**

1. Create `lib/api-handler.ts` utility:
```typescript
import { NextRequest, NextResponse } from 'next/server'

type Handler = (req: NextRequest, context?: any) => Promise<NextResponse>

export function withErrorHandling(handler: Handler): Handler {
  return async (req, context) => {
    try {
      return await handler(req, context)
    } catch (error) {
      console.error(`[API Error] ${req.method} ${req.url}:`, error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}
```

2. Wrap all route handlers:
```typescript
export const POST = withErrorHandling(async (req) => {
  // ... route logic
})
```

**Effort:** 1-2 hours

---

### BUG-013 / BUG-027 — Harden Excel Upload

**Description:** `app/api/rfqs/[id]/upload/route.ts` has no file size limit (OOM risk), no content type check, and no sheet validation. An empty workbook or a 1GB file would crash the server.

**Steps to fix:**
```typescript
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 })
  }

  // Size limit: 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 })
  }

  // Type check
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]
  if (!allowedTypes.includes(file.type)) {
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

  // ... proceed with validated data
}
```

**Effort:** 1 hour

---

### BUG-022 — Fix Missing res.ok Check in RFQ Page

**Description:** `app/rfqs/page.tsx:41-45` calls `res.json()` without checking `res.ok`. If the API returns an error, the error body gets set as the RFQ list.

**Steps to fix:**
```typescript
const fetchRfqs = async () => {
  const res = await fetch("/api/rfqs")
  if (!res.ok) {
    console.error('Failed to fetch RFQs:', res.status)
    return
  }
  const data = await res.json()
  setRfqs(data)
}
```

**Effort:** 10 minutes

---

### ISSUE-004 / IMP-003 / IMP-008 — Extract Server-Side Business Logic

**Description:** `app/comparativo/page.tsx` (695 lines) contains all comparative matrix calculations, supplier totaling, price comparison, and award creation logic in a client-side React component. This makes the logic untestable, non-reusable, and forces all data to be sent to the client.

**Steps to fix:**
1. Create `app/api/comparativo/route.ts` — serves the comparative matrix data from the database
2. Create `lib/services/comparative.ts` — pure functions for price comparison, supplier ranking, scenario validation
3. Create `app/api/comparativo/award/route.ts` — handles award creation server-side
4. Reduce `app/comparativo/page.tsx` to a presentation component that fetches pre-computed data

**Effort:** 1-2 days

**Dependencies:** EPIC_data_architecture must be complete (SupplierResponses table, etc.)

---

## Expected Impact

After completing this epic:
- All API inputs are validated with Zod — malformed requests return 400 with actionable error messages
- Multi-table writes are atomic — no more orphaned records
- All routes have consistent error handling — no raw stack traces in production
- File uploads are size-limited and type-checked
- Business logic is testable independently of React components
- Client-side code is simplified to presentation layer
