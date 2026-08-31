-- ==============================================================================
-- PHASE 9 MIGRATION: Wishlists Table with RLS Security and Constraints
-- ==============================================================================

-- 1. Create Wishlists Table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_product_wishlist UNIQUE (user_id, product_id)
);

-- 2. Indexes for high performance querying
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON public.wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_created_at ON public.wishlists(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Users can only view their own wishlist items (or admins view all)
DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlists;
CREATE POLICY "Users can view own wishlist"
ON public.wishlists
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id OR public.is_admin()
);

-- Users can only insert items for their own user_id
DROP POLICY IF EXISTS "Users can insert own wishlist" ON public.wishlists;
CREATE POLICY "Users can insert own wishlist"
ON public.wishlists
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

-- Users can only delete items from their own wishlist (or admins)
DROP POLICY IF EXISTS "Users can delete own wishlist" ON public.wishlists;
CREATE POLICY "Users can delete own wishlist"
ON public.wishlists
FOR DELETE
TO authenticated
USING (
    auth.uid() = user_id OR public.is_admin()
);
