-- ====================================================================
-- HOMEHUB — COMPLETE PRODUCTION DATABASE SETUP & SECURITY MIGRATION
-- Brand: HomeHub (SHOP • STYLE • SMART)
-- Platform: Supabase / PostgreSQL 14+ (pgcrypto & UUID enabled)
-- Target Project: webstore
-- ====================================================================

-- --------------------------------------------------------------------
-- 0. CORE EXTENSIONS
-- --------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. UTILITY FUNCTIONS & UPDATED_AT TRIGGER
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------------------
-- 2. CATEGORIES TABLE (All 9 HomeHub Destinations)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(50) PRIMARY KEY, -- slug: e.g. 'living-room', 'bedroom'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 3. PRODUCTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'HH-FUR-001'
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category_id VARCHAR(50) NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    price_pkr NUMERIC(12, 2) NOT NULL CHECK (price_pkr >= 0),
    short_desc VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    material TEXT NOT NULL,
    dimensions VARCHAR(150) NOT NULL,
    weight VARCHAR(50),
    stock_count INT NOT NULL DEFAULT 10 CHECK (stock_count >= 0),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    images JSONB DEFAULT '[]'::jsonb NOT NULL,
    variants JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price_pkr ON public.products(price_pkr);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 4. CUSTOMERS TABLE (Guest Checkout Support — Does NOT require auth.users)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- optional link for registered users
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    is_guest BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON public.customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

DROP TRIGGER IF EXISTS trigger_customers_updated_at ON public.customers;
CREATE TRIGGER trigger_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 5. ORDERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'HH-2026-9042'
    customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_country VARCHAR(100) DEFAULT 'Pakistan' NOT NULL,
    subtotal_pkr NUMERIC(12, 2) NOT NULL CHECK (subtotal_pkr >= 0),
    shipping_fee_pkr NUMERIC(12, 2) DEFAULT 0 NOT NULL CHECK (shipping_fee_pkr >= 0),
    total_pkr NUMERIC(12, 2) NOT NULL CHECK (total_pkr >= 0),
    order_status VARCHAR(50) DEFAULT 'PENDING' NOT NULL CHECK (order_status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED')),
    payment_status VARCHAR(50) DEFAULT 'PENDING' NOT NULL CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    payment_method VARCHAR(50) DEFAULT 'PROFORMA_INVOICE' NOT NULL,
    customer_notes TEXT,
    internal_admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 6. ORDER ITEMS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    sku VARCHAR(50) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    variant_name VARCHAR(100),
    unit_price_pkr NUMERIC(12, 2) NOT NULL CHECK (unit_price_pkr >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price_pkr NUMERIC(12, 2) NOT NULL CHECK (total_price_pkr >= 0),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_sku ON public.order_items(sku);

-- --------------------------------------------------------------------
-- 7. ADMIN PROFILES TABLE (Strict RBAC Protection)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'ADMIN' NOT NULL CHECK (role IN ('ADMIN', 'SUPER_ADMIN', 'STUDIO_EDITOR')),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_is_active ON public.admin_profiles(is_active);

DROP TRIGGER IF EXISTS trigger_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER trigger_admin_profiles_updated_at
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 8. SECURITY DEFINER HELPER: IS_ADMIN()
-- Prevents recursive policies & avoids leaking service_role key to client
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.admin_profiles
        WHERE id = auth.uid()
          AND is_active = TRUE
    );
END;
$$;

-- --------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

-- Enable RLS on all operational tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- 9.1 CATEGORIES POLICIES
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Only admins can modify categories" ON public.categories;
CREATE POLICY "Only admins can modify categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 9.2 PRODUCTS POLICIES
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Only admins can insert products" ON public.products;
CREATE POLICY "Only admins can insert products"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can update products" ON public.products;
CREATE POLICY "Only admins can update products"
    ON public.products FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can delete products" ON public.products;
CREATE POLICY "Only admins can delete products"
    ON public.products FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 9.3 CUSTOMERS POLICIES
DROP POLICY IF EXISTS "Admins can view all customers" ON public.customers;
CREATE POLICY "Admins can view all customers"
    ON public.customers FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view own customer profile" ON public.customers;
CREATE POLICY "Users can view own customer profile"
    ON public.customers FOR SELECT
    TO authenticated
    USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Admins can modify customer records" ON public.customers;
CREATE POLICY "Admins can modify customer records"
    ON public.customers FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 9.4 ORDERS POLICIES
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
CREATE POLICY "Admins have full access to orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Registered customers can view own orders" ON public.orders;
CREATE POLICY "Registered customers can view own orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
        )
    );

