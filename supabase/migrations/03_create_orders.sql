-- ==============================================================================
-- PHASE 8 MIGRATION: Orders and Order Items Tables with Secure RLS & Atomic Checkout RPC
-- ==============================================================================

-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    discount NUMERIC NOT NULL DEFAULT 0,
    shipping NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    guest_token TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure guest_token column exists if table already existed
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'guest_token'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN guest_token TEXT;
    END IF;
END $$;

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_guest_token ON public.orders(guest_token);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- RLS POLICIES FOR ORDERS:
-- 1. Authenticated users can only SELECT their own orders.
-- 2. Admins can SELECT all orders.
-- 3. NO broad public SELECT for guest orders (prevents scraping customer data).
-- ==============================================================================
DROP POLICY IF EXISTS "Users can view own orders or admins all" ON public.orders;
CREATE POLICY "Users can view own orders or admins all"
ON public.orders
FOR SELECT
TO public
USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR public.is_admin()
);

-- ==============================================================================
-- INSERT POLICIES FOR ORDERS:
-- 1. Authenticated users can ONLY insert orders with their own user_id (no impersonation).
-- 2. Unauthenticated guests can ONLY insert orders with user_id = NULL.
-- ==============================================================================
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- Only Admins can update order statuses
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Only Admins can delete orders
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (public.is_admin());


-- 2. Create Order Items Table (Preserving actual purchase snapshots)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    selected_size TEXT,
    selected_colour TEXT,
    purchase_price NUMERIC NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- RLS POLICIES FOR ORDER ITEMS:
-- 1. Authenticated users can only SELECT order items from their own orders. Admins see all.
-- 2. INSERT requires verifying that the parent order belongs to the user or is a guest order.
-- ==============================================================================
DROP POLICY IF EXISTS "Users can view own order items or admins all" ON public.order_items;
CREATE POLICY "Users can view own order items or admins all"
ON public.order_items
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = public.order_items.order_id
        AND (
            (auth.uid() IS NOT NULL AND o.user_id = auth.uid())
            OR public.is_admin()
        )
    )
);

DROP POLICY IF EXISTS "Users can insert order items for their own orders" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Users can insert order items for their own orders"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = public.order_items.order_id
        AND (
            (auth.uid() IS NULL AND o.user_id IS NULL)
            OR (auth.uid() IS NOT NULL AND o.user_id = auth.uid())
        )
    )
);

-- Admins can update/delete order items
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items"
ON public.order_items
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ==============================================================================
-- 3. SECURE ATOMIC RPC: create_checkout_order
-- Performs stock validation, order creation, item insertion, and stock decrement
-- in a single ACID transaction without exposing broad table SELECT permissions.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.create_checkout_order(
    p_customer_name TEXT,
    p_customer_email TEXT,
    p_customer_phone TEXT,
    p_shipping_address JSONB,
    p_subtotal NUMERIC,
    p_discount NUMERIC,
    p_shipping NUMERIC,
    p_total NUMERIC,
    p_items JSONB,
    p_payment_method TEXT DEFAULT 'cod',
    p_guest_token TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_user_id UUID;
    v_order_id UUID;
    v_order_number TEXT;
    v_item JSONB;
    v_prod_id UUID;
    v_qty INT;
    v_current_stock INT;
    v_is_active BOOLEAN;
    v_prod_name TEXT;
    v_final_guest_token TEXT;
BEGIN
    -- 1. Determine user_id securely from auth context
    v_user_id := auth.uid();

    -- 2. Generate secure unique IDs
    v_order_id := gen_random_uuid();
    v_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
    
    IF v_user_id IS NULL THEN
        v_final_guest_token := COALESCE(p_guest_token, gen_random_uuid()::TEXT);
    ELSE
        v_final_guest_token := NULL;
    END IF;

    -- 3. Validate Stock & Availability
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_prod_id := (v_item->>'product_id')::UUID;
        v_qty := (v_item->>'quantity')::INT;

        SELECT stock, is_active, name INTO v_current_stock, v_is_active, v_prod_name
        FROM public.products
        WHERE id = v_prod_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RETURN jsonb_build_object('success', false, 'error', 'Product not found.');
        END IF;

        IF NOT v_is_active THEN
            RETURN jsonb_build_object('success', false, 'error', 'Product "' || v_prod_name || '" is currently inactive.');
        END IF;

        IF v_current_stock < v_qty THEN
            RETURN jsonb_build_object('success', false, 'error', 'Product "' || v_prod_name || '" only has ' || v_current_stock || ' left in stock.');
        END IF;
    END LOOP;

    -- 4. Insert Master Order
    INSERT INTO public.orders (
        id,
        user_id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        subtotal,
        discount,
        shipping,
        total,
        payment_status,
        order_status,
        guest_token,
        created_at,
        updated_at
    ) VALUES (
        v_order_id,
        v_user_id,
        v_order_number,
        p_customer_name,
        p_customer_email,
        p_customer_phone,
        p_shipping_address,
        p_subtotal,
        p_discount,
        p_shipping,
        p_total,
        'pending',
        'pending',
        v_final_guest_token,
        NOW(),
        NOW()
    );

    -- 5. Insert Order Items & Decrement Stock
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_prod_id := (v_item->>'product_id')::UUID;
        v_qty := (v_item->>'quantity')::INT;

        INSERT INTO public.order_items (
            id,
            order_id,
            product_id,
            product_name,
            product_image,
            selected_size,
            selected_colour,
            purchase_price,
            quantity,
            total,
            created_at
        ) VALUES (
            gen_random_uuid(),
            v_order_id,
            v_prod_id,
            v_item->>'product_name',
            COALESCE(v_item->>'product_image', ''),
            COALESCE(v_item->>'selected_size', ''),
            COALESCE(v_item->>'selected_colour', ''),
            (v_item->>'purchase_price')::NUMERIC,
            v_qty,
            ((v_item->>'purchase_price')::NUMERIC * v_qty),
            NOW()
        );

        UPDATE public.products
        SET stock = GREATEST(0, stock - v_qty),
            updated_at = NOW()
        WHERE id = v_prod_id;
    END LOOP;

    -- 6. Return response
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'guest_token', v_final_guest_token,
        'total', p_total
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;


-- ==============================================================================
-- 4. SECURE RPC: get_guest_order_by_token
-- Allows a guest customer to look up ONLY their specific order using their token.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.get_guest_order_by_token(
    p_order_id UUID,
    p_guest_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_order JSONB;
    v_items JSONB;
BEGIN
    SELECT to_jsonb(o.*) INTO v_order
    FROM public.orders o
    WHERE o.id = p_order_id
      AND o.user_id IS NULL
      AND o.guest_token = p_guest_token;

    IF v_order IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT jsonb_agg(to_jsonb(i.*)) INTO v_items
    FROM public.order_items i
    WHERE i.order_id = p_order_id;

    RETURN jsonb_set(v_order, '{items}', COALESCE(v_items, '[]'::jsonb));
END;
$$;
