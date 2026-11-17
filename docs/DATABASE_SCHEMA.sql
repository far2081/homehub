-- ====================================================================
-- HomeHub - Production Relational Database Schema
-- Standard: PostgreSQL 14+ (ANSI SQL Compatible)
-- Brand: HomeHub (SHOP • STYLE • SMART)
-- Currency: PKR (Pakistani Rupee)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY, -- e.g. HH-FUR-001
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE RESTRICT,
    price_pkr NUMERIC(12, 2) NOT NULL CHECK (price_pkr >= 0),
    short_desc VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    material TEXT NOT NULL,
    dimensions VARCHAR(150) NOT NULL,
    weight VARCHAR(50),
    stock_count INT NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching and filtering
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price_pkr);
CREATE INDEX idx_products_featured ON products(is_featured);

-- 3. PRODUCT VARIANTS / COLOURS
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
    variant_code VARCHAR(50) NOT NULL, -- e.g. "soft-ivory"
    name VARCHAR(100) NOT NULL,        -- e.g. "Soft Ivory"
    hex_color VARCHAR(10) NOT NULL,    -- e.g. "#F8F5EF"
    is_default BOOLEAN DEFAULT FALSE,
    stock_override INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCT ASSET IMAGES
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    image_type VARCHAR(50) NOT NULL, -- 'main', 'alternate', 'detail', 'lifestyle'
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. DIGITAL MAGAZINE BOOKS
CREATE TABLE magazine_books (
    id VARCHAR(50) PRIMARY KEY, -- 'living-edit', 'objects-of-home', etc.
    title VARCHAR(150) NOT NULL,
    issue VARCHAR(100) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    theme_color VARCHAR(10) NOT NULL,
    cover_image TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MAGAZINE PAGES & SPREADS
CREATE TABLE magazine_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id VARCHAR(50) REFERENCES magazine_books(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    page_type VARCHAR(50) NOT NULL, -- 'cover', 'essay', 'feature', 'spread', 'lookbook', 'backcover'
    kicker VARCHAR(100),
    headline VARCHAR(200) NOT NULL,
    deck TEXT,
    body_paragraphs JSONB,
    pullquote TEXT,
    hero_image TEXT,
    colophon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_book_page UNIQUE (book_id, page_number)
);

-- 7. MAGAZINE PRODUCT HOTSPOTS
CREATE TABLE magazine_product_hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES magazine_pages(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE RESTRICT,
    label_override VARCHAR(100),
    badge_text VARCHAR(50),
    pos_x_percent NUMERIC(5,2),
    pos_y_percent NUMERIC(5,2)
);

-- 8. CUSTOMERS & USERS (ADMIN / CLIENTS)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER', -- 'CUSTOMER', 'ADMIN', 'STUDIO_STAFF'
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ORDERS TABLE
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. ORD-2026-0001
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_street TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_country VARCHAR(100) DEFAULT 'Pakistan',
    subtotal_pkr NUMERIC(12, 2) NOT NULL,
    shipping_fee_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_pkr NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'FAILED', 'REFUNDED'
    fulfillment_status VARCHAR(50) NOT NULL DEFAULT 'UNFULFILLED', -- 'UNFULFILLED', 'IN_ATELIER', 'DISPATCHED', 'DELIVERED'
    payment_gateway_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ORDER ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    unit_price_pkr NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price_pkr NUMERIC(12, 2) NOT NULL
);
