-- ==============================================================================
-- PHASE 10 MIGRATION: Secure Auth Helper Functions
-- ==============================================================================

-- 1. Helper function to check if an email exists in auth.users
-- Returns boolean (true/false) only, exposing NO passwords, tokens, or personal data.
CREATE OR REPLACE FUNCTION public.check_user_exists_by_email(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE LOWER(email) = LOWER(TRIM(p_email))
    );
END;
$$;

-- Grant execution permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.check_user_exists_by_email(TEXT) TO anon, authenticated, service_role;
