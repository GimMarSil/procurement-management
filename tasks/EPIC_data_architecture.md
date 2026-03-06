# EPIC: Data Architecture Unification

## Objective

Consolidate all data storage into SQL Server, eliminate the fragmented storage model (SQL Server + SQLite + JSON files), establish a complete schema with migration tooling, and ensure referential integrity across the procurement domain.

## Evidence

- ISSUE-001: Three incompatible storage backends
- ISSUE-006: Incomplete SQL schema coverage
- ISSUE-014: JSON file storage for critical award data
- IMP-001: Unify all data in SQL Server
- IMP-014: Add database migration tooling
- BUG-008: Upload targets non-existent `SupplierResponses` table

## Tasks

### ISSUE-001 / IMP-001 — Unify Storage in SQL Server

**Description:** The system currently uses:
- **SQL Server** for RFQs and articulado lines
- **SQLite** (`logs.db`) for audit logs
- **JSON file** (`data/awards.json`) for awards

This creates three isolated data islands with no referential integrity, no shared transactions, and different failure modes.

**Steps to fix:**

1. **Design the complete SQL Server schema** (see ISSUE-006 below for full schema)

2. **Migrate awards from JSON to SQL Server:**
```sql
CREATE TABLE Awards (
  id NVARCHAR(50) PRIMARY KEY,
  projectId NVARCHAR(50) NOT NULL,
  awardDate DATE NOT NULL,
  totalValue DECIMAL(18,2) NOT NULL,
  status NVARCHAR(20) NOT NULL DEFAULT 'Criada',
  createdAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE AwardLines (
  id NVARCHAR(50) PRIMARY KEY,
  awardId NVARCHAR(50) NOT NULL REFERENCES Awards(id) ON DELETE CASCADE,
  articuladoId NVARCHAR(50) NOT NULL,
  supplier NVARCHAR(255) NOT NULL,
  responseItemId NVARCHAR(50),
  quantity INT NOT NULL,
  unitPrice DECIMAL(18,2) NOT NULL,
  totalPrice DECIMAL(18,2) NOT NULL
);
```

3. **Rewrite `app/api/adjudicacoes/route.ts`** to use `getDb()` instead of `fs.readFile`/`fs.writeFile`:
```typescript
import { getDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const db = await getDb()
  const result = await db.request().query(`
    SELECT a.*, al.id AS lineId, al.articuladoId, al.supplier,
           al.responseItemId, al.quantity, al.unitPrice, al.totalPrice
    FROM Awards a
    LEFT JOIN AwardLines al ON al.awardId = a.id
    ORDER BY a.id
  `)
  // Group into award objects (similar pattern to RFQ GET)
  // ...
  return NextResponse.json(awards)
}

export async function POST(req: NextRequest) {
  const db = await getDb()
  const transaction = db.transaction()
  try {
    await transaction.begin()
    // Insert award header + lines within transaction
    await transaction.commit()
    return NextResponse.json(award, { status: 201 })
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}
```

4. **Migrate audit logs from SQLite to SQL Server:**
```sql
CREATE TABLE Logs (
  id INT IDENTITY(1,1) PRIMARY KEY,
  timestamp DATETIME NOT NULL,
  [user] NVARCHAR(255) NOT NULL,
  action NVARCHAR(100) NOT NULL,
  details NVARCHAR(MAX) NOT NULL
);
```

5. **Rewrite `lib/audit.ts`** to use `getDb()`:
```typescript
import { getDb } from './db'

export async function logAction(user: string, action: string, details: string) {
  const db = await getDb()
  await db.request()
    .input('timestamp', new Date())
    .input('user', user)
    .input('action', action)
    .input('details', details)
    .query('INSERT INTO Logs (timestamp, [user], action, details) VALUES (@timestamp, @user, @action, @details)')
}

export async function getLogs() {
  const db = await getDb()
  const result = await db.request()
    .query('SELECT timestamp, [user], action, details FROM Logs ORDER BY id DESC')
  return result.recordset
}
```

