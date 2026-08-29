-- ==============================================================================
-- PHASE 14 MIGRATION: Store Settings in Supabase
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    store_name TEXT NOT NULL DEFAULT 'Baby Ladoo',
    tagline TEXT DEFAULT 'Curated baby & kids essentials',
    contact_email TEXT NOT NULL DEFAULT 'support@babyladoo.com',
    contact_phone TEXT NOT NULL DEFAULT '+91 98765 43210',
    store_address TEXT DEFAULT 'Ahmedabad, Gujarat, India',
    shipping_fee NUMERIC NOT NULL DEFAULT 99,
    free_shipping_threshold NUMERIC NOT NULL DEFAULT 999,
    tax_percentage NUMERIC NOT NULL DEFAULT 0,
    currency_symbol TEXT NOT NULL DEFAULT '₹',
    is_cod_enabled BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Everyone (customers/guests/admin) can read store settings
DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings"
ON public.store_settings
FOR SELECT
TO public
USING (true);

-- Only authenticated Admins can insert/update settings
DROP POLICY IF EXISTS "Admins can update store settings" ON public.store_settings;
CREATE POLICY "Admins can update store settings"
ON public.store_settings
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Seed initial default settings if table is empty
INSERT INTO public.store_settings (
    id,
    store_name,
    tagline,
    contact_email,
    contact_phone,
    store_address,
    shipping_fee,
    free_shipping_threshold,
    tax_percentage,
    currency_symbol,
    is_cod_enabled
) VALUES (
    'default',
    'Baby Ladoo',
    'Curated baby & kids essentials',
    'support@babyladoo.com',
    '+91 98765 43210',
    'Ahmedabad, Gujarat, India',
    99,
    999,
    0,
    '₹',
    true
)
ON CONFLICT (id) DO NOTHING;
