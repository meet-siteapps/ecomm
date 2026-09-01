# ecomm — Express API Backend

Standalone Node.js/Express/TypeScript backend for the ecomm project.
Lives alongside the Next.js frontend at `../` (the repo root).

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 18 |
| Framework | Express 4 |
| Language | TypeScript 5 (strict) |
| Validation | Zod 3 |
| Database client | @supabase/supabase-js 2 |
| Auth | Supabase JWT (RLS enforced) |
| Config | dotenv |

## Project structure

```
backend/
├── src/
│   ├── controllers/     # Route handler functions
│   ├── middleware/      # errorHandler, notFound, auth (Phase 2+)
│   ├── routes/          # Express Router instances
│   ├── services/        # Supabase client, external integrations
│   ├── types/           # Shared TypeScript interfaces
│   ├── validation/      # Zod schemas + validate() middleware factory
│   └── server.ts        # App entry point
├── dist/                # Compiled JS output (git-ignored)
├── .env.example         # Environment variable template
├── package.json
├── tsconfig.json
└── README.md
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file
cp .env.example .env
# → Fill in SUPABASE_URL and SUPABASE_ANON_KEY

# 3. Start dev server (hot-reload)
npm run dev

# 4. Verify health
curl http://localhost:5000/health
# → {"status":"ok"}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with ts-node-dev (hot-reload) |
| `npm run build` | Compile TypeScript → dist/ |
| `npm start` | Run compiled dist/server.js |
| `npm run type-check` | Type-check without emitting |

## Environment variables

See `.env.example` for the full list. Never commit real secrets.

> **Security**: Only the Supabase **anon key** is loaded here. The service-role
> key must never be used in this file — Supabase RLS policies enforce access
> control instead.

## Deployment (Railway / Render)

1. Set the env vars listed in `.env.example` in your hosting dashboard.
2. Set `NODE_ENV=production`.
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Port: Railway/Render auto-assigns `$PORT` — the server reads `process.env.PORT`.

## Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Complete | Scaffold: Express + TS + health endpoint |
| 2 | Pending | Migrate auth routes from src/backend/ |
| 3 | Pending | Migrate products routes |
| 4 | Pending | Migrate orders routes |
| 5 | Pending | Add Razorpay payments |
| 6 | Pending | Remove old src/backend/ |
