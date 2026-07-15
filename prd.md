# Product Requirements Document (PRD) — ApnaDoodh Marketplace

## 1. Executive Summary
ApnaDoodh is a decentralized, direct-to-home dairy marketplace tailored for the Gurugram region. The platform connects health-conscious urban consumers directly with vetted local dairy farmers. By removing middlemen, ApnaDoodh offers farmers higher margins and daily payouts, while giving customers access to raw, unadulterated milk and fresh dairy products (paneer, ghee, dahi, butter) delivered cold to their doorsteps before 7:00 AM daily.

---

## 2. Target Audience & Personas

### 2.1. The Conscious Customer
* **Profile**: Urban professionals, parents, or elderly individuals in Gurugram seeking premium, chemical-free, antibiotic-free dairy.
* **Key Needs**: Reliable cold-chain morning delivery, verified daily purity logs (fat/SNF percentages), flexible subscription scheduling (pausing/skipping drops), and seamless wallet-based payments.

### 2.2. The Independent Farmer
* **Profile**: Small-to-medium local dairy farm owners around Gurugram pastures (Aravali foothills, Sohna Road, Sector 62 rural zones).
* **Key Needs**: Store management tools, transparent pricing structures, direct payment channels with daily settlement, and simple onboarding.

### 2.3. The Marketplace Admin
* **Profile**: Platform operations staff responsible for quality assurance.
* **Key Needs**: Seller KYC approvals, product auditing and flags, review moderation, system-wide configuration controls, and administrative audit logs.

---

## 3. Core Functional Requirements

### 3.1. User Account Lifecycle & Security
* **Authentication**: Core registration and login supporting dual roles (Customer/Farmer) with secure password hashing.
* **Session Management**: Dual JWT tokens (short-lived Access cookie, long-lived Refresh cookie stored securely with `HttpOnly` and `SameSite=Strict` protections).
* **Recovery**: Simulated Twilio SMS OTP verification flow for password recovery or account verification.

### 3.2. Product Catalog & Marketplace
* **Product Catalog**: Dynamic list of local products categorized by type (Milk, Paneer, Ghee, Curd, Butter) with ratings, seller names, price metrics, and pasture source descriptions.
* **Seller Stores**: Dedicated storefront profiles showcasing store name, address, phone, delivery radius, herd details (Gir cows, Murrah buffaloes), and dispatch schedules.
* **Farmer Management**: Capabilities for farmers to add, update, and delete product listings, upload optimized images (WebP), and monitor current stocks.

### 3.3. Subscription & Daily Drops Scheduler
* **Scheduled Deliveries**: Customer capability to schedule morning drops (Scheduled status) by default upon purchase.
* **Drop Management**: Customer capability to pause all deliveries or skip specific delivery dates.
* **Refund Escrow Trigger**: Automated refund execution back to the customer's wallet balance if a drop status transitions to "Skipped", generating a ledger transaction in the database.

### 3.4. Wallet & Payments
* **Local Wallet Balance**: Pre-funded digital ledger currency used for processing subscriptions and instant auto-refunds.
* **Payment Integration**: Stripe/Razorpay API integrations to charge external cards/UPI apps and top up local wallets.
* **Farmer Payouts**: Automatic settlement transfers (RazorpayX simulation) releasing daily milk sales revenue directly to farmer bank accounts.

### 3.5. Location & Logistics
* **Location Selector**: Floating location widgets geocoding Gurugram sector coordinates to filter nearby farms within delivery range.
* **Courier Tracking**: Real-time simulated delivery coordinates updates displaying live transit paths.

### 3.6. Purity Auditing & Reviews
* **Lab logs**: Verified daily chemical logs (Fat %, Solids-Not-Fat %, Somatic Cell Count, Pesticides) displayed under product pages.
* **Ratings**: Multi-dimensional reviews and star ratings with admin flagging moderation.

---

## 4. Non-Functional Requirements

### 4.1. Security & Purity Compliance
* **Data Safety**: Anti-SQL injection, recursive HTML input sanitization, rate limit blocks, and CORS domain verification.
* **Privacy**: Strict S3 bucket locks for PDF upload documents (KYC, FSSAI certificates) readable only via short-lived pre-signed URLs.

### 4.2. Performance & Speed
* **Loading Speeds**: Perception improvements utilizing root Next.js skeleton shimmer loading layouts.
* **Asset Optimization**: Strict usage of compressed WebP formatting for all local/remote images (average asset load savings > 85%).
* **Caching**: Redis-based cache layers protecting database querying from heavy redundant reads.
