# HomeHub — Production-Ready Web Application

> **SHOP • STYLE • SMART**  
> An independent home and lifestyle brand engineered with a **Magazine-First, Shopping-Second** digital experience.  
> **Visual Direction:** Soft Luxury Modern  
> **Created by:** Farhana Aamir • [farzunmir@gmail.com](mailto:farzunmir@gmail.com)

---

## 1. Quick Launch Instructions

This application is built with modern HTML5, CSS3, and ES6+ modules. It contains a zero-dependency high-performance server.

### Option A: Launch with Node.js (Recommended)
Open PowerShell or your command terminal in the project directory (`c:\Users\zuni\Desktop\webstore`) and execute:

```powershell
npm start
```
or:
```powershell
node server.js
```

Then navigate to: **`http://localhost:3000`** in your browser.

### Option B: Open Directly
Double-click `index.html` or open it with any modern desktop or Android browser (Chrome, Samsung Internet, Edge, Firefox, Safari).

---

## 2. Brand Identity & Visual Direction

- **Brand Name:** HomeHub
- **Tagline:** `SHOP • STYLE • SMART`
- **Product Categories:** Furniture, Home Décor, Lighting, Small Space Solutions, Interior Inspiration.
- **Originality Guarantee:** Complete original identity and bespoke catalog. Zero duplication of mass-retail or IKEA designs.
- **Color Palette:**
  - **Soft Ivory:** `#F8F5EF` (Primary background and canvas)
  - **Sage Mist:** `#DDE8DF` (Organic natural accents)
  - **Warm Beige:** `#EADCCB` (Grounded travertine and timber tones)
  - **Dusty Blush:** `#E9D8D0` (Tactile textile accents)
  - **Soft Champagne:** `#D6BC91` (Metallic hardware and illuminated highlights)
  - **Noir / Deep Espresso:** `#201D1A` & `#383431` (Typography & high-contrast elements)

---

## 3. Key Completed Architecture & Features

### 3.1 Magazine-First Digital Books
Four independent, fully formatted digital books:
1. **The Living Edit (Volume 01):** Sculptural curved seating, monolithic travertine tables, layered Italian bouclé.
2. **Objects of Home (Volume 02):** Wheel-thrown ceramics, bas-relief plaster compositions, Belgian linen textures.
3. **Light / Life (Volume 03):** Circadian 2700K illumination, hand-blown triplex glass orbs, cantilevered marble arch lamps.
4. **Small Spaces (Volume 04):** Urban space-saving engineering, nested console desks, wall-hung fluted credenzas.

Each book features its own dedicated cover, editorial essays, quotes, photography, pagination, and clickable product hotspots.

### 3.2 Realistic 3D Page Flip Engine
- **Desktop Two-Page Spread:** Side-by-side editorial pages with a natural central binding crease and paper spine shading.
- **CSS 3D Perspective:** Multi-axis page leaf turning with dynamic cast shadow gradients.
- **Zero Jumps or Stutter:** Smooth animation curve with no jarring bounce.
- **Interactive Controls:** Previous / Next buttons, direct page scrubber dots, and keyboard navigation (Arrow keys).
- **Procedural Paper Sound:** Built-in Web Audio API synthesis generating realistic paper friction and leaf flutter without external audio dependencies.
- **Sound On/Off Toggle:** Instant sound state control persisted in `localStorage`.
- **Android Mobile Touch Swipe:** Full gesture recognition for left/right finger swipes.

### 3.3 Original Concept Product Catalogue
All initial concept pieces across Furniture, Décor, Lighting, and Small Space Solutions:
- `HH-FUR-001` CloudCurve Sofa (PKR 345,000)
- `HH-FUR-002` Noma Coffee Table (PKR 125,000)
- `HH-FUR-003` Aura Lounge Chair (PKR 165,000)
- `HH-FUR-004` Haven Bed (PKR 285,000)
- `HH-DEC-001` Solis Ceramic Vase (PKR 28,500)
- `HH-DEC-002` Forma Wall Art (PKR 45,000)
- `HH-DEC-003` CloudSoft Cushions (PKR 14,500)
- `HH-DEC-004` Halo Mirror (PKR 58,000)
- `HH-LGT-001` Luna Pendant (PKR 62,000)
- `HH-LGT-002` Arc Floor Lamp (PKR 78,500)
- `HH-LGT-003` Glow Table Lamp (PKR 36,000)
- `HH-LGT-004` Aura Wall Light (PKR 32,500)
- `HH-SSS-001` Modula Nested Desk (PKR 89,000)
- `HH-SSS-002` Flute Floating Console (PKR 74,000)

Each piece features:
- **4 Distinct High-Resolution Photographs:** Main product view, Alternate angle, Material/tactile detail, and Lifestyle interior setting.
- Accurate dimensions, materials, weights, variants, and stock counts.
- Clear concept disclaimer notice.

### 3.4 Luxury Product Detail Page (PDP)
- Gallery with 4+ clickable thumbnails and zoom preview.
- Variant swatches with active selection.
- Stepper quantity selector (+ / -).
- Immediate Add to Bag and Wishlist toggling.
- Full specifications and White-Glove delivery guarantee accordion.
- Curated related complementary pieces.

### 3.5 Shopping Bag & Wishlist
- **Persistent LocalStorage:** Cart items and Wishlists survive browser reloads.
- **Slide-Over Drawers:** Accessible from the top header on both desktop and mobile.
- **Real-Time Subtotal:** Dynamic PKR currency calculation (`formatPKR`).
- **Honest Checkout Integration Notice:** In accordance with production integrity, no fake successful payments or simulated orders are presented. A transparent modal outlines payment gateway integration readiness (Stripe, PayFast, Easypaisa) and offers direct email order quotation to Farhana Aamir.

### 3.6 Video Masterclasses
- Curated interior inspiration videos for: Living room styling, Small bedroom ideas, Lighting inspiration, Home decoration, and Space-saving furniture.
- Real HTML5 responsive video player with playable streams and key architectural takeaways.
- "Featured in this video" clickable product chips.

### 3.7 Admin Management Console
- Protected interface simulator accessible via header and footer.
- **Product CRUD:** Create, Read, Update price/stock/details, and Delete pieces.
- **Inventory Monitoring:** Real-time stock alerts and total asset evaluation.
- **Order Inquiries Table:** Review staged proforma client inquiries.
- **Banners Management:** Update homepage marquee and editorial callouts.
- **Production API & DB Specifications:** Interactive schema documentation viewer.

---

## 4. Production Database & Backend Readiness

HomeHub is architected for clean separation between presentation and backend data layers:

- `docs/API_SPECIFICATION.md`: RESTful JSON API v1 specification with authentication, pagination, search, and checkout webhooks.
- `docs/DATABASE_SCHEMA.sql`: PostgreSQL 14+ relational database schema including tables for `products`, `product_variants`, `product_images`, `magazine_books`, `magazine_pages`, `magazine_product_hotspots`, `users`, `orders`, and `order_items`.

---

## 5. Mobile-First & Android Browser Compatibility

- Built with mobile touch targets exceeding the standard 44×44px / 48×48px.
- Tested and formatted for Android Chrome and mobile viewports (360px, 390px, 412px, 768px, 1024px+).
- Touch swipe gestures for page turns.
- Zero horizontal overflow.

---

## 6. Footer & Creator Attribution

- **Created by:** Farhana Aamir
- **Email:** [farzunmir@gmail.com](mailto:farzunmir@gmail.com) (Clickable `mailto:` link)
