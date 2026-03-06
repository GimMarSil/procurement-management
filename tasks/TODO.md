# System Improvement Backlog

> Generated from comprehensive code audit. All items verified against source code.
> Total confirmed items: 22 bugs, 14 design issues, 17 improvements, 13 features.

---

## Critical Fixes

| ID | Title | Priority | Phase | EPIC |
|---|---|---|---|---|
| BUG-001 | Merge conflict markers in `lib/db.ts` break all SQL Server routes | P0 | 1 | EPIC_critical_fixes |
| BUG-002 | `better-sqlite3` missing from `package.json` — audit system crashes | P0 | 1 | EPIC_critical_fixes |
| BUG-003 | Module-level side effect in `lib/audit.ts` crashes on import | P0 | 1 | EPIC_critical_fixes |
| BUG-010 | Open email relay — arbitrary recipient/content/attachments accepted | P0 | 1 | EPIC_security_hardening |
| BUG-011 | Path traversal via nodemailer attachments | P0 | 1 | EPIC_security_hardening |
| BUG-024 | `readData()` catch-all silently destroys awards on corrupt JSON | P0 | 1 | EPIC_critical_fixes |
| BUG-005 | Destructuring default doesn't protect against `null` lines | P1 | 1 | EPIC_api_reliability |
| ISSUE-012 | Duplicate `mssql` dependency in `package.json` | P1 | 1 | EPIC_critical_fixes |

## Architectural Corrections

| ID | Title | Priority | Phase | EPIC |
|---|---|---|---|---|
| ISSUE-001 | Three incompatible storage backends (SQL Server, SQLite, JSON) | P0 | 2 | EPIC_data_architecture |
| ISSUE-002 | Unresolved merge conflict in core database module | P0 | 1 | EPIC_critical_fixes |
| ISSUE-003 | Audit system depends on phantom dependency | P0 | 1 | EPIC_critical_fixes |
| ISSUE-005 | Mock data masquerading as production code — no boundaries | P1 | 2 | EPIC_feature_completion |
| ISSUE-006 | Incomplete SQL schema coverage | P1 | 2 | EPIC_data_architecture |
| ISSUE-008 | No input validation despite Zod being installed | P1 | 2 | EPIC_api_reliability |
| ISSUE-009 | Open email relay — security architecture failure | P0 | 1 | EPIC_security_hardening |
| ISSUE-010 | Non-transactional multi-table writes | P1 | 2 | EPIC_api_reliability |
| ISSUE-011 | Inconsistent error handling across API routes | P1 | 2 | EPIC_api_reliability |
| ISSUE-013 | Two disconnected RFQ creation flows | P1 | 2 | EPIC_feature_completion |
| ISSUE-014 | JSON file storage for critical award data | P1 | 2 | EPIC_data_architecture |
| ISSUE-015 | No authentication or authorization | P0 | 2 | EPIC_security_hardening |
| ISSUE-004 | Business logic embedded in React components (695-line page) | P2 | 3 | EPIC_api_reliability |
| ISSUE-007 | Dead-end API stubs returning `{ ok: true }` | P2 | 2 | EPIC_feature_completion |

## Improvements

| ID | Title | Priority | Phase | EPIC |
|---|---|---|---|---|
| IMP-001 | Unify all data in SQL Server | P0 | 2 | EPIC_data_architecture |
| IMP-002 | Implement Zod schemas for all API routes | P1 | 2 | EPIC_api_reliability |
| IMP-003 | Extract business logic into server-side service layer | P2 | 3 | EPIC_api_reliability |
| IMP-004 | Wrap multi-table writes in SQL transactions | P1 | 2 | EPIC_api_reliability |
| IMP-005 | Add centralized error handling middleware | P1 | 2 | EPIC_api_reliability |
| IMP-006 | Add authentication (NextAuth.js) | P0 | 2 | EPIC_security_hardening |
| IMP-007 | Remove ~27 unused UI components and unused deps | P3 | 3 | EPIC_developer_experience |
| IMP-008 | Move comparative matrix computation server-side | P2 | 3 | EPIC_api_reliability |
| IMP-009 | Add integration tests for core flows | P3 | 3 | EPIC_developer_experience |
| IMP-011 | Replace console.log with structured logging | P3 | 3 | EPIC_developer_experience |
| IMP-012 | Fix font-family override in globals.css | P3 | 3 | EPIC_developer_experience |
| IMP-013 | Add rate limiting to email/upload endpoints | P2 | 3 | EPIC_security_hardening |
| IMP-014 | Add database migration tooling | P2 | 2 | EPIC_data_architecture |
| IMP-015 | Fix .gitignore (add data/, *.db) | P1 | 3 | EPIC_developer_experience |
| IMP-016 | Add CI pipeline (lint + typecheck + test) | P2 | 3 | EPIC_developer_experience |
| IMP-017 | Enable TypeScript strict mode | P2 | 3 | EPIC_developer_experience |
| IMP-020 | Accessibility pass on forms and interactive elements | P3 | 3 | EPIC_developer_experience |

