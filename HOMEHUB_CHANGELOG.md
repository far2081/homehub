# HomeHub — Project Changelog

All notable changes, bug fixes, enhancements, and architectural migrations are documented in this file.

---

### [2.2.0] - 2026-11-18
#### Visual Design System & Aesthetic Overhaul (Claude-Quality Quiet Luxury)
- **Cohesive Luxury Editorial Color Palette:**
  - Replaced harsh, saturated terracotta tones with a sophisticated, harmonious interior lifestyle palette:
    - Warm Ivory (`#F8F5EF`), Cream (`#FBF9F5`), Sage (`#DDE8DF`), Muted Olive (`#899581`), Warm Taupe (`#B8AA98`), Natural Beige (`#EADCCB`), Dusty Blush (`#E9D8D0`), Soft Champagne (`#D6BC91`), Deep Charcoal (`#302E2A`).
  - Strict prohibition against neon accents, bright saturated gradients, and cheap-looking borders.
- **Editorial Typography System:**
  - Standardized font tokens pairing `Cormorant Garamond` (editorial titles, book headlines, kicker serif accents) with `Plus Jakarta Sans` (refined UI controls, tracking 0.12em–0.24em, comfortable reading scale).
- **Multi-Layer Elevation Shadows:**
  - Replaced heavy black box-shadows with quiet luxury layered soft charcoal shadows (`rgba(48, 46, 42, 0.04-0.08)`) with subtle warm tone diffusion.
- **Component Styling Modernization:**
  - **Navigation & Announcement Bar:** Refined pill counters, champagne hover underlines, and muted olive category headers.
  - **Hero & Editorial Kickers:** Cleaned up hero section, eliminated high-contrast gradients, and added warm ivory ground transitions.
  - **Product Cards & Catalogue Grid:** Refined vertical aspect ratio (110%), smooth hover elevation (-4px), muted olive wishlist heart states, and soft champagne borders.
  - **Digital Magazines (3D Flipbook):** Updated spine depth, page borders, hotspot badges, and volume indicators to soft champagne and muted olive.
  - **Curated Video Masterclasses:** Updated video chips, author tags, architectural takeaway pills, and modal borders.
  - **Site Footer:** Replaced hardcoded black with Deep Charcoal (`#302E2A`), Warm Ivory typography, Soft Champagne hover transitions, and Warm Taupe metadata.
  - **SaaS Admin Portal:** Cleaned up badge styles, demo indicator tags, and metric containers to match the unified brand palette.
- **Verification:**
  - All 369 automated tests (syntax audits, functional e2e, Supabase integration, plugins, coupons, CRM) pass cleanly.

---

### [2.1.0] - 2026-11-18
#### Added
- **Promotional Coupon Engine:** Created `js/services/couponService.js` supporting percentage (%) and fixed PKR (₨) vouchers, minimum order thresholds, and redemption tracking. Preloaded with `HOMEHUB10`, `WELCOME5000`, `SPRINGSTYLE`, and `LUXURY20`.
- **Client Directory & CRM Service:** Created `js/services/customerService.js` aggregating customer purchase histories, lifetime PKR spend, and client privilege tiers (`Platinum Privileged`, `Gold Atelier Member`, `Silver Patron`).
- **Storefront Bag & Checkout Coupon Support:** Integrated coupon code input in `js/components/cart.js` with instant discount calculation, promotional badges, and breakdown in the order summary.
- **Fail-Safe Offline Order Queue:** Enhanced guest checkout so orders are recorded to both remote Supabase (when online) and persistent local storage (`homehub_orders`), guaranteeing zero checkout dropouts.
- **SaaS Admin Expansion:**
  - **Modules & Plugins (15):** Interactive module directory backed by `pluginRegistry.js` with category filters and live toggle switches. Core modules protected by safety locks.
  - **Sales & Operational Analytics:** Live KPI cards for gross revenue in PKR, order velocity, average order value (AOV), inventory units, category breakdown bars, and fulfillment pipeline tracking.
  - **Client Directory:** Patron registry table with tier badges, contact channels, city routing, and order logs.
  - **Promotions & Coupons Management:** Admin interface for creating, enabling, disabling, and deleting promotional vouchers.
  - **Quick Restock (+5 Units):** Critical low-stock table with instant 1-click restock buttons.
- **Automated Test Expansion:** Added 24 automated test cases to `test-e2e-headless.js` covering modular plugin lifecycles, coupon validation, and CRM tracking. Total passing test count increased to 369 with 0 failures.

---

### [2.0.0] - 2026-11-18
#### Added
- **PWA Capabilities:** Added `manifest.json` and `sw.js` for full Android PWA installability, caching static assets and providing offline mode.
- **Modular Plugin Architecture:** Created `js/services/pluginRegistry.js` supporting 15 modular feature flags and lifecycle hooks without external dependencies.
- **Local Atelier Storage Fallback:** Configured `/api/upload` endpoint in `server.js` ensuring product image uploads never fail even when cloud Supabase storage is offline or paused.
- **Universal Image MIME Normalization:** Added support for `.jfif`, `.webp`, `.avif`, `.bmp`, `.gif`, `.tiff` across client upload forms and database configurations.

#### Changed
- Normalized currency rendering across the application to Pakistani Rupee (`₨` / `PKR`).
- Updated database setup script `supabase/HOMEHUB_DATABASE_SETUP.sql` setting `allowed_mime_types = NULL` in `storage.buckets` to remove all image format restrictions.

#### Fixed
- Fixed "Storage error: Failed to fetch" when uploading `.jfif` images by converting to standard JPEG MIME and providing local storage fallback.
- Fixed category product grid layout across all 9 room categories to adhere strictly to equal 6-column desktop, 3-column tablet, and 2-column mobile rules.
- Fixed 3D flipbook page-turn jerking by optimizing CSS 3D transforms, avoiding forced reflows, and utilizing `requestAnimationFrame`.
- Removed duplicate images across the 4 digital magazine editions (*The Living Edit*, *Objects of Home*, *Light / Life*, *Small Spaces*).

---

### [1.0.0] - 2026-11-17
#### Initial Release
- Scaffolded HomeHub website with magazine-first homepage, 9 room categories, 14 products, shopping bag, wishlist, and guest checkout.
