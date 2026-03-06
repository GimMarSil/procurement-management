# EPIC: Developer Experience

## Objective

Improve the development workflow, code quality guardrails, and maintainability of the codebase. This includes enabling strict TypeScript, setting up CI, removing dead code, fixing developer-facing issues, and establishing testing foundations.

## Evidence

- IMP-007: Remove ~27 unused UI components and unused dependencies
- IMP-009: Add integration tests for core flows
- IMP-011: Replace console.log with structured logging
- IMP-012: Fix font-family override in globals.css
- IMP-015: Fix .gitignore (missing data/, *.db)
- IMP-016: Add CI pipeline (lint + typecheck + test)
- IMP-017: Enable TypeScript strict mode
- IMP-020: Accessibility pass on forms and interactive elements
- BUG-025: Synchronous params access deprecated in Next.js 15

## Tasks

### IMP-015 — Fix .gitignore

**Description:** `.gitignore` is missing entries for `data/` (awards JSON), `*.db` (SQLite audit logs), and potentially sensitive files. These should never be committed.

**Steps to fix:**
Add to `.gitignore`:
```
# Data files
/data/
*.db

# IDE
.idea/
.vscode/
```

**Effort:** 5 minutes

---

### IMP-017 — Enable TypeScript Strict Mode

**Description:** TypeScript strict mode is not enabled. This means `strictNullChecks`, `noImplicitAny`, and other safety checks are off, hiding potential type errors.

**Steps to fix:**
1. Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```
2. Run `npx tsc --noEmit` to surface all type errors
3. Fix errors incrementally. Expected categories:
   - `any` types in API responses — add proper types
   - Nullable access without checks — add guards
   - Missing return types — add annotations
4. Alternatively, enable strict checks one at a time:
```json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "noImplicitAny": true
  }
}
```

**Effort:** 4-8 hours (depending on number of errors surfaced)

---

### IMP-007 — Remove Unused Dependencies and Components

**Description:** `package.json` contains unused dependencies: `cmdk`, `react-hook-form`, `@hookform/resolvers`, `vaul`, `input-otp`, `embla-carousel-react`, `react-resizable-panels`. The `components/ui/` directory has ~27 components that are never imported.

**Steps to fix:**
1. Identify unused UI components:
```bash
# For each component file, check if it's imported anywhere
for f in components/ui/*.tsx; do
  name=$(basename "$f" .tsx)
  count=$(grep -r "from.*components/ui/$name" app/ components/ --include="*.tsx" --include="*.ts" -l | wc -l)
  if [ "$count" -eq 0 ]; then echo "UNUSED: $f"; fi
done
```
2. Delete unused component files
3. Remove unused dependencies:
```bash
pnpm remove cmdk react-hook-form @hookform/resolvers vaul input-otp embla-carousel-react react-resizable-panels
```
4. Also remove related Radix dependencies that were only used by deleted components

**Effort:** 1-2 hours

---

### BUG-025 — Fix Synchronous params Access for Next.js 15

**Description:** Next.js 15 changed `params` to a Promise. Three files use synchronous access:
- `app/projects/[id]/page.tsx:34,40`
- `app/api/rfqs/[id]/send/route.ts:4`
- `app/api/rfqs/[id]/upload/route.ts:5`

Currently works with deprecation warnings; will break in Next.js 16.

**Steps to fix:**

For API routes:
```typescript
// Before
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const rfqId = params.id

// After
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rfqId } = await params
```

For page components:
```typescript
// Before
export default function ProjectDetailPage({ params }: { params: { id: string } }) {

// After
export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
```

Note: Page components using `params` must become async or use React's `use()` hook.

**Effort:** 30 minutes

---

### IMP-011 — Structured Logging

**Description:** The codebase uses `console.log` for all output. No log levels, no structured format, no correlation IDs.

**Steps to fix:**
1. Install pino (lightweight, JSON-native):
```bash
pnpm add pino
```
2. Create `lib/logger.ts`:
```typescript
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
})
```
3. Replace `console.log`/`console.error` calls with `logger.info()`/`logger.error()` throughout
4. Add request context logging in error handler middleware

**Effort:** 2-3 hours

---

### IMP-016 — Add CI Pipeline

**Description:** No CI/CD pipeline exists. Broken code (like the merge conflict) can be pushed without detection.

**Steps to fix:**
1. Create `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: npx tsc --noEmit
      - run: pnpm test -- --passWithNoTests
      - run: pnpm run build
```

2. Add branch protection rules requiring CI to pass before merge

**Effort:** 1-2 hours

---

### IMP-012 — Fix Font Override

**Description:** `app/globals.css:6` sets `font-family: Arial` which overrides the Inter font loaded via `next/font` in `layout.tsx`. Either use Inter everywhere or remove the `next/font` import.

**Steps to fix:**
Option A (use Inter): Remove lines 5-7 from `globals.css`
Option B (use Arial): Remove the `next/font/google` import from `layout.tsx`

**Effort:** 5 minutes

---

### IMP-009 — Add Integration Tests

**Description:** Existing tests (3 files) are mostly broken — they test mock data that no longer exists or test the wrong page. Real integration tests are needed for the core procurement flows.

**Steps to fix:**
1. Fix existing tests:
   - `rfqs/page.test.tsx` imports `RFQsPage` but tests for mock data from `pedidos/page.tsx` — rewrite to test actual RFQ page with mocked fetch
   - `articulado/page.test.tsx` tests mock data that was replaced by API fetch — mock the fetch call

2. Add new tests for critical paths:
   - API route tests: RFQ CRUD, award creation, validation errors
   - Component tests: comparative matrix selection, award creation modal
   - Service tests: price comparison, scenario validation (once extracted)

3. Set up test utilities:
```typescript
// test/setup.ts
import '@testing-library/jest-dom'

// Mock fetch for API tests
global.fetch = jest.fn()
```

**Effort:** 2-3 days

---

### IMP-020 — Accessibility Pass

**Description:** Interactive elements (checkboxes, buttons, modals) may lack proper ARIA attributes, keyboard navigation, or focus management.

**Steps to fix:**
1. Run `axe-core` audit on each page
2. Fix common issues:
   - Add `aria-label` to icon-only buttons
   - Ensure all form inputs have associated labels
   - Verify modal focus trapping (shadcn Dialog should handle this)
   - Check color contrast ratios
3. Add keyboard navigation tests

**Effort:** 1 day

---

## Expected Impact

After completing this epic:
- TypeScript catches bugs at compile time instead of runtime
- CI prevents broken code from being merged (no more merge conflict incidents)
- Codebase is leaner — ~30% fewer unused files and dependencies
- Logging provides operational visibility without browser dev tools
- Tests cover the critical procurement flows
- Developers can onboard faster with a clean, well-structured codebase
- Next.js 16 upgrade path is clear (no deprecated API usage)
