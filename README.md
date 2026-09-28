# World Book of Record Excellence (WBRE)

> **Where Excellence Becomes History.**  
> Official International Record Recognition & Achievement Registry Platform.

---

## 🏛️ Project Overview

The World Book of Record Excellence (WBRE) application is an institutional Next.js platform designed for global achievement archival, multi-step record proposals, evidence verification, and centralized adjudication management.

The codebase is engineered with a modular, enterprise-grade architecture ready to scale into a multi-portal software platform (Public Registry, Platform Portals, and Versioned API).

---

## 📂 Architecture & Directory Structure

```
src/
├── app/
│   ├── (public)/                       # Public-facing institutional pages
│   │   ├── layout.tsx                  # Public layout with Header & Footer
│   │   ├── page.tsx                    # Landing / Home
│   │   ├── about/                      # About WBRE & Institutional Principles
│   │   ├── records/                    # Official Registry & Details
│   │   ├── categories/                 # Category index & dynamic slug views
│   │   ├── verify/                     # Certificate verification & live lookup
│   │   ├── apply/                      # 5-step record application wizard
│   │   ├── application-status/         # Application progress & tracking
│   │   ├── contact/                    # Global Secretariats & Enquiries
│   │   ├── how-it-works/               # Five-Step Verification Pathway
│   │   ├── standards/                  # Verification Principles & Criteria
│   │   ├── privacy/                    # Privacy Policy
│   │   └── terms/                      # Terms & Conditions
│   │
│   ├── (platform)/                     # SaaS Platform Portals
│   │   ├── admin/                      # Centralized Secretariat Management Portal
│   │   ├── dashboard/                  # Platform router
│   │   ├── reviewer/                   # Technical Evidence Review Desk
│   │   └── adjudicator/                # On-Site Adjudication Field Portal
│   │
│   ├── api/
│   │   ├── v1/                         # Versioned API routes for external & mobile clients
│   │   │   ├── records/route.ts        # GET /api/v1/records (search, filters, pagination)
│   │   │   ├── applications/route.ts   # POST /api/v1/applications & GET status
│   │   │   └── verify/route.ts         # GET /api/v1/verify (code / cert lookup)
│   │   ├── applications/route.ts       # Backward-compatible application endpoint
│   │   ├── contact/route.ts            # Public enquiry submission
│   │   └── admin/                      # Secretariat admin API endpoints
│   │
│   ├── layout.tsx                      # Root HTML layout with Google Fonts
│   ├── loading.tsx                     # Global loading suspense fallback
│   ├── error.tsx                       # Global error boundary
│   └── not-found.tsx                   # Global 404 page
│
├── components/
│   ├── ui/                             # Primitive design components (Button, Badge, Card, etc.)
│   ├── layout/                         # Frame components (Header, Footer, Navigation)
│   ├── brand/                          # Brand assets & institutional Logo component
│   ├── records/                        # Record presentation widgets (RecordCard, RecordGrid)
│   ├── sections/                       # Home & marketing sections (Hero, Process, Offices, etc.)
│   ├── apply/ & applications/          # Multi-step application wizard
│   ├── contact/                        # Public contact & enquiry forms
│   └── admin/                          # Administrative dashboard widgets
│
├── features/                           # Domain-driven business modules
│   ├── records/                        # Services, schemas, types, and constants
│   ├── applications/                   # Application submission & tracking services
│   ├── verification/                   # Certificate verification logic
│   ├── offices/                        # Office data retrieval with DB/config fallback
│   └── users/                          # User authentication & RBAC services
│
├── lib/
│   ├── db.ts                           # Prisma Client singleton
│   ├── auth.ts                         # Session authentication & cookie management
│   ├── storage.ts                      # Storage abstraction adapter (ready for S3/R2)
│   ├── permissions.ts                  # Role-based access control (RBAC) helpers
│   ├── validations.ts                  # Centralized Zod validation schemas
│   └── utils.ts                        # Formatting, slugify, and helper utilities
│
├── styles/
│   └── tokens.ts                       # Design tokens (Colors, Typography, Gradients, Shadows)
│
├── config/
│   ├── site.ts                         # Global metadata, URLs, categories, principles
│   ├── navigation.ts                   # Main navigation & footer links
│   ├── offices.ts                      # Global offices directory (standardized to info@wbore.com)
│   └── permissions.ts                  # Roles and permissions matrix
│
├── hooks/                              # Custom React hooks (useScroll, etc.)
├── types/                              # Global TypeScript interfaces
└── public/
    └── assets/                         # Categorized static media assets
        ├── brand/
        ├── logos/
        ├── records/
        └── certificates/
```

---

## ⚙️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run TypeScript typecheck
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm start

# Run database migrations / push schema
npm run db:push

# Seed database
npm run db:seed
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 🚀 Future Platform Expansion Plan

1. **Multi-Role Portals**: Activate authenticated portals for `REVIEWER`, `ADJUDICATOR`, and `ORGANIZATION`.
2. **Mobile Applications**: Connect iOS & Android native apps using `/api/v1/` endpoints.
3. **Cloud Object Storage**: Transition `src/lib/storage.ts` provider to AWS S3 or Cloudflare R2 for secure high-resolution evidence uploads.
4. **Automated Adjudication Workflows**: Implement webhook notifications and email confirmations upon status transitions.
