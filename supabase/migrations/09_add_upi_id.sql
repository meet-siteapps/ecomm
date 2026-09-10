-- ==============================================================================
-- PHASE 16 MIGRATION: Add UPI ID to Store Settings
-- ==============================================================================

DO $$ 
BEGIN
    -- Ensure upi_id column exists in store_settings
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'store_settings' 
        AND column_name = 'upi_id'
    ) THEN
        ALTER TABLE public.store_settings ADD COLUMN upi_id TEXT DEFAULT NULL;
    END IF;
END $$;