6. **Remove dependencies:**
   - Remove `better-sqlite3` from `package.json` (or don't add it if using Phase 1 Option A temporarily)
   - Delete `data/awards.json` and `data/` directory
   - Delete `logs.db` file
   - Add migration script for existing JSON data

**Effort:** 1-2 days

---

### ISSUE-006 / BUG-008 — Complete SQL Schema

**Description:** `sql/schema.sql` only defines `RFQs` and `RFQLines`. Missing tables: `ArticuladoLines` (queried by `/api/articulado`), `SupplierResponses` (referenced by upload route), `Suppliers`.

**Steps to fix:**

1. Create complete schema file `sql/schema.sql`:
```sql
-- Projects
CREATE TABLE Projects (
  id NVARCHAR(50) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  country NVARCHAR(10) NOT NULL, -- AO, MZ, PT, GH
  status NVARCHAR(50) NOT NULL DEFAULT 'Ativo',
  createdAt DATETIME DEFAULT GETDATE()
);

-- Articulado (Bill of Quantities)
CREATE TABLE ArticuladoLines (
  id NVARCHAR(50) PRIMARY KEY,
  projectId NVARCHAR(50) NOT NULL REFERENCES Projects(id),
  familyProduct NVARCHAR(255) NOT NULL,
  description NVARCHAR(MAX) NOT NULL,
  unit NVARCHAR(20) NOT NULL,
  plannedQuantity INT NOT NULL,
  code NVARCHAR(100),
  observations NVARCHAR(MAX)
);

-- Suppliers
CREATE TABLE Suppliers (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  email NVARCHAR(255),
  country NVARCHAR(10),
  active BIT NOT NULL DEFAULT 1
);

-- RFQs (existing, extended)
CREATE TABLE RFQs (
  id INT IDENTITY(1,1) PRIMARY KEY,
  projectId NVARCHAR(50) REFERENCES Projects(id),
  project NVARCHAR(255) NOT NULL,
  supplierId INT REFERENCES Suppliers(id),
  supplier NVARCHAR(255) NOT NULL,
  status NVARCHAR(20) NOT NULL DEFAULT 'Pendente',
  dueDate DATE NOT NULL,
  sentDate DATE,
  createdAt DATETIME DEFAULT GETDATE()
);

-- RFQ Lines (existing)
CREATE TABLE RFQLines (
  id INT IDENTITY(1,1) PRIMARY KEY,
  rfqId INT NOT NULL REFERENCES RFQs(id) ON DELETE CASCADE,
  articuladoId NVARCHAR(50) REFERENCES ArticuladoLines(id),
  description NVARCHAR(255) NOT NULL,
  quantity INT NOT NULL
);

-- Supplier Responses
CREATE TABLE SupplierResponses (
  id INT IDENTITY(1,1) PRIMARY KEY,
  rfqId INT NOT NULL REFERENCES RFQs(id),
  supplierId INT REFERENCES Suppliers(id),
  supplier NVARCHAR(255) NOT NULL,
  responseDate DATE NOT NULL,
  totalValue DECIMAL(18,2),
  rawData NVARCHAR(MAX) -- JSON blob from Excel upload
);

-- Supplier Response Items
CREATE TABLE SupplierResponseItems (
  id INT IDENTITY(1,1) PRIMARY KEY,
  responseId INT NOT NULL REFERENCES SupplierResponses(id) ON DELETE CASCADE,
  supplierArticle NVARCHAR(255),
  brand NVARCHAR(255),
  supplierDescription NVARCHAR(MAX),
  unit NVARCHAR(20),
  quantity INT,
  unitPrice DECIMAL(18,2),
  supplierRef NVARCHAR(255),
  comments NVARCHAR(MAX)
);

-- Response Item to Articulado Mapping (N:N)
CREATE TABLE ResponseItemMappings (
  responseItemId INT NOT NULL REFERENCES SupplierResponseItems(id) ON DELETE CASCADE,
  articuladoId NVARCHAR(50) NOT NULL REFERENCES ArticuladoLines(id),
  PRIMARY KEY (responseItemId, articuladoId)
);

-- Awards (migrated from JSON)
CREATE TABLE Awards (
  id NVARCHAR(50) PRIMARY KEY,
  projectId NVARCHAR(50) NOT NULL REFERENCES Projects(id),
  awardDate DATE NOT NULL,
  totalValue DECIMAL(18,2) NOT NULL,
  status NVARCHAR(20) NOT NULL DEFAULT 'Criada',
  createdAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE AwardLines (
  id NVARCHAR(50) PRIMARY KEY,
  awardId NVARCHAR(50) NOT NULL REFERENCES Awards(id) ON DELETE CASCADE,
  articuladoId NVARCHAR(50) NOT NULL REFERENCES ArticuladoLines(id),
  supplier NVARCHAR(255) NOT NULL,
  responseItemId INT REFERENCES SupplierResponseItems(id),
  quantity INT NOT NULL,
  unitPrice DECIMAL(18,2) NOT NULL,
  totalPrice DECIMAL(18,2) NOT NULL
);

-- Audit Logs (migrated from SQLite)
CREATE TABLE Logs (
  id INT IDENTITY(1,1) PRIMARY KEY,
  timestamp DATETIME NOT NULL DEFAULT GETDATE(),
  [user] NVARCHAR(255) NOT NULL,
  action NVARCHAR(100) NOT NULL,
  details NVARCHAR(MAX) NOT NULL
);
```

2. Update the upload route to use the proper schema instead of inserting raw JSON blobs.

**Effort:** 3-4 hours for schema. 1 day to update all routes.

---

### IMP-014 — Add Database Migration Tooling

**Description:** Schema changes are currently applied manually. No migration history, no version control for DB structure.

**Steps to fix:**
1. Evaluate options: Prisma, Drizzle, or raw migration scripts
2. **Recommended: Drizzle** — lightweight, SQL-first, works well with existing mssql driver
3. Set up migration directory structure:
```
drizzle/
  0001_initial_schema.sql
  0002_add_suppliers.sql
  0003_migrate_awards.sql
```
4. Add migration scripts to `package.json`:
```json
"scripts": {
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push"
}
```

**Effort:** 4-6 hours

**Dependencies:** Complete schema (ISSUE-006) must be finalized first.

---

## Expected Impact

After completing this epic:
- All procurement data lives in a single SQL Server instance
- Referential integrity is enforced at the database level (FK constraints)
- Award creation can participate in transactions with conflict checks
- Schema is version-controlled through migrations
- `data/awards.json` and `logs.db` files are eliminated
- The upload route has a proper target table
- Foundation is laid for all Phase 4 features that need joined queries across entities
