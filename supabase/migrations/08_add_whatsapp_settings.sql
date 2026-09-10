-- ==============================================================================
-- PHASE 15 MIGRATION: Add WhatsApp Business Number to Store Settings
-- and ensure payment_method column exists on orders table
-- ==============================================================================

DO $$ 
BEGIN
    -- 1. Ensure whatsapp_number column exists in store_settings
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'whatsapp_number'
    ) THEN
        ALTER TABLE public.store_settings ADD COLUMN whatsapp_number TEXT DEFAULT '+91 98765 43210';
    END IF;

    -- 2. Ensure payment_method column exists in orders table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN payment_method TEXT DEFAULT 'cod';
    END IF;
END $$;

-- Optional index on payment_method for quick filtering
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON public.orders(payment_method);