## Bugs (High/Medium)

| ID | Title | Priority | Phase | EPIC |
|---|---|---|---|---|
| BUG-004 | No error handling in RFQ POST — orphaned records on failure | P1 | 2 | EPIC_api_reliability |
| BUG-008 | Upload targets non-existent `SupplierResponses` table | P1 | 2 | EPIC_data_architecture |
| BUG-012 | `params.id` completely ignored in email send route | P1 | 1 | EPIC_security_hardening |
| BUG-013 | No file size/type validation on Excel upload | P1 | 3 | EPIC_api_reliability |
| BUG-016 | `handleSupplierProposal` replaces scenario instead of merging | P2 | 3 | EPIC_feature_completion |
| BUG-017 | Cannot deselect lines in comparative matrix | P2 | 3 | EPIC_feature_completion |
| BUG-019 | No double-submit protection on award creation | P2 | 3 | EPIC_feature_completion |
| BUG-020 | CreateRFQForm.handleCreateRFQ is console.log only | P1 | 2 | EPIC_feature_completion |
| BUG-021 | MappingEditor.saveMappings is console.log only | P1 | 2 | EPIC_feature_completion |
| BUG-022 | fetchRfqs doesn't check res.ok before parsing | P2 | 3 | EPIC_api_reliability |
| BUG-023 | createRfq resets form before confirming success | P2 | 3 | EPIC_feature_completion |
| BUG-025 | Synchronous params access deprecated in Next.js 15 | P2 | 2 | EPIC_developer_experience |
| BUG-027 | No sheet validation on Excel upload | P3 | 3 | EPIC_api_reliability |
| BUG-028 | selectAll checkbox desyncs with filter changes | P3 | 3 | EPIC_feature_completion |
| BUG-034 | Hardcoded projectId "92114" in award creation | P2 | 3 | EPIC_feature_completion |
| BUG-036 | Hardcoded KPI value "125.4K" in articulado page | P2 | 3 | EPIC_feature_completion |

## New Features

| ID | Title | Priority | Phase | EPIC |
|---|---|---|---|---|
| FEAT-001 | Real-time notifications | P3 | 4 | EPIC_product_features |
| FEAT-002 | PDF report generation | P2 | 4 | EPIC_product_features |
| FEAT-003 | PHC ERP integration | P2 | 4 | EPIC_product_features |
| FEAT-004 | Supplier portal | P3 | 4 | EPIC_product_features |
| FEAT-005 | Approval workflows for awards | P1 | 4 | EPIC_product_features |
| FEAT-006 | Document management | P2 | 4 | EPIC_product_features |
| FEAT-007 | Analytics dashboard with real data | P2 | 4 | EPIC_product_features |
| FEAT-008 | Multi-currency support (EUR/AOA/MZN) | P2 | 4 | EPIC_product_features |
| FEAT-009 | Enhanced audit trail UI | P3 | 4 | EPIC_product_features |
| FEAT-010 | Budget tracking per project | P2 | 4 | EPIC_product_features |
| FEAT-011 | Email templates for RFQ distribution | P1 | 4 | EPIC_product_features |
| FEAT-014 | Excel export for comparatives and awards | P1 | 4 | EPIC_product_features |
| FEAT-015 | Role-based access control | P1 | 4 | EPIC_product_features |

---

## Phase Summary

| Phase | Focus | Duration | Items |
|---|---|---|---|
| 1 - Critical Fixes | Make system bootable and safe | Week 1-2 | 8 items |
| 2 - Architecture | Unify storage, add auth, validation | Week 3-6 | 18 items |
| 3 - Improvements | Polish, harden, DX improvements | Week 7-10 | 22 items |
| 4 - Features | Deliver product value | Week 11-18 | 13 items |
