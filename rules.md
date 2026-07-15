# Development Guidelines & Rules — ApnaDoodh Marketplace

This document defines the coding style conventions, security rules, performance guidelines, and configuration requirements for the ApnaDoodh codebase.

---

## 1. Code Style & Conventions

* **TypeScript Strictness**: Always use explicit types where possible. Avoid the usage of `any` types. Enable `strict` checks in `tsconfig.json`.
* **Framework Standard**: Use Next.js 15 App Router conventions.
  - Server components by default to minimize client JS.
  - Use `"use client"` only for components containing state, handlers, hooks, or framer-motion animations.
* **Modular Design**: Separate components from route page templates. Keep state logic clean and leverage repository classes (`lib/repositories`) to query databases.
* **Component Reuse**: Define layouts inside `components/` and use them in dashboard pages. Ensure responsive styling using Tailwind classes.

---

## 2. Security Standards (Mandatory)

* **Input Sanitization**:
  - All input received from client forms/payloads must be sanitized recursively using `sanitizeInput` (`lib/security.ts`).
  - This strips HTML tags (XSS protection) and escapes raw quotes (SQL injection protection).
* **Cross-Site Scripting (XSS)**: Never bypass HTML escaping. Avoid using `dangerouslySetInnerHTML` unless rendering verified, sanitized static strings.
* **CSRF & Cookies**:
  - Store security credentials (tokens, session claims) inside HttpOnly cookies.
  - Ensure cookies are configured with `secure: true` (in production) and `sameSite: "strict"`.
* **CORS Policies**:
  - Enforce strict CORS header validation (`applyCorsHeaders` in `lib/security.ts`) on all public API endpoints.
  - Allow connections only from trusted frontend domains or local test targets.
* **Sensitive Assets Access Control**:
  - Private uploads (such as KYC PDFs and FSSAI cards) must be stored in secure S3 locations.
  - Never generate public links for these folders. Access must be managed via short-lived (5 minutes) pre-signed URLs.
* **Zero Console Logs**:
  - Do not deploy debugging `console.log()` statements to staging or production.
  - Log only critical error exceptions using `console.error()`.
* **Environment Variables**:
  - Never commit credentials, passwords, or security keys to files.
  - Read configurations directly from `process.env`.
  - Exclude `.env` and `.env.*.local` files inside `.gitignore`.

---

## 3. Web Performance Standards

* **Asset Formats**:
  - Use compressed WebP format for all static site illustrations, product images, and hero backdrops.
  - Keep individual image sizes below 200KB.
* **Image Component**: Use Next.js `<Image>` instead of standard HTML `<img>` elements for automatic resizing, lazy loading, and optimization.
* **Route Prefetching**: Use Next.js `<Link>` components instead of standard `<a>` anchor tags to auto-prefetch adjacent routes in the background.
* **Skeleton Loaders**: Support slow connection devices by creating a Next.js `loading.tsx` component displaying styled, shimmering page block outlines.

---

## 4. Database Concurrency Rules

* **Queue Locking**: All JSON database writes must be queued via the Promise lock queue (`runInQueue`) to prevent database write collusions.
* **Prisma Integrations**: When migrating, ensure all model relations use cascade delete configurations (`onDelete: Cascade`) to preserve referential integrity.
