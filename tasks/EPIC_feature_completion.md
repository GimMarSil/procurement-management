# EPIC: Feature Completion

## Objective

Complete all partially implemented features. The system has numerous UI flows with working interfaces but non-functional backends (console.log stubs, mock data, broken buttons). This epic bridges every dead-end into a working feature, making the existing UI actually do what it promises.

## Evidence

- ISSUE-005: Mock data masquerading as production code
- ISSUE-007: Dead-end API stubs returning `{ ok: true }`
- ISSUE-013: Two disconnected RFQ creation flows
- BUG-016: `handleSupplierProposal` replaces scenario instead of merging
- BUG-017: Cannot deselect lines in comparative matrix
- BUG-019: No double-submit protection on award creation
- BUG-020: CreateRFQForm.handleCreateRFQ is console.log only
- BUG-021: MappingEditor.saveMappings is console.log only
- BUG-023: createRfq resets form before confirming success
- BUG-028: selectAll checkbox desyncs with filter changes
- BUG-034: Hardcoded projectId "92114" in award creation
- BUG-036: Hardcoded KPI value "125.4K" in articulado page

## Tasks

### BUG-020 / ISSUE-013 — Implement Articulado-to-RFQ Creation

**Description:** The `CreateRFQForm` in `app/articulado/page.tsx:261` logs to console and closes the modal. This is the primary workflow — selecting articulado lines and creating an RFQ for a supplier. It does nothing.

**Steps to fix:**
1. Connect the form to the existing `/api/rfqs` POST endpoint:
```typescript
const handleCreateRFQ = async () => {
  if (!supplier || !dueDate) return

  const res = await fetch('/api/rfqs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project: selectedLines[0]?.projectId || '',
      supplier,
      dueDate,
      lines: selectedLines.map(line => ({
        description: line.description,
        quantity: line.plannedQuantity,
        articuladoId: line.id,
      })),
    }),
  })

  if (res.ok) {
    onClose()
    // Optionally navigate to /rfqs or show success toast
  } else {
    const err = await res.json()
    alert(err.error || 'Failed to create RFQ')
  }
}
```

2. Note: This requires the `/api/rfqs` POST to accept `articuladoId` in lines — update the RFQLines schema and insert query accordingly.

3. Remove the hardcoded supplier list. Fetch suppliers from a `/api/suppliers` endpoint or from the database.

**Effort:** 2-3 hours

**Dependencies:** BUG-001 must be fixed (database connection). EPIC_data_architecture schema should include `articuladoId` in RFQLines.

---

### BUG-021 — Implement Mapping Save

**Description:** The `MappingEditor` in `app/respostas/page.tsx:343` logs to console and closes. Users carefully map supplier items to articulado lines, then lose all work.

**Steps to fix:**
1. Create API endpoint `app/api/responses/[id]/mappings/route.ts`:
```typescript
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { mappings } = await req.json()
  // mappings: { [itemId: string]: string[] } — item ID to articulado IDs

  const db = await getDb()
  const transaction = new sql.Transaction(db)
  await transaction.begin()

  try {
    for (const [itemId, articuladoIds] of Object.entries(mappings)) {
      // Delete existing mappings for this item
      await new sql.Request(transaction)
        .input('itemId', parseInt(itemId))
        .query('DELETE FROM ResponseItemMappings WHERE responseItemId = @itemId')

      // Insert new mappings
      for (const artId of articuladoIds as string[]) {
        await new sql.Request(transaction)
          .input('itemId', parseInt(itemId))
          .input('artId', artId)
          .query('INSERT INTO ResponseItemMappings (responseItemId, articuladoId) VALUES (@itemId, @artId)')
      }
    }
    await transaction.commit()
    return NextResponse.json({ success: true })
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}
```

2. Update `saveMappings` in the component to call this endpoint.

**Effort:** 2-3 hours

**Dependencies:** EPIC_data_architecture (ResponseItemMappings table must exist).

---

### ISSUE-005 / ISSUE-007 — Replace Mock Data with API Calls

**Description:** Multiple pages use hardcoded mock data:
- `app/respostas/page.tsx` — mock supplier responses
- `app/pedidos/page.tsx` — mock RFQ list
- `app/comparativo/page.tsx` — mock comparative matrix
- `app/projects/[id]/page.tsx` — mock project details

The three API stubs (`/api/rfqs/send`, `/api/responses/receive`, `/api/awards/create`) return `{ ok: true }` without doing anything.

**Steps to fix:**
1. **Respostas page:** Replace mock `responses` array with `useEffect` fetch from `/api/responses` (new endpoint)
2. **Pedidos page:** Replace mock `rfqs` with fetch from `/api/rfqs` (already exists)
3. **Comparativo page:** Replace mock matrix with fetch from `/api/comparativo` (new endpoint, see EPIC_api_reliability IMP-008)
4. **Project detail page:** Fetch from `/api/projects/[id]` (new endpoint)
5. **API stubs:** Either implement real logic or delete. If not ready, mark clearly:
```typescript
// TODO: Not implemented — stub only
export async function POST(req: Request) {
  return NextResponse.json(
    { error: 'Not implemented' },
    { status: 501 }
  )
}
```

