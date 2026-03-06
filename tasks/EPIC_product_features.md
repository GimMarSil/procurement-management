# EPIC: Product Features

## Objective

Deliver new capabilities that transform the system from a basic CRUD tool into a comprehensive procurement management platform. These features address real operational needs for Ramos Ferreira's multi-country operations: approval workflows, multi-currency, ERP integration, reporting, and supplier collaboration.

## Evidence

- FEAT-001: Real-time notifications
- FEAT-002: PDF report generation
- FEAT-003: PHC ERP integration
- FEAT-004: Supplier portal
- FEAT-005: Approval workflows for awards
- FEAT-006: Document management
- FEAT-007: Analytics dashboard with real data
- FEAT-008: Multi-currency support (EUR/AOA/MZN)
- FEAT-009: Enhanced audit trail UI
- FEAT-010: Budget tracking per project
- FEAT-011: Email templates for RFQ distribution
- FEAT-014: Excel export for comparatives and awards
- FEAT-015: Role-based access control

## Tasks

### FEAT-011 — Email Templates for RFQ Distribution

**Description:** Replace the open relay with structured email templates. When sending an RFQ, the system should generate a professional email from RFQ data with standardized formatting, company branding, and attached line items.

**Specification:**
- Template stored in `lib/email-templates/rfq-request.ts`
- Variables: project name, supplier name, due date, line items table, contact info
- Support HTML + plain text versions
- Attachments: auto-generated Excel with RFQ lines (uses existing `xlsx` dependency)

**Technical approach:**
1. Create email template engine using template literals or a lightweight lib like `mjml`
2. Generate Excel attachment from RFQ lines using `xlsx`
3. Endpoint loads RFQ data from DB, renders template, sends via nodemailer
4. No client-provided email content — everything derived from data

**Dependencies:** EPIC_security_hardening (secure email endpoint), EPIC_data_architecture (complete schema)

**Effort:** 1-2 days

---

### FEAT-014 — Excel Export for Comparatives and Awards

**Description:** Users need to export comparative matrices and award summaries as Excel files for stakeholder review, filing, and PHC integration.

**Specification:**
- Export comparative matrix: one sheet with articulado lines as rows, suppliers as columns, prices in cells
- Export award summary: header sheet + line details + supplier breakdown
- Download triggered by "Exportar" buttons (currently dead-end)

**Technical approach:**
1. Create `app/api/export/comparativo/route.ts`:
```typescript
import * as XLSX from 'xlsx'

export async function GET(req: NextRequest) {
  // Fetch comparative data from DB
  // Build workbook with xlsx
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="comparativo.xlsx"',
    },
  })
}
```
2. Create similar endpoint for awards export
3. Wire "Exportar" buttons to trigger downloads

**Dependencies:** EPIC_data_architecture (data must be in SQL Server)

**Effort:** 1 day

---

### FEAT-002 — PDF Report Generation

**Description:** Generate professional PDF reports for comparative analyses and award documents. Required for formal procurement approvals and archiving.

**Specification:**
- Comparative PDF: cover page, matrix table, supplier ranking, recommended scenario
- Award PDF: award details, line breakdown, supplier allocation, signature blocks
- Company branding: Ramos Ferreira logo, header/footer

**Technical approach:**
1. Install `@react-pdf/renderer` or `puppeteer` for PDF generation
2. Create React components for PDF layouts in `lib/pdf-templates/`
3. Server-side rendering via API routes
4. Return PDF as downloadable response

**Dependencies:** EPIC_data_architecture

**Effort:** 2-3 days

---

### FEAT-015 — Role-Based Access Control

**Description:** Different users need different permissions: buyers create RFQs, managers approve awards, admins manage settings.

**Specification:**
- Roles: `admin`, `buyer`, `approver`, `viewer`
- Permissions matrix:

