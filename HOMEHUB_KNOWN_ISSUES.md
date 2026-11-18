# HomeHub — Known Issues & Resolution Log

This document tracks all discovered anomalies, blockers, edge cases, and their exact engineering resolutions.

---

## 1. Resolved Issues

### Issue #1: Image Upload Failure with `.jfif` Files & "Storage error: Failed to fetch"
- **Symptom:** Admin user receives `❌ Upload failed` and `Storage error: Failed to fetch` when uploading photography with `.jfif` or unusual image extensions.
- **Root Cause:**
  1. The HTML `<input type="file">` restricted allowed files to `accept="image/jpeg,image/png,image/webp,image/avif"`.
  2. The cloud Supabase project (`dlfkbpsfdhciwwjovyjr`) was paused due to inactivity, resulting in DNS lookup failure (`Failed to fetch`).
  3. Supabase bucket `product-images` had `allowed_mime_types` restricted to a strict 5-item list, rejecting `.jfif` (MIME `image/pjpeg` or empty).
- **Engineering Resolution:**
  - Expanded file input to `accept="image/*,.jfif,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.svg"`.
  - Added automatic MIME normalization in `js/services/supabaseClient.js`.
  - Added zero-dependency local upload endpoint `/api/upload` in `server.js` saving to `/assets/uploads/`.
  - Added graceful fallback cascade: Supabase Storage -> Local Server Storage -> High-Res Base64 Data URL.
  - Updated `HOMEHUB_DATABASE_SETUP.sql` setting `allowed_mime_types = NULL` in `storage.buckets`.

### Issue #2: Uneven Category Grid Columns Across Screen Breakpoints
- **Symptom:** Product rows on desktop had inconsistent numbers of cards (e.g. 3 in one row, 2 in another).
- **Root Cause:** Inconsistent CSS flexbox/grid layout overrides on category cards.
- **Engineering Resolution:**
  - Standardized on strict CSS Grid: `grid-template-columns: repeat(6, minmax(0, 1fr))` on desktop (>= 1200px).
  - Tablet breakpoint (768px-1199px): `grid-template-columns: repeat(3, minmax(0, 1fr))`.
  - Mobile breakpoint (< 768px): `grid-template-columns: repeat(2, minmax(0, 1fr))`.

### Issue #3: Stuttering & Jerking during 3D Page Turns in Flipbook
- **Symptom:** Flipbook animation stuttered visibly during manual and automated page flips.
- **Root Cause:** Concurrent forced synchronous layout calculations and conflicting CSS transition properties during drag.
- **Engineering Resolution:**
  - Transitioned page-flip engine to `requestAnimationFrame`.
  - Removed layout-thrashing property queries during page transitions.
  - Enabled GPU acceleration via `will-change: transform` and `transform: translate3d(0, 0, 0)`.

### Issue #4: Duplicate Images Across Digital Magazine Volumes
- **Symptom:** Several spreads across *The Living Edit* and *Small Spaces* shared duplicate stock photography.
- **Root Cause:** Repeated image asset IDs used as placeholders.
- **Engineering Resolution:**
  - Audited all 4 volumes (96 individual pages) in `js/data/magazines.js`.
  - Assigned distinct, authentic, theme-specific architectural photography to every single spread.

---

## 2. Active Considerations & External Blockers

### Cloud Supabase Free-Tier Pause Status
- **Status:** Documented / Handled by Fallback.
- **Detail:** Supabase automatically pauses free-tier projects after 7 days of inactivity. When paused, cloud requests return DNS resolution errors.
- **Mitigation:** The application implements **Local Atelier Persistence**: products, categories, cart, wishlist, orders, and image uploads function seamlessly locally using the built-in Node server and browser storage, and automatically sync to Supabase when active credentials are provided.