**Effort:** 2-3 days (creating all new API endpoints + updating pages)

**Dependencies:** EPIC_data_architecture (complete schema) and EPIC_critical_fixes (working db.ts).

---

### BUG-016 — Fix Scenario Merge in Comparative

**Description:** `handleSupplierProposal` at `app/comparativo/page.tsx:194-203` creates a new object with only the selected supplier's lines, then replaces the entire scenario. Prior selections for other suppliers are lost.

**Steps to fix:**
```typescript
const handleSupplierProposal = (supplier: string) => {
  setSelectedScenario((prev) => {
    const updated = { ...prev }
    articuladoLines.forEach((line) => {
      const supplierData = comparativeMatrix[line.id]?.[supplier]
      if (supplierData?.available) {
        updated[line.id] = supplier
      }
    })
    return updated
  })
}
```

This merges the supplier's available lines INTO the existing scenario rather than replacing it.

**Effort:** 15 minutes

---

### BUG-017 — Enable Line Deselection in Comparative

**Description:** `handleLineSelection` at `app/comparativo/page.tsx:187-192` always sets the supplier for a line. Clicking the same supplier again should deselect it.

**Steps to fix:**
```typescript
const handleLineSelection = (lineId: string, supplier: string) => {
  setSelectedScenario((prev) => {
    if (prev[lineId] === supplier) {
      // Deselect: remove this line from scenario
      const { [lineId]: _, ...rest } = prev
      return rest
    }
    return { ...prev, [lineId]: supplier }
  })
}
```

**Effort:** 10 minutes

---

### BUG-019 — Add Double-Submit Protection to Award Creation

**Description:** The "Criar Adjudicacao" button in `AwardCreator` has no loading state. Double-clicking creates duplicate awards.

**Steps to fix:**
```typescript
function AwardCreator({ ... }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createAward = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      // ... existing award creation logic
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // ...
    <Button onClick={createAward} disabled={conflict || isSubmitting}>
      {isSubmitting ? 'A criar...' : 'Criar Adjudicacao'}
    </Button>
  )
}
```

**Effort:** 15 minutes

---

### BUG-023 — Fix Form Reset on RFQ Creation Failure

**Description:** In `app/rfqs/page.tsx:61-73`, the form is cleared before checking if the POST succeeded. If the API fails, the user loses all input.

**Steps to fix:**
```typescript
const createRfq = async () => {
  const res = await fetch("/api/rfqs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project, supplier, dueDate, lines }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    alert(err.error || 'Failed to create RFQ')
    return
  }

  // Only reset on success
  setProject("")
  setSupplier("")
  setDueDate("")
  setLines([{ description: "", quantity: 1 }])
  setShowNewRFQModal(false)
  fetchRfqs()
}
```

**Effort:** 10 minutes

---

### BUG-028 — Fix selectAll/Filter Desync

**Description:** In `app/articulado/page.tsx:62-69`, "Select All" selects all visible filtered lines. If the user changes the filter, the checkbox remains checked but selected IDs include non-visible items.

**Steps to fix:**
```typescript
// Reset selectAll when filter changes
useEffect(() => {
  setSelectAll(false)
}, [searchTerm, familyFilter])
```

**Effort:** 5 minutes

---

### BUG-034 — Remove Hardcoded projectId

**Description:** `app/comparativo/page.tsx:587` hardcodes `projectId: "92114"`. Every award is tagged with this project regardless of context.

**Steps to fix:**
1. Accept `projectId` as a route parameter or derive it from the articulado lines:
```typescript
const award: AwardType = {
  id: `award-${Date.now()}`,
  projectId: articuladoLines[0]?.projectId || '',
  // ...
}
```
2. Better: make the comparative page project-aware via URL param: `/comparativo?project=92114`

**Effort:** 30 minutes

---

### BUG-036 — Remove Hardcoded KPI Value

**Description:** `app/articulado/page.tsx:146` shows "125.4K" as "Valor Estimado" regardless of actual data.

**Steps to fix:**
```typescript
// Replace static value with computed value
// If no price data available, show a dash or "N/A"
<div className="text-2xl font-bold">
  {selectedLines.length > 0 ? `${selectedLines.length} linhas` : '-'}
</div>
<p className="text-xs text-muted-foreground">Valor selecionado</p>
```

Or, if estimated value should come from the database, fetch it from the API.

**Effort:** 10 minutes

---

## Expected Impact

After completing this epic:
- The articulado→RFQ creation workflow actually creates RFQs in the database
- Supplier response mappings are persisted — users don't lose their work
- The comparative page can merge supplier proposals and allow deselection
- No hardcoded values — all data comes from the database or user input
- Dead-end buttons either work or are clearly marked as unimplemented
- The system transitions from "demo" to "functional prototype"