| Action | admin | buyer | approver | viewer |
|---|---|---|---|---|
| View data | Y | Y | Y | Y |
| Create RFQ | Y | Y | N | N |
| Upload response | Y | Y | N | N |
| Create award | Y | Y | N | N |
| Approve award | Y | N | Y | N |
| Send email | Y | Y | N | N |
| Manage settings | Y | N | N | N |

**Technical approach:**
1. Add `role` column to Users table
2. Create `lib/auth/permissions.ts` with role-permission mapping
3. Add middleware check on protected routes:
```typescript
function requireRole(...roles: string[]) {
  return async (req: NextRequest) => {
    const session = await getServerSession()
    if (!session || !roles.includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }
}
```
4. Apply to route handlers

**Dependencies:** IMP-006 (NextAuth.js authentication from EPIC_security_hardening)

**Effort:** 1-2 days

---

### FEAT-005 — Approval Workflows

**Description:** Awards have statuses `Criada -> Aprovada -> Executada` but no workflow to transition between them. Currently, status is set to "Criada" and never changes.

**Specification:**
- Buyer creates award (status: "Criada")
- Approver reviews and approves/rejects (status: "Aprovada" or back to "Criada" with comments)
- Admin marks as executed after PO is issued (status: "Executada")
- Email notifications on status changes
- Audit log for every transition

**Technical approach:**
1. Create `app/api/adjudicacoes/[id]/approve/route.ts`
2. Create `app/api/adjudicacoes/[id]/execute/route.ts`
3. Add approval UI to adjudicacoes page (currently buttons exist but do nothing)
4. State machine validation: only valid transitions allowed
5. Log every transition via audit system

**Dependencies:** FEAT-015 (RBAC), EPIC_data_architecture (awards in SQL Server)

**Effort:** 2-3 days

---

### FEAT-008 — Multi-Currency Support

**Description:** Ramos Ferreira operates in Angola (AOA), Mozambique (MZN), Portugal (EUR), and Ghana (GHS). Suppliers may quote in different currencies. The comparative matrix needs to normalize to a single currency for comparison.

**Specification:**
- Each project has a base currency
- Supplier responses include their quoted currency
- Exchange rates stored in a `CurrencyRates` table (manually updated or API-fetched)
- Comparative matrix shows both original and converted prices
- Award totals in project base currency

**Technical approach:**
1. Add `currency` column to Projects, SupplierResponses
2. Create `CurrencyRates` table
3. Create `lib/currency.ts` conversion utility
4. Update comparative calculation to normalize prices
5. Display dual prices in UI: "€1,317.11 (AOA 789,066)"

**Dependencies:** EPIC_data_architecture

**Effort:** 2-3 days

---

### FEAT-010 — Budget Tracking

**Description:** Link awards to project budgets for spend visibility. Track planned vs. committed vs. executed spend.

**Specification:**
- Projects have budget allocations per family/category
- Award creation deducts from available budget
- Dashboard shows: total budget, committed (awarded), executed, remaining
- Alert when award would exceed budget

**Technical approach:**
1. Add `ProjectBudgets` table with per-category allocations
2. Compute committed spend from Awards table
3. Add budget widget to project detail page
4. Pre-award validation: warn if over budget

**Dependencies:** FEAT-005 (approval workflow), EPIC_data_architecture

**Effort:** 2-3 days

---

### FEAT-007 — Analytics Dashboard with Real Data

**Description:** The system has Recharts installed and a partial analytics page. Connect it to real data for operational insights.

**Specification:**
- Spend by supplier (bar chart)
- Spend by project (bar chart)
- RFQ pipeline: pending/responded/awarded (funnel)
- Average response time by supplier
- Price variance across suppliers for same items

**Technical approach:**
1. Create `app/api/analytics/route.ts` with aggregation queries
2. Update analytics page to fetch real data instead of mocks
3. Use existing Recharts dependency

**Dependencies:** EPIC_data_architecture (all data in SQL Server for efficient aggregation)

**Effort:** 1-2 days

---

### FEAT-003 — PHC ERP Integration

