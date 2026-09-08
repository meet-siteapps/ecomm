# Baby Ladoo — Full-Stack E-Commerce Platform

A production-grade, full-stack e-commerce storefront for curated baby and kids essentials. Built with Next.js 16 (App Router, Turbopack), a standalone Express + TypeScript API, Supabase (PostgreSQL, Auth, Storage, RLS), and Tailwind CSS v4.

🌐 **Live Frontend:** [https://ecommerce-site-dun-phi.vercel.app](https://ecommerce-site-dun-phi.vercel.app)  
⚙️ **Live Backend API:** [https://ecomm-backend-u88t.onrender.com](https://ecomm-backend-u88t.onrender.com)  

---

## Architecture Overview

```
ecomm/                                ← Monorepo root
├── src/                              ← Next.js 16 storefront (deployed to Vercel)
│   ├── app/                          ← App Router (pages, dynamic routes, route handlers)
│   ├── components/                   ← Modular UI components (admin, auth, layout, products, common)
│   ├── lib/                          ← Core utilities, Supabase SSR/client, & REST API clients
│   ├── store/                        ← Zustand global state stores (auth, cart, wishlist)
│   └── types/                        ← TypeScript interfaces, models & barrel exports
├── backend/                          ← Standalone Express + TypeScript API (deployed to Render)
│   ├── src/
│   │   ├── controllers/              ← Request handlers & business delegation
│   │   ├── middleware/               ← requireAuth, requireAdmin, rateLimiter, errorHandler
│   │   ├── routes/                   ← Product, Admin Product, Order, Admin Order, Admin Dashboard, Payment, Auth, Settings
│   │   ├── services/                 ← Supabase client & admin client database operations
│   │   ├── types/                    ← Type definitions mirroring database models & envelopes
│   │   └── validation/               ← Strict Zod request schemas
│   └── dist/                         ← Compiled JavaScript (tsc)
└── supabase/                         ← Database migrations & SQL schemas
```

---

## Tech Stack & Tooling

### Frontend (Next.js — Vercel)
| Layer | Technology | Description |
|---|---|---|
| **Framework** | Next.js 16.3.0 (App Router) | Server-side rendering & client components with Turbopack |
| **Language** | TypeScript 5 | Strict typing across components, stores, and API clients |
| **Styling** | Tailwind CSS v4 | Custom warm baby pastel theme, custom typography & CSS variables |
| **State Management** | Zustand 5 | `useAuthStore`, `useCartStore` (localStorage persist), `useWishlistStore` |
| **Form & Validation** | React Hook Form 7 + Zod | Type-safe form inputs and validations |
| **Auth Client** | `@supabase/ssr` + Supabase JS | Session management with auto-refreshing access tokens (`getValidAccessToken`) |
| **Icons & UI** | Lucide React + Sonner | Modern icons and toast notifications |

### Backend API (Express — Render)
| Layer | Technology | Description |
|---|---|---|
| **Runtime & Server** | Node.js ≥ 18 / Express 4 | Standalone REST API with modular routing |
| **Language** | TypeScript 5 | Strict mode with Node16 module resolution |
| **Security & Hardening** | `express-rate-limit`, `cors` | Tiered IP rate limiting, strict CORS allowlist, body size limits |
| **Validation** | Zod 3 | Schema-based payload, query, and parameter validation middleware |
| **Database Clients** | `@supabase/supabase-js` 2 | Singleton anon client + privileged service-role admin client |
| **Payment Gateway** | Razorpay SDK (Integrated) | Order generation, HMAC-SHA256 signature verification |

### Database & Cloud Infrastructure
| Layer | Technology | Description |
|---|---|---|
| **Database** | Supabase (PostgreSQL) | Relational tables with Row-Level Security (RLS) policies |
| **Authentication** | Supabase Auth | Email/password sign-in, token refresh, PKCE recovery callbacks |
| **Media Storage** | Supabase Storage | Product image uploads via `product-images` bucket |

---

## Pages & Routes Directory

### Customer Storefront
| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage featuring hero banner, categories, bestsellers, trust badges, and perks |
| `/products` | Public | Searchable catalog with sidebar filters (category, age group, price range, sorting) |
| `/products/[id]` | Public | Product details page with image gallery, specs, stock indicator, wishlist & cart actions |
| `/cart` | Public | Cart slideover/page with quantity increment/decrement, subtotal, and free delivery tracker |
| `/checkout` | Auth Required | Multi-step checkout with address validation and COD / Razorpay payment modes |
| `/checkout/success` | Auth Required | Order confirmation receipt |
| `/account` | Customer | Profile dashboard with personal info editing and customer order history |
| `/orders` | Customer | Dedicated past orders listing with live status badges |
| `/wishlist` | Auth Required | User wishlist synchronized directly with Supabase |
| `/about` | Public | Brand story and quality promise |
| `/contact` | Public | Contact details pulled dynamically from store settings |
| `/privacy-policy` | Public | Privacy & data compliance terms |
| `/shipping-policy` | Public | Shipping zones, delivery estimates, and fees |
| `/return-refund-policy` | Public | Return process and refund guidelines |
| `/terms` | Public | Terms and conditions |

### Authentication Routes
| Route | Purpose |
|---|---|
| `/login` | Email/password login with redirect support and role checks |
| `/register` | User signup with name, email, and phone provisioning |
| `/forgot-password` | Password reset link dispatcher |
| `/reset-password` | Secure password update interface |
| `/auth/callback` | Route handler for Supabase PKCE exchange & magic link / reset tokens |

### Admin Portal (`/admin/*`)
> Protected by `AdminGuard` (verifies `profile.role === 'admin'` from `profiles` table via Express API token check).

| Route | Purpose |
|---|---|
| `/admin` | Overview dashboard with metric cards (Total Products, Active Orders, Revenue, Customers) |
| `/admin/products` | Full inventory management (Add product modal, edit specs, toggle status, delete) |
| `/admin/orders` | Order management table with live status transitions (pending, processing, shipped, delivered, cancelled) |
| `/admin/customers` | Registered customer records and contact directory |
| `/admin/settings` | Global store settings (store name, tagline, email, phone, shipping fee, tax rate, COD toggle) |

---

## Express Backend API Reference

**Base URL (Production):** `https://ecomm-backend-u88t.onrender.com`  
**Base URL (Local):** `http://localhost:5000`

### Health & Liveness
- `GET /health` — Liveness probe returning `{ status: "ok" }`.

### Authentication & Profile (`/api/auth`)
| Method | Endpoint | Protection | Rate Limit | Description |
|---|---|---|---|---|
| `GET` | `/api/auth/me` | Bearer Token | General | Fetches the current user profile from `profiles` |
| `POST` | `/api/auth/ensure-profile` | Bearer Token | AuthLimiter (10/15m) | Auto-provisions profile row upon user registration |
| `PUT` | `/api/auth/profile` | Bearer Token | AuthLimiter (10/15m) | Updates user profile name and/or phone number |

### Store Settings (`/api/settings` & `/api/admin/settings`)
| Method | Endpoint | Protection | Rate Limit | Description |
|---|---|---|---|---|
| `GET` | `/api/settings` | Public | General | Retrieves public store info (branding, contact, shipping rates) |
| `PUT` | `/api/admin/settings` | Bearer Token (Admin) | WriteLimiter (30/15m) | Updates global store configurations in `store_settings` |

### Products Catalog (`/api/products` & `/api/admin/products`)
| Method | Endpoint | Protection | Rate Limit | Description |
|---|---|---|---|---|
| `GET` | `/api/products` | Public | General | Filtered & paginated active products list |
| `GET` | `/api/products/:id` | Public | General | Single product lookup by UUID |
| `GET` | `/api/admin/products` | Bearer Token (Admin) | General | Complete product list (including inactive/out-of-stock) |
| `POST` | `/api/admin/products` | Bearer Token (Admin) | WriteLimiter (30/15m) | Create new product with specs & inventory count |
| `PUT` | `/api/admin/products/:id` | Bearer Token (Admin) | WriteLimiter (30/15m) | Update existing product details |
| `PATCH` | `/api/admin/products/:id/status` | Bearer Token (Admin) | WriteLimiter (30/15m) | Toggle product `is_active` flag |
| `DELETE` | `/api/admin/products/:id` | Bearer Token (Admin) | WriteLimiter (30/15m) | Soft-delete product (`is_active = false`) |
| `DELETE` | `/api/admin/products/:id/permanent` | Bearer Token (Admin) | WriteLimiter (30/15m) | Permanently delete product (hard delete, 0 orders only) |

### Orders & Admin Orders (`/api/orders` & `/api/admin/orders`)
| Method | Endpoint | Protection | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/orders` | Bearer Token | WriteLimiter (30/15m) | Validates stock, calculates pricing & creates pending order |
| `GET` | `/api/orders` | Bearer Token | General | Lists orders for authenticated user |
| `GET` | `/api/orders/:id` | Bearer Token | General | Single order details by UUID |
| `GET` | `/api/admin/orders` | Bearer Token (Admin) | General | Lists all customer orders for admin panel |
| `PATCH` | `/api/admin/orders/:id/status` | Bearer Token (Admin) | WriteLimiter (30/15m) | Updates order lifecycle status (pending, processing, shipped, delivered, cancelled) |

### Admin Dashboard (`/api/admin/dashboard-stats`)
| Method | Endpoint | Protection | Rate Limit | Description |
|---|---|---|---|---|
| `GET` | `/api/admin/dashboard-stats` | Bearer Token (Admin) | General | Aggregated dashboard KPI stats & recent orders |

### Payments (`/api/payments`)
| Method | Endpoint | Protection | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/payments/create-order` | Bearer Token | WriteLimiter (30/15m) | Generates Razorpay payment order for internal pending order |
| `POST` | `/api/payments/verify` | Bearer Token | WriteLimiter (30/15m) | Validates Razorpay HMAC signature and confirms payment status |

---

## Security & Reliability Hardening

1. **Token Refresh & Lifecycle Management**:
   - `getValidAccessToken()` proactively verifies token expiration before dispatching authenticated requests.
   - `AuthListener.tsx` catches 401 token expiry responses, invokes `supabase.auth.refreshSession()`, and retries transparently.
   - `requireAuth` in Express verifies JWTs against Supabase Auth with admin client fallback validation.

2. **Rate Limiting & Abuse Prevention**:
   - `generalLimiter`: 100 requests / 15 minutes globally per IP.
   - `authLimiter`: 10 requests / 15 minutes for auth and profile modifications.
   - `writeLimiter`: 30 requests / 15 minutes for order creation, admin CRUD, and payment calls.

3. **CORS & Payload Controls**:
   - Explicit CORS whitelist restricting API access to `localhost:3000` and `https://ecommerce-site-dun-phi.vercel.app`.
   - 1MB body limit on JSON and URL-encoded payloads to block payload exhaustion attacks.

4. **Database Security (RLS)**:
   - Row-Level Security enabled on all Supabase tables (`profiles`, `products`, `orders`, `order_items`, `store_settings`, `wishlist`).
   - Express server leverages service role client only within privileged admin/order transactions.

---

## Migration Status

| Module | Frontend Integration | Express API Endpoint | Status |
|---|---|---|---|
| **Auth & Profiles** | Uses `src/frontend/lib/api/auth.ts` | `/api/auth/me`, `/api/auth/ensure-profile`, `/api/auth/profile` | ✅ **Migrated & Active** |
| **Store Settings** | Uses `src/frontend/lib/api/settings.ts` | `/api/settings`, `/api/admin/settings` | ✅ **Migrated & Active** |
| **Products (Public Catalog)** | Uses `src/frontend/lib/api/products.ts` | `/api/products`, `/api/products/:id` | ✅ **Migrated & Active** |
| **Wishlist** | Direct Supabase Client + RLS | — | ✅ **Active** |
| **Admin Products CRUD** | Ready for client swap | `/api/admin/products` (GET, POST, PUT, DELETE, PATCH) | 🔄 **API Tested & Ready** |
| **Orders & Checkout** | Ready for client swap | `/api/orders` (POST, GET, GET /:id) | 🔄 **API Tested & Ready** |
| **Payments (Razorpay)** | Ready for client swap | `/api/payments/create-order`, `/api/payments/verify` | 🔄 **API Tested & Ready** |

*All legacy unused files (`src/backend/auth/auth.ts`, `src/backend/services/settings.ts`, `src/backend/payments/razorpay.ts`) have been safely audited and removed from the codebase.*

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
