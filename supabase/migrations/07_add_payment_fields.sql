-- ==============================================================================
-- PHASE 9 MIGRATION: Ensure Razorpay Payment Tracking Fields in Orders Table
-- ==============================================================================

-- Note: In 03_create_orders.sql, these columns were declared on the initial CREATE TABLE:
--   razorpay_order_id TEXT,
--   razorpay_payment_id TEXT,
--   razorpay_signature TEXT
--
-- This migration idempotently ensures they exist on any existing Supabase instance
-- without failing if already present.

DO $$ 
BEGIN
    -- 1. Ensure razorpay_order_id column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'razorpay_order_id'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN razorpay_order_id TEXT;
    END IF;

    -- 2. Ensure razorpay_payment_id column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'razorpay_payment_id'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN razorpay_payment_id TEXT;
    END IF;

    -- 3. Ensure razorpay_signature column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'razorpay_signature'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN razorpay_signature TEXT;
    END IF;
END $$;

-- Indexes for payment tracking lookups
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON public.orders(razorpay_payment_id);
