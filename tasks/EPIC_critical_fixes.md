# EPIC: Critical Fixes

## Objective

Make the system bootable. Currently, the application cannot start any SQL Server route or any audit-dependent route due to fundamental code-level errors. This epic resolves every item that prevents the system from running at all.

## Evidence

- BUG-001 / ISSUE-002: Merge conflict markers in `lib/db.ts`
- BUG-002 / ISSUE-003: `better-sqlite3` not in `package.json`
- BUG-003: Module-level side effect in `lib/audit.ts` crashes on import
- BUG-024: `readData()` catch-all destroys awards data on any error
- BUG-005: Destructuring default doesn't protect against `null`
- ISSUE-012: Duplicate `mssql` entry in `package.json`

## Tasks

### BUG-001 / ISSUE-002 — Resolve Merge Conflict in lib/db.ts

**Description:** `lib/db.ts` contains literal Git conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`). Two incompatible database connection strategies coexist. The file cannot be parsed.

**Steps to fix:**
1. Open `lib/db.ts`
2. Choose ONE connection strategy:
   - **Recommended:** Use the `main` branch version (connection string via `SQLSERVER_CONN` env var) as it's more flexible and deployment-friendly
3. Remove all conflict markers and the rejected code block
4. Final file should be:
```typescript
import { ConnectionPool } from 'mssql'

let pool: ConnectionPool | null = null

export async function getDb() {
  if (!process.env.SQLSERVER_CONN) {
    throw new Error('SQLSERVER_CONN env var not set')
  }
  if (!pool) {
    pool = new ConnectionPool(process.env.SQLSERVER_CONN)
    await pool.connect()
  }
  return pool
}
```
5. Update `.env.example` to document `SQLSERVER_CONN`
6. Verify: `npm run build` should no longer fail on this file

**Effort:** 15 minutes

---

### BUG-002 / ISSUE-003 / BUG-003 — Fix Audit System Dependency

**Description:** `lib/audit.ts` imports `better-sqlite3` which is not listed in `package.json`. Additionally, the module executes `new Database(...)` and `CREATE TABLE` at import time, meaning any file that imports it crashes immediately.

**Steps to fix (Option A — Add the dependency):**
1. Run `pnpm add better-sqlite3 && pnpm add -D @types/better-sqlite3`
2. Wrap the module-level initialization in a lazy singleton:
```typescript
import Database from 'better-sqlite3'
import path from 'path'

let db: Database.Database | null = null

function getAuditDb() {
  if (!db) {
    db = new Database(path.join(process.cwd(), 'logs.db'))
    db.prepare(`CREATE TABLE IF NOT EXISTS Logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      user TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT NOT NULL
    )`).run()
  }
  return db
}

export function logAction(user: string, action: string, details: string) {
  const timestamp = new Date().toISOString()
  getAuditDb().prepare(
    'INSERT INTO Logs (timestamp, user, action, details) VALUES (?,?,?,?)'
  ).run(timestamp, user, action, details)
}
```

**Steps to fix (Option B — Migrate to SQL Server, recommended for Phase 2):**
1. Add a `Logs` table to the SQL Server schema
2. Rewrite `lib/audit.ts` to use `getDb()` from `lib/db.ts`
3. Remove `better-sqlite3` dependency entirely

For Phase 1, Option A is faster. Option B should be done in EPIC_data_architecture.

**Effort:** 30 minutes (Option A), 2 hours (Option B)

---

### BUG-024 — Fix Silent Data Destruction in Awards readData()

**Description:** In `app/api/adjudicacoes/route.ts`, the `readData()` function catches ALL errors and returns `[]`. If `awards.json` is corrupted, the next POST overwrites it with a single-element array, destroying all previous awards.

**Steps to fix:**
1. Differentiate between "file not found" and "corrupt data":
```typescript
async function readData(): Promise<Award[]> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8')
    return JSON.parse(data)
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return [] // File doesn't exist yet — valid empty state
    }
    throw err // Corrupt JSON or other error — DO NOT swallow
  }
}
```
2. Add error handling in the GET and POST handlers to return 500 on unexpected errors

**Effort:** 20 minutes

---

### BUG-005 — Fix null Safety on Lines Destructuring

**Description:** In `app/api/rfqs/route.ts:43`, `const { lines = [] } = body` does not protect against `null` — only `undefined`. A client sending `{ "lines": null }` causes `TypeError: null is not iterable`.

**Steps to fix:**
```typescript
const { project, supplier, dueDate, lines: rawLines } = body
const lines = Array.isArray(rawLines) ? rawLines : []
```

**Effort:** 5 minutes

---

### ISSUE-012 — Remove Duplicate mssql Dependency

**Description:** `package.json` lists `mssql` twice: `^9.2.3` at line 60 and `^10.0.0` at line 65. JSON last-key-wins means `^10.0.0` is used, but the duplicate is confusing and suggests merge artifact.

**Steps to fix:**
1. Remove line 60 (`"mssql": "^9.2.3"`)
2. Keep line 65 (`"mssql": "^10.0.0"`)
3. Run `pnpm install` to regenerate lockfile

**Effort:** 5 minutes

---

## Expected Impact

After completing this epic:
- `npm run build` will succeed (no more syntax errors from merge conflicts)
- All SQL Server API routes (`/api/rfqs`, `/api/articulado`, `/api/rfqs/[id]/upload`) will be able to connect to the database
- All audit-dependent routes (`/api/rfqs/send`, `/api/responses/receive`, `/api/awards/create`) will no longer crash on import
- Awards data will be protected from silent corruption
- The system transitions from "non-functional" to "bootable with known limitations"
