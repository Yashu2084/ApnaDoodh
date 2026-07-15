# Project Memory Log — ApnaDoodh Marketplace

This document records the historical context, configuration choices, solved issues, and active parameters of the ApnaDoodh project to preserve knowledge.

---

## 1. Project Context Summary

* **Project Name**: ApnaDoodh (meaning "Our Milk" in Hindi)
* **Domain**: Direct-to-home dairy marketplace in Gurugram
* **Active Status**: Phase 2 completed. Hardened security, optimized assets, and customized error UX layouts.
* **Database Target**: Mock JSON Database (`auth_db.json` stored inside the sandboxed data folder) backed by Repository Pattern classes.

---

## 2. Key Resolved Issues & Quirks

### 2.1. Footer Button Hydration Error
* **Symptom**: React Hydration Mismatch error thrown on page load referencing `fdprocessedid`.
* **Root Cause**: Browser password managers or auto-fill modules injected `fdprocessedid` attributes onto input elements and buttons inside the newsletter registration form during client render.
* **Resolution**: Added `suppressHydrationWarning` to the newsletter submit button in [Footer.tsx](file:///c:/Users/MOL/OneDrive/Desktop/DailyDoodh/components/Footer.tsx#L155), instructing React to bypass hydration validation for that specific tag.

### 2.2. ESLint Circular Build Serialization Error
* **Symptom**: Next.js production builds failed during lint checking, displaying `ESLint: Converting circular structure to JSON`.
* **Root Cause**: Next.js 15's built-in eslint compilation runner has a serialization bug when parsing ESLint v9 configuration files that load plugins (like React plugin) containing circular references in their exported objects.
* **Resolution**: Configured [next.config.ts](file:///c:/Users/MOL/OneDrive/Desktop/DailyDoodh/next.config.ts#L10) with `eslint: { ignoreDuringBuilds: true }`. Code validation is run via separate, direct CLI commands (`npx eslint .`) while allowing Next.js optimizer to build assets cleanly.

### 2.3. Git Ignore Security Leak
* **Symptom**: Sensitive environment variables configuration file `.env` was at risk of being committed.
* **Root Cause**: Default `.gitignore` lacked explicit `.env` rules (only ignored `*.local`).
* **Resolution**: Modified [.gitignore](file:///c:/Users/MOL/OneDrive/Desktop/DailyDoodh/.gitignore#L25) to explicitly exclude `.env` and `.env*.local` patterns, and generated [.env](file:///c:/Users/MOL/OneDrive/Desktop/DailyDoodh/.env) locally with secure keys.

---

## 3. Active System Parameters

* **Local JSON DB Location**: `C:\Users\MOL\.gemini\antigravity\auth_db.json`
* **Local SMS Logs Location**: `C:\Users\MOL\.gemini\antigravity\sms_logs.txt`
* **Local Email Logs Location**: `C:\Users\MOL\.gemini\antigravity\email_logs.txt`
* **Local Private Docs Location**: `C:\Users\MOL\.gemini\antigravity\private_docs`
* **JWT Token Lifespans**:
  - Access Token: 15 minutes (900 seconds)
  - Refresh Token: 30 days (2,592,000 seconds)
