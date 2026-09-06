# Baby Ladoo — Full-Stack E-Commerce Platform

A full-stack e-commerce storefront for baby and kids essentials, built with Next.js 16 (App Router), Express, TypeScript, Supabase, and Tailwind CSS v4.

🌐 **Live frontend:** [https://ecommerce-site-dun-phi.vercel.app](https://ecommerce-site-dun-phi.vercel.app)
⚙️ **Live backend API:** [https://ecomm-backend-u88t.onrender.com](https://ecomm-backend-u88t.onrender.com)

---

## Architecture Overview

```
ecomm/                          ← Monorepo root
├── src/                        ← Next.js frontend (deployed to Vercel)
│   ├── app/                    ← App Router pages & route handlers
│   ├── frontend/               ← UI components, stores, types, lib
│   └── backend/                ← Legacy Next.js-side Supabase helpers (kept as fallback)
├── backend/                    ← Standalone Express API (deployed to Render)
└── supabase/                   ← Database migrations & Edge Functions
```

The project is mid-migration from a fully Next.js-coupled Supabase setup to a separate Express API backend. Both run in parallel — old `src/backend/` logic is kept as a fallback until each module is fully migrated and verified.

---

## Tech Stack

### Frontend (Next.js — Vercel)
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.3.0 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State management | Zustand 5 |
| Forms | React Hook Form 7 + Zod 4 |
| Auth client | @supabase/ssr (browser + server clients) |
| Icons | Lucide React |
| Notifications | Sonner |
| Utilities | clsx, tailwind-merge |

### Backend API (Express — Render)
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 18 |
| Framework | Express 4 |
| Language | TypeScript 5 (strict, Node16 modules) |
| Validation | Zod 3 |
| Database client | @supabase/supabase-js 2 |
| Dev server | tsx watch |
| Build | tsc |

### Database & Auth
| Layer | Technology |
|-------|-----------|
| Database | Supabase (PostgreSQL) |
| Auth provider | Supabase Auth (email + password, PKCE flow) |
| File storage | Supabase Storage |
| RLS | Row-Level Security on all tables |

---

## Project Structure

```
ecomm/
│
├── src/
│   ├── app/                            ← Next.js App Router
│   │   ├── layout.tsx                  ← Root layout (AuthListener + Header + Footer)
│   │   ├── page.tsx                    ← Homepage /
│   │   ├── globals.css                 ← Global styles
│   │   │
│   │   ├── about/page.tsx              ← /about
│   │   ├── account/page.tsx            ← /account (protected, customer)
│   │   ├── cart/page.tsx               ← /cart
│   │   ├── checkout/
│   │   │   ├── page.tsx                ← /checkout (requires auth)
│   │   │   └── success/page.tsx        ← /checkout/success
│   │   ├── contact/page.tsx            ← /contact
│   │   ├── orders/page.tsx             ← /orders (customer order history)
│   │   ├── wishlist/page.tsx           ← /wishlist (requires auth)
│   │   │
│   │   ├── products/
│   │   │   ├── page.tsx                ← /products (catalog, filters, search)
│   │   │   └── [id]/page.tsx           ← /products/:id (product detail)
│   │   │
│   │   ├── login/page.tsx              ← /login
│   │   ├── register/page.tsx           ← /register
│   │   ├── forgot-password/page.tsx    ← /forgot-password
│   │   ├── reset-password/page.tsx     ← /reset-password
│   │   │
│   │   ├── auth/
│   │   │   └── callback/route.ts       ← /auth/callback (PKCE + OTP handler)
│   │   │
│   │   ├── admin/                      ← /admin/* (requires admin role)
│   │   │   ├── layout.tsx              ← AdminGuard wrapper + admin nav
│   │   │   ├── page.tsx                ← /admin (dashboard + stats)
│   │   │   ├── products/page.tsx       ← /admin/products (CRUD catalog)
│   │   │   ├── orders/page.tsx         ← /admin/orders
│   │   │   ├── customers/page.tsx      ← /admin/customers
│   │   │   └── settings/page.tsx       ← /admin/settings (store config)
│   │   │
│   │   ├── privacy-policy/page.tsx     ← /privacy-policy
│   │   ├── return-refund-policy/       ← /return-refund-policy
│   │   ├── shipping-policy/page.tsx    ← /shipping-policy
│   │   └── terms/page.tsx              ← /terms
│   │
│   │
│   ├── frontend/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx          ← Global nav + cart badge + auth state
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── MobileMenu.tsx
│   │   │   ├── auth/
│   │   │   │   └── AuthListener.tsx    ← Global session listener (mounts in root layout)
│   │   │   ├── admin/
│   │   │   │   ├── AdminGuard.tsx      ← Client-side role guard (wraps all /admin routes)
│   │   │   │   └── ProductFormModal.tsx ← Add/edit product modal (admin)
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.tsx     ← Product tile (add-to-cart, wishlist)
│   │   │   │   └── PincodeChecker.tsx  ← Delivery availability checker
│   │   │   └── common/
│   │   │       └── CartoonIllustrations.tsx
│   │   │
│   │   ├── store/
│   │   │   ├── useAuthStore.ts         ← Zustand: user, profile, isLoading, signOut
│   │   │   ├── useCartStore.ts         ← Zustand: cart items, totals (localStorage persist)
│   │   │   └── useWishlistStore.ts     ← Zustand: wishlist (syncs with Supabase)
│   │   │
│   │   ├── types/
│   │   │   ├── product.ts              ← Product, CartItem interfaces
│   │   │   ├── user.ts                 ← UserProfile, UserRole
│   │   │   ├── order.ts                ← Order, OrderItem, ShippingAddress
│   │   │   ├── settings.ts             ← StoreSettings
│   │   │   └── wishlist.ts             ← WishlistItem
│   │   │
│   │   └── lib/
│   │       ├── api/
│   │       │   └── products.ts         ← Express API client (fetchProducts, fetchProductById)
│   │       ├── supabase/
│   │       │   ├── client.ts           ← createBrowserClient (public anon key)
│   │       │   └── wishlist.ts         ← Wishlist Supabase helpers
│   │       ├── constants.ts            ← SAMPLE_CATEGORIES, shared constants
│   │       └── utils.ts
│   │
│   │
│   └── backend/                        ← Legacy Next.js Supabase helpers (kept as fallback)
│       │                               ← Will be removed after full Express migration
│       ├── auth/
│       │   └── auth.ts                 ← getCurrentUserProfile, verifyAdminRole, ensureUserProfile
│       ├── orders/
│       │   └── orders.ts               ← validateStockAndCreatePendingOrder, getUserOrders
│       ├── payments/
│       │   └── razorpay.ts             ← Razorpay order creation helpers
│       ├── products/
│       │   └── products.ts             ← getProducts, getProductById, admin CRUD (Supabase direct)
│       ├── services/
│       │   ├── supabase.ts             ← getServerSupabaseClient, getAdminSupabaseClient
│       │   ├── settings.ts             ← getStoreSettings, updateStoreSettings
│       │   └── storage.ts              ← Supabase Storage upload helpers
│       ├── types/
│       │   └── index.ts                ← Shared backend TypeScript types
│       └── validation/
│           ├── index.ts
│           ├── checkout.ts             ← Checkout payload Zod schema
│           └── product.ts              ← Product input Zod schema
│
│
├── backend/                            ← Standalone Express API (separate deploy)
│   ├── src/
│   │   ├── server.ts                   ← Entry point: CORS, middleware, route mounting
│   │   │
│   │   ├── routes/
│   │   │   ├── health.ts               ← GET /health
│   │   │   ├── products.ts             ← GET /api/products, GET /api/products/:id
│   │   │   └── auth.ts                 ← GET /api/auth/me (protected)
│   │   │
│   │   ├── controllers/
│   │   │   ├── healthController.ts
│   │   │   ├── productController.ts    ← listProducts, getProduct
│   │   │   └── authController.ts       ← getMe
│   │   │
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts         ← Centralized error handler + AppError class
│   │   │   ├── notFound.ts             ← 404 handler
│   │   │   ├── requireAuth.ts          ← JWT verification via Supabase auth.getUser()
│   │   │   └── requireAdmin.ts         ← Role guard (403 if role !== 'admin')
│   │   │
│   │   ├── services/
│   │   │   ├── supabase.ts             ← Singleton Supabase client (anon key only)
│   │   │   └── productService.ts       ← getProducts(), getProductById() (Supabase queries)
│   │   │
│   │   ├── types/
│   │   │   ├── index.ts                ← ApiSuccess, ApiError, AuthUser, AuthenticatedRequest
│   │   │   └── product.ts              ← Product, ProductListQuery, ProductListResponse
│   │   │
│   │   └── validation/
│   │       ├── index.ts                ← validate() middleware factory, paginationSchema
│   │       └── product.ts              ← productListQuerySchema, productIdParamSchema
│   │
│   ├── .env                            ← Local secrets (gitignored)
│   ├── .env.example                    ← Template for all env vars
│   ├── package.json
│   ├── tsconfig.json                   ← Production build config (module: Node16)
│   ├── tsconfig.dev.json               ← Dev override (tsx watch compatibility)
│   └── README.md
│
│
├── supabase/
│   ├── migrations/
│   │   ├── 01_create_profiles.sql
│   │   ├── 02_create_products.sql
│   │   ├── 03_create_orders.sql
│   │   ├── 04_create_store_settings.sql
│   │   ├── 05_create_wishlist.sql
│   │   └── 06_auth_helpers.sql         ← check_user_exists_by_email RPC
│   └── functions/                      ← Edge Functions (none active yet)
│
├── public/
│   └── heroimg1.png                    ← Static assets
│
├── .env.example                        ← Frontend env var template
├── .env.local                          ← Local frontend secrets (gitignored)
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── AGENTS.md                           ← AI agent rules (Next.js version notices)
```

---

## Pages & Routes

### Customer-facing

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Hero, featured products, promotions |
| `/products` | Catalog | Product grid with sidebar filters: category, age group, price range, sort |
| `/products/[id]` | Product detail | Images, description, specs, add to cart, wishlist |
| `/cart` | Cart | Item list, quantity controls, order summary, free shipping progress |
| `/checkout` | Checkout | Shipping form, payment selection (COD / Razorpay), order placement |
| `/checkout/success` | Success | Order confirmation (unused — success shown inline on checkout page) |
| `/account` | Account | Profile info, order history |
| `/orders` | Orders | Order listing |
| `/wishlist` | Wishlist | Saved products (requires auth, synced to Supabase) |
| `/about` | About |  |
| `/contact` | Contact |  |
| `/privacy-policy` | Privacy Policy |  |
| `/shipping-policy` | Shipping Policy |  |
| `/return-refund-policy` | Returns |  |
| `/terms` | Terms |  |

### Auth

| Route | Description |
|-------|-------------|
| `/login` | Email + password sign in, role-based redirect |
| `/register` | Sign up with name, email, phone, password |
| `/forgot-password` | Password reset request |
| `/reset-password` | Password update (after reset link) |
| `/auth/callback` | Route Handler: PKCE code exchange + OTP token_hash verification |

### Admin (requires `role = 'admin'` in `profiles` table)

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with live stats (products, orders, customers) |
| `/admin/products` | Full product CRUD — add, edit, toggle status, delete |
| `/admin/orders` | Order management |
| `/admin/customers` | Customer list |
| `/admin/settings` | Store settings (name, logo, contact info) |

---

## Express API Endpoints

**Base URL (production):** `https://ecomm-backend-u88t.onrender.com`
**Base URL (local):** `http://localhost:5000`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | None | Liveness probe — `{ status: "ok" }` |
| `GET` | `/api/products` | None | List active products |
| `GET` | `/api/products/:id` | None | Single product by UUID |
| `GET` | `/api/auth/me` | Bearer JWT | Verified user identity + role |

### `GET /api/products` Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Full-text across name, brand, category, description |
| `category` | string | Category name (case-insensitive) or `all` |
| `ageGroup` | string | e.g. `0-6 Months` — `All Ages` skips filter |
| `maxPrice` | number | Maximum price in INR |
| `sortBy` | `featured` \| `price-low` \| `price-high` \| `discount` | Sort order |
| `limit` | number (1–200) | Max results |

### Response Envelope

```json
{ "status": "ok", "data": { ... } }
{ "status": "error", "message": "...", "code": "ERROR_CODE" }
```

---

## Supabase Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles — `id`, `name`, `email`, `phone`, `role` |
| `products` | Product catalog — full product data, `is_active`, `stock` |
| `orders` | Customer orders — shipping address, totals, status |
| `order_items` | Line items per order |
| `store_settings` | Admin-configurable store config |
| `wishlist` | Per-user saved product references |

---

## Authentication Flow

```
Browser                    Next.js                    Supabase Auth
  │                            │                            │
  │── signInWithPassword ──────────────────────────────────▶│
  │◀──────────────────── session + user ───────────────────│
  │                            │                            │
  │  AuthListener (global)     │                            │
  │── getSession() ────────────▶                            │
  │── onAuthStateChange() ─────▶ (live subscription)        │
  │                            │                            │
  │  fetchProfile()            │                            │
  │──── profiles table ────────────────────────────────────▶│
  │◀─── UserProfile (role) ────────────────────────────────│
  │                            │                            │
  │  Zustand (useAuthStore)    │                            │
  │  user + profile + isLoading│                            │
```

- Sessions are stored in browser cookies via `@supabase/ssr`
- `AuthListener` is the single source of truth — mounts in root layout, drives all auth state
- Admin protection: `AdminGuard` (client-side) reads `profile.role` from Zustand
- Express API: `requireAuth` middleware verifies JWTs via `supabase.auth.getUser(token)`

---

## Migration Status

| Module | Old location | Express backend | Status |
|--------|-------------|-----------------|--------|
| Products (read) | `src/backend/products/products.ts` | `GET /api/products`, `GET /api/products/:id` | ✅ Migrated — frontend uses Express API |
| Auth middleware | — | `requireAuth`, `requireAdmin` | ✅ Added — ready for protected routes |
| Orders | `src/backend/orders/orders.ts` | Not started | ⏳ Pending |
| Payments (Razorpay) | `src/backend/payments/razorpay.ts` | Not started | ⏳ Pending |
| Product CRUD (admin) | `src/backend/products/products.ts` | Not started | ⏳ Pending |
| User profile | `src/backend/auth/auth.ts` | Not started | ⏳ Pending |
| Store settings | `src/backend/services/settings.ts` | Not started | ⏳ Pending |

---

## Environment Variables

### Frontend (Vercel / `.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `NEXT_PUBLIC_API_URL` | Express backend URL (production: Render URL) |
| `NEXT_PUBLIC_BACKEND_URL` | Legacy alias for `NEXT_PUBLIC_API_URL` |

### Backend (Render / `backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `CORS_ORIGIN` | Comma-separated allowed origins |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key (never service-role) |

---

## Local Development

```bash
# Terminal 1 — Next.js frontend
npm install
npm run dev          # http://localhost:3000

# Terminal 2 — Express backend
cd backend
npm install
npm run dev          # http://localhost:5000
```

### Verify backend is running

```bash
curl http://localhost:5000/health
# {"status":"ok"}

curl http://localhost:5000/api/products
# {"status":"ok","data":{"products":[...],"total":N}}
```

---

## Deployment

### Frontend → Vercel
- Build command: `npm run build`
- Output: `.next/`
- Environment variables: set `NEXT_PUBLIC_API_URL=https://ecomm-backend-u88t.onrender.com` in Vercel dashboard

### Backend → Render
- Root directory: `backend/`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables: set all vars from `backend/.env.example` in Render dashboard