-- 9.5 ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Admins have full access to order items" ON public.order_items;
CREATE POLICY "Admins have full access to order items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Registered customers can view own order items" ON public.order_items;
CREATE POLICY "Registered customers can view own order items"
    ON public.order_items FOR SELECT
    TO authenticated
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE customer_id IN (
                SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
            )
        )
    );

-- 9.6 ADMIN PROFILES POLICIES
DROP POLICY IF EXISTS "Admins can view admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can view admin profiles"
    ON public.admin_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Only super admin can modify admin profiles" ON public.admin_profiles;
CREATE POLICY "Only super admin can modify admin profiles"
    ON public.admin_profiles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'SUPER_ADMIN' AND is_active = TRUE
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'SUPER_ADMIN' AND is_active = TRUE
        )
    );

-- --------------------------------------------------------------------
-- 10. SECURE SERVER-SIDE ORDER CREATION FUNCTION
-- Validates real prices from products table, prevents frontend tampering,
-- checks stock, creates customer & order atomically.
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_homehub_order(
    p_customer_name VARCHAR(150),
    p_customer_email VARCHAR(255),
    p_customer_phone VARCHAR(50),
    p_shipping_address TEXT,
    p_shipping_city VARCHAR(100),
    p_shipping_country VARCHAR(100) DEFAULT 'Pakistan',
    p_items JSONB DEFAULT '[]'::jsonb, -- Array of {"sku": "...", "quantity": 1, "variant_name": "..."}
    p_customer_notes TEXT DEFAULT NULL,
    p_auth_user_id UUID DEFAULT NULL
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
    v_customer_id UUID;
    v_order_id UUID;
    v_order_number VARCHAR(50);
    v_subtotal NUMERIC(12, 2) := 0;
    v_shipping_fee NUMERIC(12, 2) := 0;
    v_total NUMERIC(12, 2) := 0;
    v_item RECORD;
    v_prod RECORD;
    v_line_total NUMERIC(12, 2);
    v_item_count INT := 0;
BEGIN
    -- 1. Validate inputs
    IF TRIM(COALESCE(p_customer_name, '')) = '' THEN
        RAISE EXCEPTION 'Customer name is required.';
    END IF;
    IF TRIM(COALESCE(p_customer_email, '')) = '' OR p_customer_email NOT LIKE '%@%.%' THEN
        RAISE EXCEPTION 'A valid customer email is required.';
    END IF;
    IF TRIM(COALESCE(p_customer_phone, '')) = '' THEN
        RAISE EXCEPTION 'Customer phone number is required.';
    END IF;
    IF TRIM(COALESCE(p_shipping_address, '')) = '' THEN
        RAISE EXCEPTION 'Shipping delivery address is required.';
    END IF;
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item.';
    END IF;

    -- 2. Lookup or create customer record (Guest or Authenticated)
    SELECT id INTO v_customer_id
    FROM public.customers
    WHERE email = LOWER(TRIM(p_customer_email))
    LIMIT 1;

    IF v_customer_id IS NULL THEN
        INSERT INTO public.customers (
            auth_user_id,
            email,
            full_name,
            phone,
            city,
            address,
            is_guest
        ) VALUES (
            p_auth_user_id,
            LOWER(TRIM(p_customer_email)),
            TRIM(p_customer_name),
            TRIM(p_customer_phone),
            TRIM(p_shipping_city),
            TRIM(p_shipping_address),
            (p_auth_user_id IS NULL)
        )
        RETURNING id INTO v_customer_id;
    ELSE
        -- Update contact info with latest order details
        UPDATE public.customers
        SET full_name = TRIM(p_customer_name),
            phone = TRIM(p_customer_phone),
            city = TRIM(p_shipping_city),
            address = TRIM(p_shipping_address),
            auth_user_id = COALESCE(auth_user_id, p_auth_user_id)
        WHERE id = v_customer_id;
    END IF;

    -- 3. Calculate verified subtotal server-side using actual products table prices
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
        sku VARCHAR(50),
        quantity INT,
        variant_name VARCHAR(100)
    )
    LOOP
        IF v_item.quantity <= 0 THEN
            RAISE EXCEPTION 'Item quantity must be greater than zero.';
        END IF;

        -- Fetch official product price and stock lock
        SELECT id, sku, name, price_pkr, stock_count, is_active
        INTO v_prod
        FROM public.products
        WHERE sku = v_item.sku
        FOR UPDATE; -- lock row to prevent race conditions on inventory

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product with SKU "%" does not exist.', v_item.sku;
        END IF;

        IF v_prod.is_active = FALSE THEN
            RAISE EXCEPTION 'Product "%" is currently discontinued.', v_prod.name;
        END IF;

        IF v_prod.stock_count < v_item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for "%". Available: %, Requested: %.', v_prod.name, v_prod.stock_count, v_item.quantity;
        END IF;

        v_line_total := v_prod.price_pkr * v_item.quantity;
        v_subtotal := v_subtotal + v_line_total;
        v_item_count := v_item_count + 1;
    END LOOP;

    -- Standard White-Glove Curated Delivery Policy (Free over PKR 100,000, else flat PKR 2,500)
    IF v_subtotal >= 100000 THEN
        v_shipping_fee := 0;
    ELSE
        v_shipping_fee := 2500;
    END IF;

    v_total := v_subtotal + v_shipping_fee;

    -- 4. Generate unique readable order number: HH-YEAR-RANDOM
    v_order_number := 'HH-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text), 1, 6));

    -- 5. Insert Order
    INSERT INTO public.orders (
        order_number,
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        shipping_city,
        shipping_country,
        subtotal_pkr,
        shipping_fee_pkr,
        total_pkr,
        order_status,
        payment_status,
        payment_method,
        customer_notes
    ) VALUES (
        v_order_number,
        v_customer_id,
        TRIM(p_customer_name),
        LOWER(TRIM(p_customer_email)),
        TRIM(p_customer_phone),
        TRIM(p_shipping_address),
        TRIM(p_shipping_city),
        COALESCE(TRIM(p_shipping_country), 'Pakistan'),
        v_subtotal,
        v_shipping_fee,
        v_total,
        'PENDING',
        'PENDING',
        'PROFORMA_INVOICE',
        p_customer_notes
    )
    RETURNING id INTO v_order_id;

    -- 6. Insert Order Items & decrement stock atomically
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
        sku VARCHAR(50),
        quantity INT,
        variant_name VARCHAR(100)
    )
    LOOP
        SELECT id, sku, name, price_pkr INTO v_prod
        FROM public.products
        WHERE sku = v_item.sku;

        v_line_total := v_prod.price_pkr * v_item.quantity;

        INSERT INTO public.order_items (
            order_id,
            product_id,
            sku,
            product_name,
            variant_name,
            unit_price_pkr,
            quantity,
            total_price_pkr
        ) VALUES (
            v_order_id,
            v_prod.id,
            v_prod.sku,
            v_prod.name,
            v_item.variant_name,
            v_prod.price_pkr,
            v_item.quantity,
            v_line_total
        );

        -- Decrement stock count
        UPDATE public.products
        SET stock_count = stock_count - v_item.quantity
        WHERE id = v_prod.id;
    END LOOP;

    -- 7. Return complete order confirmation object
    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'customer_name', TRIM(p_customer_name),
        'customer_email', LOWER(TRIM(p_customer_email)),
        'subtotal_pkr', v_subtotal,
        'shipping_fee_pkr', v_shipping_fee,
        'total_pkr', v_total,
        'order_status', 'PENDING',
        'items_count', v_item_count
    );
