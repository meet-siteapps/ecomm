# E-Commerce Application

A clean, modern e-commerce storefront built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui utilities, and Supabase.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components & Utilities**: [shadcn/ui](https://ui.shadcn.com/) (`clsx`, `tailwind-merge`)
- **Backend / Database**: [Supabase](https://supabase.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/meet-siteapps/ecomm.git
cd ecomm
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.