**Description:** The settings page has a PHC connection panel with a fake "Conectado" badge. Ramos Ferreira uses PHC ERP for accounting. Awards should sync to PHC as purchase orders.

**Specification:**
- PHC API connection configuration in settings (actually persisted)
- Award → PHC Purchase Order sync on "Executada" status
- Articulado import from PHC project data
- Supplier master data sync

**Technical approach:**
1. Research PHC API documentation (REST or SOAP)
2. Create `lib/integrations/phc.ts` client
3. Create `app/api/integrations/phc/sync/route.ts`
4. Add sync status tracking in database
5. Error handling with retry logic

**Dependencies:** FEAT-005 (award workflow — sync triggers on "Executada"), EPIC_data_architecture

**Effort:** 3-5 days (depends on PHC API complexity)

---

### FEAT-006 — Document Management

**Description:** Attach technical specifications, drawings, certificates, and other documents to RFQ lines, supplier responses, and awards.

**Specification:**
- Upload documents linked to articulado lines, RFQs, or responses
- File types: PDF, DWG, DOCX, images
- Storage: local filesystem or cloud (S3/Azure Blob)
- Documents included as email attachments when sending RFQs

**Technical approach:**
1. Create `Documents` table with polymorphic reference (entityType + entityId)
2. Create upload/download API endpoints
3. Add document panels to relevant pages
4. Integrate with email system for RFQ attachments

**Dependencies:** EPIC_security_hardening (auth), EPIC_data_architecture

**Effort:** 2-3 days

---

### FEAT-009 — Enhanced Audit Trail UI

**Description:** The logs page (`app/logs/page.tsx`) is a basic table. Enhance with filtering, search, user attribution, and action-specific detail views.

**Specification:**
- Filter by: user, action type, date range
- Search in details text
- Expandable rows for full detail JSON
- Export audit log as CSV

**Technical approach:**
1. Fix audit system first (EPIC_critical_fixes BUG-002/003)
2. Add query parameters to `/api/logs` for filtering
3. Enhance `app/logs/page.tsx` with filter UI components
4. Add CSV export endpoint

**Dependencies:** EPIC_critical_fixes (audit must work), EPIC_data_architecture (logs in SQL Server)

**Effort:** 1 day

---

### FEAT-004 — Supplier Portal

**Description:** External-facing portal where suppliers can view RFQs, submit responses, and track award status — eliminating the email+Excel roundtrip.

**Specification:**
- Separate auth flow for suppliers (token-based links or supplier credentials)
- Supplier sees only their RFQs
- Online response form replacing Excel upload
- Status tracking: submitted, under review, awarded/not awarded

**Technical approach:**
1. Create supplier auth system (separate from internal NextAuth)
2. Create `/supplier/` route group with dedicated layout
3. API endpoints scoped to authenticated supplier
4. Notification emails when new RFQ assigned or award decision made

**Dependencies:** FEAT-015 (RBAC), EPIC_security_hardening, EPIC_data_architecture

**Effort:** 5-7 days (major feature)

---

### FEAT-001 — Real-Time Notifications

**Description:** Notify users when relevant events occur: new supplier response, award pending approval, RFQ due date approaching.

**Specification:**
- In-app notification bell with unread count
- Email notifications for critical events
- Configurable per-user preferences

**Technical approach:**
1. Create `Notifications` table
2. Server-sent events (SSE) or polling for in-app updates
3. Create notification service that triggers on key events
4. Add notification UI component in header

**Dependencies:** IMP-006 (auth — notifications are per-user), EPIC_data_architecture

**Effort:** 2-3 days

---

## Expected Impact

After completing this epic:
- Procurement workflow is end-to-end: articulado → RFQ → response → comparison → award → approval → PO
- Multi-country operations are supported with proper currency handling
- Stakeholders get professional PDF/Excel reports for decision-making
- PHC integration eliminates double data entry
- Supplier portal reduces procurement cycle time
- Analytics provide operational visibility across projects
- Role-based access ensures proper separation of duties