END;
$$;

-- Grant execution to public / anonymous visitors for secure guest checkout
GRANT EXECUTE ON FUNCTION public.create_homehub_order TO anon, authenticated;

-- --------------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKET FOR PRODUCT PHOTOGRAPHY
-- (Configured to accept ALL image extensions: .jfif, .jpg, .jpeg, .png, .webp, .avif, .gif, .bmp, .svg)
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    TRUE,
    10485760, -- 10MB limit per image
    NULL -- NULL allows all image and media extensions without restriction
)
ON CONFLICT (id) DO UPDATE SET
    public = TRUE,
    file_size_limit = 10485760,
    allowed_mime_types = NULL;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin())
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());

-- --------------------------------------------------------------------
-- 12. INITIAL CATEGORIES SEED DATA (All 9 HomeHub Destinations)
-- --------------------------------------------------------------------
INSERT INTO public.categories (id, name, description, display_order, is_active)
VALUES
    ('bedroom', 'The Bedroom Sanctuary', 'Tactile organic linens, platform joinery, and serene ambient lighting designed for restoration.', 1, TRUE),
    ('living-room', 'The Living Room Salon', 'Architectural silhouettes, low-profile seating, and solid timber centerpieces tailored for serene living.', 2, TRUE),
    ('dining-room', 'The Dining Room Atelier', 'Monolithic travertine tables, sculpted oak seating, and intimate pendant illumination.', 3, TRUE),
    ('furniture', 'The Furniture Atelier', 'Solid hardwoods, monolithic stone slabs, and tactile upholstery designed to last generations.', 4, TRUE),
    ('small-spaces', 'Small Space Solutions', 'Intelligent modular living, dual-height nested desks, and slatted wall-hung consoles.', 5, TRUE),
    ('kitchen', 'Kitchen & Culinary', 'Artisanal kitchen storage, solid timber accessories, and architectural functional objects.', 6, TRUE),
    ('lighting', 'Architectural & Ambient Lighting', '2700K circadian warmth, triplex opal glass pendants, and heavy travertine table lamps.', 7, TRUE),
    ('decor', 'Objects of Home & Décor', 'Wheel-thrown ceramics, cast-bronze mirrors, and tactile linen cushion textiles.', 8, TRUE),
    ('storage', 'Storage & Architectural Joinery', 'Floating consoles, tambour slats, and seamless cable-management cabinetry.', 9, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

-- --------------------------------------------------------------------
-- 13. INITIAL HOMEHUB PRODUCTS SEED DATA (14 Core Pieces)
-- --------------------------------------------------------------------
INSERT INTO public.products (id, sku, name, category_id, price_pkr, short_desc, description, material, dimensions, weight, stock_count, is_featured, is_active, images, variants)
VALUES
(
    'HH-FUR-001',
    'HH-FUR-001',
    'CloudCurve Sofa',
    'furniture',
    345000.00,
    'Sculptural curved 3-seater sofa in premium textured Italian bouclé.',
    'The CloudCurve Sofa anchors the modern living room with organic, monolithic serenity. Wrapped in heavyweight Italian bouclé with a high-density ergonomic latex core and reinforced kiln-dried European ash frame.',
    'Heavyweight Italian Bouclé Wool, FSC European Ash Frame, High-Resilience Latex',
    '240 × 105 × 74 cm (Seat Height: 42 cm)',
    '78 kg',
    8,
    TRUE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85", "caption": "CloudCurve Sofa in Soft Ivory", "type": "main"}]'::jsonb,
    '[{"id": "var-ivory", "name": "Soft Ivory", "hex": "#F8F5EF"}, {"id": "var-sand", "name": "Warm Sand", "hex": "#EADCCB"}, {"id": "var-sage", "name": "Sage Mist", "hex": "#DDE8DF"}]'::jsonb
),
(
    'HH-FUR-002',
    'HH-FUR-002',
    'Noma Coffee Table',
    'furniture',
    125000.00,
    'Monolithic Roman travertine slab with soft rounded bullnose contours.',
    'Cut from single quarry blocks of Roman travertine stone. Natural porous cavities are hand-honed to preserve geological character while sealing the surface against everyday stains.',
    'Solid Honed Italian Travertine Stone (Matte Sealer Finish)',
    '130 × 75 × 34 cm',
    '64 kg',
    12,
    TRUE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85", "caption": "Noma Coffee Table in Natural Travertine", "type": "main"}]'::jsonb,
    '[{"id": "var-travertine", "name": "Classic Roman Travertine", "hex": "#E8DEC8"}, {"id": "var-silver", "name": "Silver Vein Travertine", "hex": "#D4CFCA"}]'::jsonb
),
(
    'HH-FUR-003',
    'HH-FUR-003',
    'Aura Lounge Chair',
    'furniture',
    165000.00,
    'Low-slung sculptural accent armchair with 360-degree silent swivel.',
    'An inviting reading sanctuary. Featuring deep contoured bucket ergonomics, Australian merino shearling upholstery, and a weighted solid bronze swivel disc hidden below the base.',
    'Curly Merino Shearling / Bouclé, Cast Bronze Swivel Mechanism, Molded Foam',
    '88 × 85 × 72 cm (Seat Height: 40 cm)',
    '32 kg',
    6,
    TRUE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85", "caption": "Aura Lounge Chair in Shearling", "type": "main"}]'::jsonb,
    '[{"id": "var-shearling", "name": "Merino Shearling", "hex": "#FAF6F0"}, {"id": "var-caramel", "name": "Caramel Boucle", "hex": "#C8A27A"}]'::jsonb
),
(
    'HH-FUR-004',
    'HH-FUR-004',
    'Haven Platform Bed',
    'bedroom',
    285000.00,
    'Low-profile architectural platform bed with integrated floating nightstands.',
    'Designed to lower the room datum and open up ceiling volume in contemporary bedrooms. Solid European oak platform with cushioned bouclé headboard and flush cantilevered side ledges.',
    'Solid White Oak, Natural Bouclé Headboard, German Concealed Hardware',
    'King: 220 × 210 × 78 cm (Platform Height: 26 cm)',
    '95 kg',
    5,
    TRUE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85", "caption": "Haven Platform Bed in Oak", "type": "main"}]'::jsonb,
    '[{"id": "var-natural-oak", "name": "Natural White Oak", "hex": "#D9C3A5"}, {"id": "var-smoked-oak", "name": "Smoked Oak", "hex": "#5A4D41"}]'::jsonb
),
(
    'HH-LGT-001',
    'HH-LGT-001',
    'Luna Pendant Light',
    'lighting',
    42000.00,
    'Mouth-blown triplex opal glass sphere with spun champagne brass canopy.',
    'Provides 360-degree glare-free ambient glow calibrated to the 2700K Circadian Standard. Triplex three-layer casing produces velvety moon-like illumination ideal for dining tables and stairwells.',
    'Mouth-Blown Triplex Cased Opal Glass, Spun Champagne Brass, Braided Cable',
    'Diameter: 35 cm (Suspension Drop: up to 250 cm adjustable)',
    '4.2 kg',
    20,
    TRUE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85", "caption": "Luna Pendant Light in Brass & Opal", "type": "main"}]'::jsonb,
    '[{"id": "var-brass", "name": "Champagne Brass", "hex": "#D6BC91"}, {"id": "var-bronze", "name": "Statuary Bronze", "hex": "#3E3835"}]'::jsonb
),
(
    'HH-LGT-002',
    'HH-LGT-002',
    'Arc Floor Lamp',
    'lighting',
    78500.00,
    'Graceful cantilevered arch with weighted honed Brescia marble plinth base.',
    'Suspends ambient light precisely over lounge seating without overhead wiring. Foot-switch operated with smooth step-less continuous rotary dimming.',
    'Honed Brescia Marble Base, Carbon Steel Arc, Spun Aluminum Shade',
    'Reach: 185 cm, Height: 215 cm, Base Diameter: 40 cm',
    '28 kg',
    9,
    TRUE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85", "caption": "Arc Floor Lamp", "type": "main"}]'::jsonb,
    '[{"id": "var-black-marble", "name": "Nero Marquina / Black Arc", "hex": "#222222"}, {"id": "var-white-marble", "name": "Carrara / Brass Arc", "hex": "#E5E0D8"}]'::jsonb
),
(
    'HH-LGT-003',
    'HH-LGT-003',
    'Glow Table Lamp',
    'lighting',
    24500.00,
    'Turned travertine stone cylinder base with 3-stage capacitive touch dimmer.',
    'Compact bedside and credenza companion. Touching the solid brass thumb button cycles through 15%, 50%, and 100% warm 2700K illumination.',
    'Solid Turned Roman Travertine, Opal Glass Globe, Touch Sensor Electronics',
    '18 × 18 × 32 cm',
    '5.6 kg',
    15,
    FALSE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1200&q=85", "caption": "Glow Table Lamp", "type": "main"}]'::jsonb,
    '[{"id": "var-travertine", "name": "Honed Travertine", "hex": "#E8DEC8"}]'::jsonb
),
(
    'HH-LGT-004',
    'HH-LGT-004',
    'Aura Wall Sconce',
    'lighting',
    19500.00,
    'Dual-direction architectural wall wash light in heavy unlacquered brass.',
    'Casts gentle upward and downward light halos across vertical room partitions. Designed to illuminate hallways and bedside headboards without visible diode points.',
    'Cast Solid Brass, Frosted Borosilicate Diffusers, High-CRI 95+ LED',
    '14 × 12 × 22 cm',
    '2.8 kg',
    18,
    FALSE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=85", "caption": "Aura Wall Sconce", "type": "main"}]'::jsonb,
    '[{"id": "var-brass", "name": "Brushed Brass", "hex": "#D4AF37"}, {"id": "var-black", "name": "Matte Charcoal", "hex": "#2B2B2B"}]'::jsonb
),
(
    'HH-DEC-001',
    'HH-DEC-001',
    'Solis Ceramic Vases (Set of 2)',
    'decor',
    18500.00,
    'Hand-thrown artisanal stoneware vessels with open-pore textured mineral glaze.',
    'Molded by master ceramists using iron-rich terracotta and silica slips. Perfect sculptural accents for credenzas, floating shelves, or dining centerpieces.',
    'Wheel-Thrown High-Fire Stoneware, Matte Mineral Slip Glaze',
    'Large: 18 × 34 cm, Small: 14 × 22 cm',
    '4.8 kg (set)',
    25,
    TRUE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85", "caption": "Solis Ceramic Vases", "type": "main"}]'::jsonb,
    '[{"id": "var-chalk", "name": "Chalk White", "hex": "#F4F1EA"}, {"id": "var-terracotta", "name": "Raw Terracotta", "hex": "#B86B4D"}]'::jsonb
),
(
    'HH-DEC-002',
    'HH-DEC-002',
    'Relief Wall Sculpture',
    'decor',
    32000.00,
    'Cast mineral plaster and marble dust bas-relief art panel in solid ash frame.',
    'Tactile three-dimensional wall art that changes character with the movement of room daylight. Cast using natural plaster, crushed limestone, and framed in natural ash.',
    'Cast Mineral Gypsum & Marble Dust, Solid European Ash Float Frame',
    '90 × 120 × 4 cm',
    '14 kg',
    8,
    FALSE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=85", "caption": "Relief Wall Sculpture", "type": "main"}]'::jsonb,
    '[{"id": "var-plaster", "name": "Natural Gypsum Cream", "hex": "#EFECE6"}]'::jsonb
),
(
    'HH-DEC-003',
    'HH-DEC-003',
    'CloudSoft Cushions (Pair)',
    'decor',
    14500.00,
    'Dual-sided cushions in washed French flax linen and soft woven bouclé.',
    'Plumped with 100% ethically sourced down-alternative microfibers. Pre-washed for relaxed heirloom hand-feel that softens with every wash.',
    '100% French Flax Linen, Italian Wool Bouclé Backing, Hypoallergenic Fill',
    '50 × 50 cm each (Pair of 2)',
    '2.1 kg (pair)',
    30,
    FALSE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85", "caption": "CloudSoft Cushions", "type": "main"}]'::jsonb,
    '[{"id": "var-linen-dune", "name": "Dune Linen / Ivory Bouclé", "hex": "#E2DACF"}, {"id": "var-linen-sage", "name": "Sage Mist / Cream", "hex": "#CBD5C8"}]'::jsonb
),
(
    'HH-DEC-004',
    'HH-DEC-004',
    'Halo Pebble Mirror',
    'decor',
    38000.00,
    'Organic asymmetric freeform mirror with hand-brazed unlacquered brass rim.',
    'Eliminates rigid rectangular geometry from walls. Made with high-definition float glass backed by silver leaf to ensure true clarity and zero optic distortion.',
    'Unlacquered Solid Brass Rim, Ultra-Clear 6mm Distortion-Free Float Glass',
    '75 × 110 × 3 cm',
    '11.5 kg',
    14,
    TRUE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1590402494587-44b71d7772f6?auto=format&fit=crop&w=1200&q=85", "caption": "Halo Pebble Mirror", "type": "main"}]'::jsonb,
    '[{"id": "var-brass", "name": "Unlacquered Living Brass", "hex": "#C9A86A"}, {"id": "var-black", "name": "Blackened Patina", "hex": "#3A3532"}]'::jsonb
),
(
    'HH-SSS-001',
    'HH-SSS-001',
    'Modula Nested Desk & Console',
    'small-spaces',
    88500.00,
    'Dual-height space-saving unit: expands from 40cm credenza to 80cm workstation.',
    'Engineered specifically for compact city lofts. By day, the lower desk rolls out smoothly on German ball-bearing castors to reveal a 140cm workspace. By night, it tucks away to reclaim 2 square meters of floor space.',
    'Solid Kiln-Dried European Oak, Fluted Oak Veneer, Concealed Glides',
    'Console: 140 × 40 × 85 cm • Rollout Desk: 130 × 75 × 74 cm',
    '52 kg',
    10,
    TRUE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85", "caption": "Modula Nested Desk", "type": "main"}]'::jsonb,
    '[{"id": "var-natural-oak", "name": "Natural Oak", "hex": "#D6C2A5"}, {"id": "var-black-oak", "name": "Black Stained Oak", "hex": "#272727"}]'::jsonb
),
(
    'HH-SSS-002',
    'HH-SSS-002',
    'Flute Floating Wall Console',
    'small-spaces',
    64000.00,
    'Zero-floor-footprint wall-hung media console with sliding tambour slatted doors.',
    'Mounts directly to masonry or drywall using heavy-duty French-cleat brackets. Preserves visible continuous floor sightlines to make compact rooms appear expansive.',
    'FSC European Oak, Heavy-Duty Canvas-Backed Tambour Slats, French Cleat',
    '150 × 35 × 28 cm',
    '26 kg',
    12,
    TRUE,
    TRUE,
    '[{"url": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85", "caption": "Flute Floating Console", "type": "main"}]'::jsonb,
    '[{"id": "var-natural-oak", "name": "Natural Oak", "hex": "#D6C2A5"}, {"id": "var-walnut", "name": "American Walnut", "hex": "#6F4E37"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    sku = EXCLUDED.sku,
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    price_pkr = EXCLUDED.price_pkr,
    short_desc = EXCLUDED.short_desc,
    description = EXCLUDED.description,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    weight = EXCLUDED.weight,
    stock_count = EXCLUDED.stock_count,
    is_featured = EXCLUDED.is_featured,
    is_active = EXCLUDED.is_active,
    images = EXCLUDED.images,
    variants = EXCLUDED.variants;

-- ====================================================================
-- END OF MIGRATION
-- All tables, functions, RLS policies, triggers, and seed data prepared.
-- ====================================================================
