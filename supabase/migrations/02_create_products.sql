-- ==============================================================================
-- PHASE 4 MIGRATION: Products Table, RLS Policies, Storage & Initial Seed Data
-- ==============================================================================

-- 1. Create Products Table with EXACT finalized fields
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL DEFAULT '',
    images TEXT[] NOT NULL DEFAULT '{}',
    mrp NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    discount NUMERIC NOT NULL DEFAULT 0,
    age_group TEXT NOT NULL DEFAULT '',
    size TEXT NOT NULL DEFAULT '',
    colour TEXT NOT NULL DEFAULT '',
    material TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    whats_included TEXT[] NOT NULL DEFAULT '{}',
    key_features TEXT[] NOT NULL DEFAULT '{}',
    care_instructions TEXT NOT NULL DEFAULT '',
    stock INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies for Products

-- Public/Customers: View active products. Admins: View all (active & inactive)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
ON public.products
FOR SELECT
TO public
USING (is_active = true OR public.is_admin());

-- Admins: Insert products
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Admins: Update products
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Admins: Delete products
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.is_admin());

-- 3. Storage Bucket for Products
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public can view product images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Storage RLS: Only admins can upload product images
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products' AND public.is_admin());

-- Storage RLS: Only admins can update product images
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products' AND public.is_admin());

-- Storage RLS: Only admins can delete product images
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products' AND public.is_admin());

-- 4. Initial Seed Products (Using exact finalized fields)
INSERT INTO public.products (
    id, name, brand, category, subcategory, images, mrp, price, discount,
    age_group, size, colour, material, description, whats_included, key_features,
    care_instructions, stock, is_active
) VALUES 
(
    'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c01',
    'Organic Cotton Baby Romper',
    'LittleHaven',
    'Clothing',
    'Rompers',
    ARRAY[
        'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80'
    ],
    1299,
    899,
    30,
    '0–12 Months',
    '0–6M, 6–12M',
    'Sky Blue, Soft Mint',
    '100% Organic Cotton',
    'Ultra-soft, 100% GOTS certified organic cotton romper with snap closures for effortless changing.',
    ARRAY['1x Organic Romper', '1x Matching Beanie'],
    ARRAY[
        'Nickel-free snaps along the inseam for quick changes',
        'Tagless neckline to prevent irritation on sensitive skin',
        'Breathable, lightweight cotton suitable for all seasons'
    ],
    'Machine wash cold gentle cycle. Tumble dry low.',
    15,
    true
),
(
    'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c02',
    'Wooden Stacking Activity Tower',
    'NordicWood',
    'Toys & Play',
    'Educational',
    ARRAY[
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80'
    ],
    1799,
    1399,
    22,
    '1–4 Years',
    'One Size',
    'Multicolor Pastel',
    'Natural Beech Wood, Non-toxic Water-based Paint',
    'Natural beechwood stacking toy designed to promote fine motor skills and color recognition.',
    ARRAY['7x Stacking Rings', '1x Sturdy Wooden Base', '1x Topper Ball'],
    ARRAY[
        'Smooth, rounded edges for safe sensory play',
        'Non-toxic eco-friendly water-based colors',
        'Encourages hand-eye coordination and spatial reasoning'
    ],
    'Wipe with clean damp cloth. Do not soak in water.',
    20,
    true
),
(
    'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c03',
    'Breathable Muslin Swaddle Blanket',
    'CloudCuddle',
    'Nursery & Bedding',
    'Swaddles',
    ARRAY[
        'https://images.unsplash.com/photo-1596464716127-f2a829822301?w=800&auto=format&fit=crop&q=80'
    ],
    999,
    699,
    30,
    '0–12 Months',
    '120 cm x 120 cm',
    'Pastel Cloud Blue',
    '70% Bamboo, 30% Cotton Muslin',
    'Generously sized, pre-washed bamboo muslin swaddle blanket that gets softer with every wash.',
    ARRAY['1x Swaddle Blanket'],
    ARRAY[
        'Lightweight and open weave prevents overheating',
        'Multi-use: nursing cover, stroller shade, burp cloth',
        'Ultra-gentle against newborn delicate skin'
    ],
    'Machine wash delicate at 30°C. Do not bleach.',
    25,
    true
),
(
    'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c04',
    'Soft Sole Anti-Slip First Walkers',
    'TinySteps',
    'Footwear',
    'Booties',
    ARRAY[
        'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80'
    ],
    1499,
    999,
    33,
    '6–18 Months',
    '11 cm (6-9M), 12 cm (9-12M)',
    'Cream White',
    'Canvas & Soft Rubber Sole',
    'Flexible, lightweight first walking shoes with non-slip silicone patterned soles.',
    ARRAY['1 Pair First Walker Shoes'],
    ARRAY[
        'Flexible ergonomic sole mimics barefoot walking',
        'Elastic collar for easy on and off slip-on design',
        'Breathable cotton lining keeps tiny feet dry'
    ],
    'Spot clean with mild soap and cold water.',
    8,
    true
),
(
    'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c05',
    'Silicone Feeding Meal Set',
    'NourishBabes',
    'Daily Essentials',
    'Feeding',
    ARRAY[
        'https://images.unsplash.com/photo-1584839682565-566c6ba698ea?w=800&auto=format&fit=crop&q=80'
    ],
    1599,
    1199,
    25,
    '6+ Months',
    'Standard Set',
    'Sky Mist',
    '100% Food Grade Silicone (BPA & Phthalate Free)',
    '100% food-grade silicone suction bowl, divider plate, soft-tip spoon, and catch-all bib.',
    ARRAY['1x Suction Plate', '1x Suction Bowl', '1x Adjustable Bib', '1x Ergonomic Spoon'],
    ARRAY[
        'Strong suction bases prevent tipping and mess',
        'Soft rounded spoon edges gentle on sore teething gums',
        'Deep wide front pocket bib catches all falling food'
    ],
    'Dishwasher, microwave and freezer safe (-40°C to 220°C).',
    18,
    true
),
(
    'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c06',
    'Minimalist Canvas Diaper Backpack',
    'UrbanNest',
    'Accessories',
    'Bags',
    ARRAY[
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ],
    3499,
    2499,
    28,
    'All Ages',
    'Large (22L)',
    'Oatmeal & Navy',
    'Waterproof Canvas & Vegan Leather Trim',
    'Spacious, water-resistant canvas backpack equipped with insulated bottle pockets and stroller straps.',
    ARRAY['1x Diaper Backpack', '1x Foldable Changing Mat'],
    ARRAY[
        '3x Insulated bottle compartments keeping milk fresh',
        'Dedicated wipe dispenser side pocket for instant access',
        'Padded breathable shoulder straps with stroller clips'
    ],
    'Wipe clean with a damp cloth and mild detergent.',
    12,
    true
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    images = EXCLUDED.images,
    mrp = EXCLUDED.mrp,
    price = EXCLUDED.price,
    discount = EXCLUDED.discount,
    age_group = EXCLUDED.age_group,
    size = EXCLUDED.size,
    colour = EXCLUDED.colour,
    material = EXCLUDED.material,
    description = EXCLUDED.description,
    whats_included = EXCLUDED.whats_included,
    key_features = EXCLUDED.key_features,
    care_instructions = EXCLUDED.care_instructions,
    stock = EXCLUDED.stock,
    is_active = EXCLUDED.is_active,
    updated_at = timezone('utc'::text, now());
