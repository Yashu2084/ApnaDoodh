# Roadmap & Implementation Phases — ApnaDoodh Marketplace

This document outlines the development phases, completed tasks, and upcoming milestones for the ApnaDoodh platform.

---

## Phase 1: Core Foundation (Completed)
* **Goal**: Build the core layout structure, directory layouts, and mock database models.
* **Key Accomplishments**:
  - Initialized Next.js 15 App Router framework.
  - Set up a thread-safe JSON database file storage (`auth_db.json`) inside the sandbox.
  - Created customer, farmer, and administrator dashboard views.
  - Implemented the local shopping cart provider (`CartProvider.tsx`) with localStorage backup.
  - Built core database seeding scripts containing mock products, reviews, and stores.

---

## Phase 2: Security & Asset Optimization (Completed)
* **Goal**: Harden system defenses, optimize media assets, and resolve runtime errors.
* **Key Accomplishments**:
  - **Environment Security**: Decoupled JWT and presign secrets into process environments, creating `.env` and `.env.example`.
  - **Asset Compression**: Optimized all 24 site illustration images to WebP format, reducing total asset size by over 17MB.
  - **Input Sanitization**: Enabled recursive payloads parsing to strip XSS script tags and escape SQL characters.
  - **Rate Limiting**: Integrated sliding-window IP checks blocking authorization endpoints from brute force attempts.
  - **CORS & CSRF**: Configured strict header checks and SameSite Strict cookie attributes.
  - **Error UX**: Designed root custom `app/not-found.tsx` (404) and `app/error.tsx` page handlers.
  - **Speed Optimizations**: Added `app/loading.tsx` global shimmer layout and resolved browser extension autofill hydration errors in [Footer.tsx](file:///c:/Users/MOL/OneDrive/Desktop/DailyDoodh/components/Footer.tsx).

---

## Phase 3: Production Database Integration (Planned)
* **Goal**: Replace the local JSON database layer with a production-grade PostgreSQL database.
* **Tasks**:
  - Set up a PostgreSQL instance (e.g. Supabase, AWS RDS, or local docker db).
  - Run database migrations using the Prisma schema definition `prisma/schema.prisma`.
  - Rewrite data access queries in the Repository layer (`lib/repositories/`) to utilize Prisma Client instead of JSON filesystem utilities.
  - Replace the write lock queue (`runInQueue`) with Prisma database transaction blocks (`prisma.$transaction()`) to manage concurrent reads and writes safely.

---

## Phase 4: Production Gateways & Live Deployment (Planned)
* **Goal**: Transition from simulated mock services to live third-party production systems.
* **Tasks**:
  - Connect S3 bucket keys to upload FSSAI certificate documents and render pre-signed URLs.
  - Enable live Stripe and Razorpay checkouts, replacing local mock balance transfers.
  - Verify Twilio and Sendgrid accounts to send real SMS verification OTPs and confirmation emails.
  - Deploy the Next.js production build to a cloud hosting platform (e.g. Vercel, AWS ECS, or DigitalOcean) with SSL security.
