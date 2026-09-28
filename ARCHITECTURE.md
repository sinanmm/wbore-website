# World Book of Record Excellence (WBRE) — System Architecture

This document describes the architectural design, separation of concerns, and future software platform readiness of the World Book of Record Excellence platform.

---

## 1. Architectural Philosophy

The WBRE platform follows a **Domain-Driven Feature Modular** architecture layered on top of Next.js 15 App Router:

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                     │
│        (public) Routes   │   (platform) Portals   │   API   │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                      Component Layer                        │
│   ui/  │  layout/  │  brand/  │  records/  │  sections/     │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                      Features Layer                         │
│   records/ │ applications/ │ verification/ │ users/ │ etc.  │
│          (Services, Schemas, Domain Types, Actions)         │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                        Core & Config                        │
│   lib/db.ts  │  lib/auth.ts  │  config/  │  styles/tokens   │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                  Database & External Services               │
│          Prisma ORM (SQLite / PostgreSQL) │ Storage         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Public Website Architecture (`src/app/(public)`)

- **Route Grouping**: All institutional public pages reside under `src/app/(public)/`. This groups them under a common layout without altering their URLs.
- **Unified Layout**: `(public)/layout.tsx` mounts `<Header />` and `<Footer />` across all public pages, removing redundant wrapper boilerplate from individual route components.
- **Data Hydration**: Public views fetch data through domain services (`RecordService`, `OfficeService`) with graceful fallback to configuration constants in `@/config`.

---

## 3. Platform & Portal Architecture (`src/app/(platform)`)

The platform is designed to scale across multiple institutional actor roles:

| Portal | Route | Primary Role | Functionality |
| :--- | :--- | :--- | :--- |
| **Admin** | `/admin` | `SUPER_ADMIN`, `ADMIN` | Record publishing, status transitions, certificate issuance, user management |
| **Reviewer** | `/reviewer` | `REVIEWER` | Technical evidence inspection, measurement calibration verification |
| **Adjudicator** | `/adjudicator` | `ADJUDICATOR` | On-site mission dispatch, witness validation, record presentation |
| **Dashboard** | `/dashboard` | All | Unified entry-point router redirecting authenticated users to their authorized workspace |

---

## 4. API Platform & Versioning (`src/app/api`)

The API architecture is structured for backward compatibility and multi-client integration:

### 4.1 Version 1 Platform API (`/api/v1`)
Designed for external verification systems, mobile applications, and partner integrations:
- `GET /api/v1/records`: Queryable record registry with full-text search, category filtering, and pagination.
- `POST /api/v1/applications`: Structured endpoint for proposing record attempts with schema validation.
- `GET /api/v1/applications?id=...&email=...`: Real-time status lookup.
- `GET /api/v1/verify?query=...`: Public cryptographic certificate and record verification.

### 4.2 Internal System API (`/api/admin/*`, `/api/contact`)
Handles administrative session authentication, status mutations, and contact message dispatches.

---

## 5. Database Schema & Data Access Layer

- **ORM**: Prisma Client initialized as a singleton in `src/lib/db.ts`.
- **Domain Models**:
  - `Record`: Primary achievement registry record with full metadata, category link, holder link, and certificate links.
  - `Certificate`: Official verifiable certificate document with unique verification code and QR identifier.
  - `Application`: Inbound multi-step proposals with historical audit log (`ApplicationStatusHistory`).
  - `Office`: Jurisdictional headquarters information.
  - `User`: Authenticated institutional officials with granular roles.

---

## 6. Authentication & Permissions Matrix

- **Session**: Secure HTTP-only cookie-based session encoded with cryptographic credentials.
- **Roles**:
  - `SUPER_ADMIN`: Full administrative sovereignty.
  - `ADMIN`: Operational management & registry coordination.
  - `REVIEWER`: Evidence examination & evaluation.
  - `ADJUDICATOR`: On-site verification & witness confirmation.
  - `ORGANIZATION`: Institutional partner record access.
  - `APPLICANT`: Public proposal submission & tracking.
- **RBAC Matrix**: Controlled by `src/config/permissions.ts` and enforced via `src/lib/permissions.ts`.

---

## 7. Design System & Tokens (`src/styles/tokens.ts`)

- **Palette**: Deep Navy (`#07192F`), Royal Navy (`#12365F`), Primary Gold (`#CAA24C`), Light Gold (`#E8CB7A`), Ivory (`#F7F3E9`).
- **Typography**: Cormorant Garamond (Serif display) and Inter (Sans body).
- **Gradients**: Standardized gold and navy linear/radial gradients.
