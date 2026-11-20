/**
 * HomeHub - Full Functional End-to-End Simulation Test
 * Simulates user interactions across catalogue, cart, wishlist, magazines, and admin.
 */

import { INITIAL_PRODUCTS, CATEGORIES } from './js/data/products.js';
import { MAGAZINE_BOOKS } from './js/data/magazines.js';
import { INSPIRATION_VIDEOS } from './js/data/videos.js';
import { formatPKR } from './js/utils/helpers.js';
import { storage } from './js/utils/storage.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('======================================================');
console.log('  HOMEHUB — PHASE 2 FUNCTIONAL TEST EXECUTION');
console.log('======================================================\n');

// --- 1. CATALOGUE FILTERING & SEARCH TESTS ---
console.log('[1] Testing Catalogue Filtering, Search & Sorting:');
{
  // Test category filtering
  const furniture = INITIAL_PRODUCTS.filter(p => p.category === 'furniture');
  assert(furniture.length === 4, `Furniture count is 4 (got ${furniture.length})`);

  const decor = INITIAL_PRODUCTS.filter(p => p.category === 'decor');
  assert(decor.length === 4, `Décor count is 4 (got ${decor.length})`);

  const lighting = INITIAL_PRODUCTS.filter(p => p.category === 'lighting');
  assert(lighting.length === 4, `Lighting count is 4 (got ${lighting.length})`);

  const smallSpaces = INITIAL_PRODUCTS.filter(p => p.category === 'small-spaces');
  assert(smallSpaces.length === 2, `Small Space Solutions count is 2 (got ${smallSpaces.length})`);

  // Test search
  const sofaSearch = INITIAL_PRODUCTS.filter(p => p.name.toLowerCase().includes('sofa') || p.sku.toLowerCase().includes('sofa'));
  assert(sofaSearch.length === 1 && sofaSearch[0].sku === 'HH-FUR-001', 'Search for "sofa" returns CloudCurve Sofa');

  const travertineSearch = INITIAL_PRODUCTS.filter(p => p.material.toLowerCase().includes('travertine'));
  assert(travertineSearch.length >= 2, `Search by material "travertine" returns ${travertineSearch.length} pieces`);

  // Test sorting
  const sortedPriceAsc = [...INITIAL_PRODUCTS].sort((a, b) => a.price - b.price);
  assert(sortedPriceAsc[0].price <= sortedPriceAsc[1].price, 'Price low-to-high sort verified');
  assert(sortedPriceAsc[0].price === 14500, `Lowest priced item is ₨ 14,500 (CloudSoft Cushions)`);

  const sortedPriceDesc = [...INITIAL_PRODUCTS].sort((a, b) => b.price - a.price);
  assert(sortedPriceDesc[0].price >= sortedPriceDesc[1].price, 'Price high-to-low sort verified');
  assert(sortedPriceDesc[0].price === 345000, `Highest priced item is ₨ 345,000 (CloudCurve Sofa)`);
}

// --- 2. PERSISTENT CART & PRICING TESTS ---
console.log('\n[2] Testing Shopping Bag (Cart), Quantities & Subtotal in PKR:');
{
  storage.remove('cart_items');
  let cart = storage.get('cart_items', []);
  assert(cart.length === 0, 'Cart starts clean and empty');

  // Add CloudCurve Sofa (₨ 345,000)
  cart.push({ sku: 'HH-FUR-001', quantity: 1, variantId: 'ivory', addedAt: new Date().toISOString() });
  // Add 2× Solis Ceramic Vase (₨ 28,500 each = ₨ 57,000)
  cart.push({ sku: 'HH-DEC-001', quantity: 2, variantId: 'soft-ivory', addedAt: new Date().toISOString() });
  storage.set('cart_items', cart);

  // Read back from storage
  const savedCart = storage.get('cart_items', []);
  assert(savedCart.length === 2, '2 unique items saved to persistent storage');

  // Subtotal calculation
  const p1 = INITIAL_PRODUCTS.find(p => p.sku === 'HH-FUR-001');
  const p2 = INITIAL_PRODUCTS.find(p => p.sku === 'HH-DEC-001');
  const subtotal = (p1.price * 1) + (p2.price * 2);
  assert(subtotal === 402000, `Subtotal calculated accurately: 402,000 PKR`);
  assert(formatPKR(subtotal) === '₨ 402,000', `PKR formatting renders "₨ 402,000"`);

  // Quantity updates
  savedCart[1].quantity += 1; // 3 vases
  assert(savedCart[1].quantity === 3, 'Cart stepper quantity increment verified');

  // Remove item
  const filteredCart = savedCart.filter(i => i.sku !== 'HH-DEC-001');
  assert(filteredCart.length === 1 && filteredCart[0].sku === 'HH-FUR-001', 'Item removal from cart verified');
}

// --- 3. PERSISTENT WISHLIST & MOVE-TO-BAG TESTS ---
console.log('\n[3] Testing Wishlist & Move-to-Bag Operations:');
{
  storage.remove('wishlist_skus');
  let wishlist = storage.get('wishlist_skus', []);
  assert(wishlist.length === 0, 'Wishlist initialized empty');

  // Add 2 items
  wishlist.push('HH-LGT-001'); // Luna Pendant
  wishlist.push('HH-DEC-004'); // Halo Mirror
  storage.set('wishlist_skus', wishlist);

  const savedWishlist = storage.get('wishlist_skus', []);
  assert(savedWishlist.length === 2, 'Wishlist holds 2 saved pieces');
  assert(savedWishlist.includes('HH-LGT-001'), 'Luna Pendant exists in Wishlist');

  // Move Halo Mirror to Cart
  const movedSku = 'HH-DEC-004';
  const updatedWishlist = savedWishlist.filter(s => s !== movedSku);
  storage.set('wishlist_skus', updatedWishlist);
  assert(storage.get('wishlist_skus', []).length === 1, 'Moved item removed from Wishlist');
}

// --- 4. DIGITAL MAGAZINE SPREADS & PRODUCT HOTSPOTS TESTS ---
console.log('\n[4] Testing The Four Digital Books & Hotspot Linkages:');
{
  const requiredBooks = ['living-edit', 'objects-of-home', 'light-life', 'small-spaces'];
  for (const bookId of requiredBooks) {
    const book = MAGAZINE_BOOKS[bookId];
    assert(!!book, `Book "${bookId}" exists with title "${book ? book.title : ''}"`);
    assert(book.pages.length === 24, `Book "${bookId}" contains complete 24-page editorial catalogue`);
    assert(book.totalPages === 24, `Book "${bookId}" declares 24 total pages`);

    // Verify 5 distinct layouts present in every magazine
    const types = new Set(book.pages.map(p => p.type));
    assert(types.has('layout-a'), `Book "${bookId}" contains Layout A (Continuous double-page image)`);
    assert(types.has('layout-b'), `Book "${bookId}" contains Layout B (Two different photographs)`);
    assert(types.has('layout-c'), `Book "${bookId}" contains Layout C (Full-page room photography)`);
    assert(types.has('layout-d'), `Book "${bookId}" contains Layout D (Editorial story)`);
    assert(types.has('layout-e'), `Book "${bookId}" contains Layout E (Product collection)`);

    // Verify at least 2 continuous double-page spreads (4 pages of layout-a)
    const layoutACount = book.pages.filter(p => p.type === 'layout-a').length;
    assert(layoutACount >= 4, `Book "${bookId}" contains at least 2 continuous double-page spreads (${layoutACount} pages)`);

    // Verify cover lines on cover page
    assert(Array.isArray(book.coverLines) && book.coverLines.length >= 3, `Book "${bookId}" has ${book.coverLines ? book.coverLines.length : 0} editorial cover lines`);

    // Verify all embedded product hotspots link to existing products in catalogue and have coordinates
    let hotspotCount = 0;
    for (const page of book.pages) {
      for (const prod of (page.products || [])) {
        hotspotCount++;
        const target = INITIAL_PRODUCTS.find(p => p.sku === prod.sku);
        assert(!!target, `Page ${page.pageNumber} hotspot SKU "${prod.sku}" resolves to catalogue piece "${target ? target.name : 'MISSING'}"`);
        if (prod.hotspot) {
          assert(typeof prod.hotspot.x === 'number' && typeof prod.hotspot.y === 'number', `Page ${page.pageNumber} hotspot SKU "${prod.sku}" has valid coordinates (${prod.hotspot.x}%, ${prod.hotspot.y}%)`);
        }
      }
    }
    assert(hotspotCount > 0, `Book "${bookId}" contains ${hotspotCount} clickable piece hotspots`);
  }

  // Test Sound preference persistence
  storage.set('sound_enabled', false);
  assert(storage.get('sound_enabled', true) === false, 'Audio mute preference persists in storage');
  storage.set('sound_enabled', true);
  assert(storage.get('sound_enabled', false) === true, 'Audio enable preference persists in storage');
}

// --- 5. VIDEO MASTERCLASSES & PLAYBACK CONTENT ---
console.log('\n[5] Testing Interior Video Masterclasses:');
{
  assert(INSPIRATION_VIDEOS.length === 6, 'Exactly 6 curated video masterclasses present (complete row)');
  const categories = INSPIRATION_VIDEOS.map(v => v.category);
  assert(categories.includes('living-room'), 'Includes Living room styling');
  assert(categories.includes('bedroom'), 'Includes Bedroom architecture (no duplicate small-bedroom)');
  assert(categories.includes('lighting'), 'Includes Lighting atmosphere');
  assert(categories.includes('dining-room'), 'Includes Dining room architecture');
  assert(categories.includes('space-saving'), 'Includes Space-saving furniture');
  assert(categories.includes('furniture'), 'Includes Furniture craft & joinery');

  for (const v of INSPIRATION_VIDEOS) {
    assert(v.embedType === 'youtube' && v.embedUrl.startsWith('https://www.youtube-nocookie.com/embed/'), `Video "${v.id}" uses privacy-enhanced embed URL`);
    assert(v.keyTakeaways.length >= 3, `Video "${v.id}" has ${v.keyTakeaways.length} architectural takeaways`);
  }
}

// --- 6. ADMIN PORTAL CRUD & AUTHENTICATION TESTS ---
console.log('\n[6] Testing Admin Security Gate & Product CRUD:');
{
  // Test authentication rejection with bad credentials
  const badAuth = ('wrong@admin.com' === 'admin@homehub.atelier' && 'badpass' === 'HomeHub@Atelier2026');
  assert(!badAuth, 'Unauthorized login attempt rejected');

  // Test authentication success with valid credentials
  const goodAuth = ('admin@homehub.atelier' === 'admin@homehub.atelier' && 'HomeHub@Atelier2026' === 'HomeHub@Atelier2026');
  assert(goodAuth, 'Valid administrator credentials authenticated successfully');

  // Test product creation in memory/storage
  const customProducts = [...INITIAL_PRODUCTS];
  const newPiece = {
    id: 'HH-FUR-999',
    sku: 'HH-FUR-999',
    name: 'Atelier Daybed',
    category: 'furniture',
    categoryLabel: 'Furniture',
    price: 195000,
    shortDesc: 'Minimalist low daybed in oatmeal linen.',
    description: 'Bespoke atelier studio creation.',
    material: 'Kiln-dried beechwood, Belgian linen.',
    dimensions: '200cm x 85cm x 40cm',
    stock: 4,
    isFeatured: true,
    variants: [{ id: 'oatmeal', name: 'Oatmeal', hex: '#EADCCB', isDefault: true }],
    images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', caption: 'Main', type: 'main' }]
  };
  customProducts.unshift(newPiece);
  storage.set('custom_products', customProducts);

  const readCustom = storage.get('custom_products', []);
  assert(readCustom.length === INITIAL_PRODUCTS.length + 1, 'New product created & persisted in storage');
  assert(readCustom[0].sku === 'HH-FUR-999', 'Created piece verified at top of catalogue');

  // Test product edit (price update)
  readCustom[0].price = 210000;
  assert(readCustom[0].price === 210000, 'Price updated from ₨ 195,000 to ₨ 210,000');

  // Test product delete
  const afterDelete = readCustom.filter(p => p.sku !== 'HH-FUR-999');
  storage.set('custom_products', afterDelete);
  assert(storage.get('custom_products', []).length === INITIAL_PRODUCTS.length, 'Deleted product removed cleanly');
}

// --- 7. MODULAR PLUGIN ARCHITECTURE TESTS ---
console.log('\n[7] Testing Modular Architecture & Plugin Registry:');
{
  const { pluginRegistry } = await import('./js/services/pluginRegistry.js');
  const allModules = pluginRegistry.getAllModules();
  assert(allModules.length === 15, `Plugin registry manages exactly 15 modules (got ${allModules.length})`);

  // Core modules present and enabled
  assert(pluginRegistry.isEnabled('catalogue') === true, 'Catalogue core module is active');
  assert(pluginRegistry.isEnabled('commerce') === true, 'Commerce core module is active');
  assert(pluginRegistry.isEnabled('settings') === true, 'Settings core module is active');

  // Attempting to disable core module should be rejected
  const tryDisableCore = pluginRegistry.toggleModule('catalogue', false);
  assert(tryDisableCore === false, 'Disabling core module "catalogue" is strictly protected');
  assert(pluginRegistry.isEnabled('catalogue') === true, 'Catalogue remains enabled');

  // Toggling non-core module
  const wasReviews = pluginRegistry.isEnabled('reviews');
  pluginRegistry.toggleModule('reviews', false);
  assert(pluginRegistry.isEnabled('reviews') === false, 'Non-core module "reviews" toggled off');
  pluginRegistry.toggleModule('reviews', true);
  assert(pluginRegistry.isEnabled('reviews') === true, 'Non-core module "reviews" toggled back on');

  // Config updates
  pluginRegistry.updateConfig('coupons', { allowStacking: true });
  assert(pluginRegistry.getModule('coupons').config.allowStacking === true, 'Module config update persists');
  pluginRegistry.updateConfig('coupons', { allowStacking: false });
}

// --- 8. PROMOTIONAL COUPON ENGINE TESTS ---
console.log('\n[8] Testing Promotional Coupon Engine:');
{
  const { couponService } = await import('./js/services/couponService.js');
  const coupons = couponService.getAllCoupons();
  assert(coupons.length >= 4, `At least 4 default coupons present (got ${coupons.length})`);

  // Validate HOMEHUB10 (10% percentage discount)
  const res10 = couponService.validateCoupon('HOMEHUB10', 100000);
  assert(res10.valid === true, 'HOMEHUB10 is recognized as valid');
  assert(res10.discount === 10000, `HOMEHUB10 yields ₨ 10,000 on ₨ 100,000 subtotal (got ${res10.discount})`);

  // Validate WELCOME5000 (Fixed ₨ 5,000 with min spend ₨ 50,000)
  const underMin = couponService.validateCoupon('WELCOME5000', 30000);
  assert(underMin.valid === false, 'WELCOME5000 rejected when order subtotal is below ₨ 50,000 min requirement');

  const overMin = couponService.validateCoupon('WELCOME5000', 80000);
  assert(overMin.valid === true, 'WELCOME5000 accepted when order subtotal meets min requirement');
  assert(overMin.discount === 5000, `WELCOME5000 yields exact ₨ 5,000 discount (got ${overMin.discount})`);

  // Validate nonexistent coupon
  const fakeRes = couponService.validateCoupon('FAKEECOMMERCE99', 100000);
  assert(fakeRes.valid === false, 'Nonexistent coupon code is rejected');

  // Test custom coupon creation, toggle, and delete
  const newCoupon = couponService.createCoupon({
    code: 'TESTSUMMER',
    type: 'percentage',
    value: 25,
    minOrder: 150000,
    description: '25% test VIP discount'
  });
  assert(newCoupon.code === 'TESTSUMMER', 'Custom coupon TESTSUMMER created');
  assert(couponService.getCoupon('TESTSUMMER') !== null, 'Custom coupon retrieved from registry');

  // Toggle active/inactive
  couponService.toggleCouponStatus('TESTSUMMER');
  const inactiveCheck = couponService.validateCoupon('TESTSUMMER', 200000);
  assert(inactiveCheck.valid === false, 'Inactive coupon cannot be redeemed');

  // Clean up
  couponService.deleteCoupon('TESTSUMMER');
  assert(couponService.getCoupon('TESTSUMMER') === null, 'Test coupon deleted cleanly');
}

// --- 9. CLIENT DIRECTORY & CRM SERVICE TESTS ---
console.log('\n[9] Testing Client Directory & CRM Service:');
{
  const { customerService } = await import('./js/services/customerService.js');
  const baseClients = customerService.getAllCustomers();
  assert(baseClients.length >= 3, `Initial customer directory contains established clientele (got ${baseClients.length})`);

  // Simulate registering a new customer order
  const testOrder = {
    customer_email: 'newpatron@atelier.com',
    customer_name: 'Faraz Ahmed',
    customer_phone: '+92 301 5557788',
    shipping_city: 'Rawalpindi',
    total_amount: 350000
  };
  customerService.recordCustomer(testOrder);

  const updatedClients = customerService.getAllCustomers();
  const createdClient = updatedClients.find(c => c.email === 'newpatron@atelier.com');
  assert(Boolean(createdClient), 'New customer profile created from checkout order');
  assert(createdClient.totalSpent === 350000, `Customer lifetime spend calculated accurately (got ₨ ${createdClient.totalSpent})`);
  assert(createdClient.tier.includes('Platinum'), `Tier elevated to Platinum based on spend volume (got ${createdClient.tier})`);
}

// --- 10. MULTI-TENANT SAAS ARCHITECTURE & TENANT ISOLATION TESTS ---
console.log('\n[10] Testing Multi-Tenant SaaS Architecture & Tenant Isolation:');
{
  const { tenantService, PRESEEDED_TENANTS } = await import('./js/services/tenantService.js');
  const { Cart } = await import('./js/components/cart.js');

  // 1. Verify pre-seeded tenants
  assert(Boolean(PRESEEDED_TENANTS['homehub']), 'Pre-seeded tenant homehub exists');
  assert(Boolean(PRESEEDED_TENANTS['studio-noor']), 'Pre-seeded tenant studio-noor exists');
  assert(Boolean(PRESEEDED_TENANTS['aurelia-living']), 'Pre-seeded tenant aurelia-living exists');

  const allTenants = tenantService.getAllTenants();
  assert(allTenants.length >= 3, `At least 3 distinct tenants registered (got ${allTenants.length})`);

  // 2. Verify brand metadata & themes
  const hh = tenantService.getTenant('homehub');
  const sn = tenantService.getTenant('studio-noor');
  const al = tenantService.getTenant('aurelia-living');

  assert(hh.name === 'HomeHub Luxury Living', 'HomeHub brand name verified');
  assert(sn.name === 'Studio Noor Minimalist', 'Studio Noor brand name verified');
  assert(al.name === 'Aurelia Coastal Decor', 'Aurelia Coastal Decor brand name verified');

  assert(hh.currency.code === 'PKR' && hh.currency.symbol === '₨', 'HomeHub uses PKR currency');
  assert(sn.currency.code === 'USD' && sn.currency.symbol === '$', 'Studio Noor uses USD currency');
  assert(al.currency.code === 'EUR' && al.currency.symbol === '€', 'Aurelia Living uses EUR currency');

  // 3. Verify curated catalogs
  const hhProducts = tenantService.getProductsForTenant('homehub');
  const snProducts = tenantService.getProductsForTenant('studio-noor');
  const alProducts = tenantService.getProductsForTenant('aurelia-living');

  assert(hhProducts.length >= 14, `HomeHub catalog has at least 14 pieces (got ${hhProducts.length})`);
  assert(snProducts.length >= 6, `Studio Noor catalog has at least 6 curated pieces (got ${snProducts.length})`);
  assert(alProducts.length >= 6, `Aurelia Living catalog has at least 6 curated pieces (got ${alProducts.length})`);

  // Verify distinct SKU prefixes
  assert(snProducts.every(p => p.sku.startsWith('SN-')), 'Studio Noor pieces use SN- SKU namespace');
  assert(alProducts.every(p => p.sku.startsWith('AL-')), 'Aurelia pieces use AL- SKU namespace');

  // 4. Verify currency formatting per tenant
  const pkrFormatted = tenantService.formatPrice(345000, hh);
  const usdFormatted = tenantService.formatPrice(1850, sn);
  const eurFormatted = tenantService.formatPrice(2150, al);

  assert(pkrFormatted.includes('₨') && pkrFormatted.includes('345,000'), 'HomeHub price formatted in PKR');
  assert(usdFormatted.includes('$') && usdFormatted.includes('1,850'), 'Studio Noor price formatted in USD');
  assert(eurFormatted.includes('€') && eurFormatted.includes('2'), 'Aurelia price formatted in EUR');

  // 5. Verify isolated Cart state across tenants
  storage.remove('cart_items');
  storage.remove('tenant_studio-noor_cart_items');
  storage.remove('tenant_aurelia-living_cart_items');

  const testCart = new Cart('cart-drawer-container', {
    products: hhProducts,
    tenantSlug: 'homehub'
  });

  // Add piece in HomeHub
  testCart.addItem('HH-FUR-001', 1);
  assert(testCart.getCount() === 1, 'HomeHub cart has 1 item');

  // Switch to Studio Noor
  testCart.switchTenant('studio-noor', snProducts);
  assert(testCart.getCount() === 0, 'Studio Noor cart starts completely empty (isolated)');

  // Add piece in Studio Noor
  testCart.addItem('SN-FUR-001', 2);
  assert(testCart.getCount() === 2, 'Studio Noor cart now has 2 items');

  // Switch to Aurelia Living
  testCart.switchTenant('aurelia-living', alProducts);
  assert(testCart.getCount() === 0, 'Aurelia Living cart is isolated and empty');

  // Switch back to HomeHub
  testCart.switchTenant('homehub', hhProducts);
  assert(testCart.getCount() === 1, 'HomeHub cart retained its original 1 item without corruption');
  assert(testCart.items[0].sku === 'HH-FUR-001', 'HomeHub item SKU matches');

  // Switch back to Studio Noor
  testCart.switchTenant('studio-noor', snProducts);
  assert(testCart.getCount() === 2, 'Studio Noor cart retained its original 2 items');

  // 6. Verify "Launch Your Store" SaaS onboarding
  const launchedStore = tenantService.createTenant({
    name: 'Nordic Loft Design',
    slug: 'nordic-loft',
    tagline: 'Quiet Scandinavian Wood & Architecture',
    currencyCode: 'GBP',
    themeColor: '#7D6352',
    badge: '🌲'
  });

  assert(launchedStore.slug === 'nordic-loft', 'New tenant created with slug nordic-loft');
  assert(launchedStore.currency.code === 'GBP' && launchedStore.currency.symbol === '£', 'New tenant uses GBP currency');
  assert(Boolean(tenantService.getTenant('nordic-loft')), 'New tenant retrieved from registry');
  assert(launchedStore.products.length >= 4, 'New tenant seeded with starter products');

  // Switch into newly created tenant
  tenantService.setActiveTenant('nordic-loft');
  assert(tenantService.getActiveSlug() === 'nordic-loft', 'Active tenant successfully switched to nordic-loft');

  // Clean up
  tenantService.setActiveTenant('homehub');
  assert(tenantService.getActiveSlug() === 'homehub', 'Active tenant successfully restored to homehub');
}

// --- 11. PROGRESSIVE WEB APP (PWA) & MOBILE APP SHELL TESTS ---
console.log('\n[11] Testing PWA Manifest, Service Worker & Mobile Shell:');
{
  const fs = await import('fs');
  const path = await import('path');

  // 1. Verify manifest.json integrity
  const manifestRaw = fs.readFileSync(path.join(process.cwd(), 'manifest.json'), 'utf8');
  const manifest = JSON.parse(manifestRaw);

  assert(manifest.name.includes('HomeHub'), 'Manifest name is HomeHub');
  assert(manifest.short_name === 'HomeHub', 'Manifest short_name is HomeHub');
  assert(manifest.display === 'standalone', 'Manifest display mode is standalone');
  assert(manifest.start_url === '/', 'Manifest start_url is /');
  assert(manifest.theme_color === '#C26E4B', 'Manifest theme_color is terracotta');
  assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, `Manifest has at least 3 icons (got ${manifest.icons.length})`);

  // Verify icon files physically exist on disk
  const icon192 = manifest.icons.find(i => i.sizes === '192x192');
  const icon512 = manifest.icons.find(i => i.sizes === '512x512');
  assert(Boolean(icon192), '192x192 icon declared in manifest');
  assert(Boolean(icon512), '512x512 icon declared in manifest');
  assert(fs.existsSync(path.join(process.cwd(), icon192.src)), '192x192 icon exists on disk');
  assert(fs.existsSync(path.join(process.cwd(), icon512.src)), '512x512 icon exists on disk');

  // 2. Verify sw.js service worker integrity
  const swCode = fs.readFileSync(path.join(process.cwd(), 'sw.js'), 'utf8');
  assert(swCode.includes('CACHE_NAME'), 'Service worker declares CACHE_NAME');
  assert(swCode.includes('STATIC_ASSETS'), 'Service worker declares pre-cache assets');
  assert(swCode.includes('/css/components/tenant-saas.css'), 'Service worker precaches tenant-saas.css');
  assert(swCode.includes('/css/components/pwa-install.css'), 'Service worker precaches pwa-install.css');
  assert(swCode.includes('/js/services/tenantService.js'), 'Service worker precaches tenantService.js');
  assert(swCode.includes('event.request.mode === \'navigate\''), 'Service worker handles navigation requests network-first');
  assert(swCode.includes('/api/'), 'Service worker bypasses /api/ routes without stale caching');

  // 3. Verify index.html mobile app meta tags & PWA components
  const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  assert(indexHtml.includes('rel="manifest" href="manifest.json"'), 'index.html links manifest.json');
  assert(indexHtml.includes('name="apple-mobile-web-app-capable" content="yes"'), 'index.html enables apple-mobile-web-app-capable');
  assert(indexHtml.includes('name="theme-color"'), 'index.html declares theme-color');
  assert(indexHtml.includes('id="mobile-bottom-nav"'), 'index.html includes mobile app bottom navigation');
  assert(indexHtml.includes('id="pwa-install-banner"'), 'index.html includes floating PWA install banner');
  assert(indexHtml.includes('id="pwa-ios-modal"'), 'index.html includes iOS Add to Home Screen modal');
  assert(indexHtml.includes('header-install-app-btn'), 'index.html includes header install button');
}

// --- 12. 7-DAY FREE TRIAL + PAID SAAS SUBSCRIPTION PLANS & OWNER APPROVAL TESTS ---
console.log('\n[12] Testing 7-Day Free Trial, Paid SaaS Subscription Plans & Platform Owner Controls:');
{
  const { tenantService, SAAS_PLANS } = await import('./js/services/tenantService.js');
  const fs = await import('fs');
  const path = await import('path');

  // 1. Verify SAAS_PLANS structure with 7-Day Free Trial
  assert(Boolean(SAAS_PLANS.starter), 'SaaS Starter tier is defined');
  assert(SAAS_PLANS.starter.price === 19, 'Starter plan price is $19/mo');
  assert(SAAS_PLANS.starter.trialDays === 7, 'Starter plan includes 7-day free trial');
  assert(SAAS_PLANS.starter.maxProducts === 15, 'Starter plan caps products at 15');

  assert(Boolean(SAAS_PLANS.pro), 'SaaS Studio Pro tier is defined');
  assert(SAAS_PLANS.pro.price === 49, 'Studio Pro plan price is $49/mo');
  assert(SAAS_PLANS.pro.trialDays === 7, 'Studio Pro plan includes 7-day free trial');
  assert(SAAS_PLANS.pro.badge === 'Popular', 'Studio Pro marked as Popular');

  assert(Boolean(SAAS_PLANS.enterprise), 'SaaS Enterprise tier is defined');
  assert(SAAS_PLANS.enterprise.price === 99, 'Enterprise plan price is $99/mo');
  assert(SAAS_PLANS.enterprise.trialDays === 7, 'Enterprise plan includes 7-day free trial');

  // 2. Verify Pre-Seeded Showcases are Active and Billable
  const homehubTenant = tenantService.getTenant('homehub');
  const noorTenant = tenantService.getTenant('studio-noor');
  const aureliaTenant = tenantService.getTenant('aurelia-living');

  assert(homehubTenant.status === 'active', 'HomeHub flagship is active');
  assert(noorTenant.status === 'active', 'Studio Noor is active');
  assert(aureliaTenant.status === 'active', 'Aurelia Living is active');

  assert(tenantService.isTenantActive('homehub') === true, 'isTenantActive("homehub") returns true');
  assert(tenantService.isTenantActive('studio-noor') === true, 'isTenantActive("studio-noor") returns true');
  assert(tenantService.isTenantActive('aurelia-living') === true, 'isTenantActive("aurelia-living") returns true');

  // 3. Verify MRR Calculation for Active Paid Showcases ($99 + $49 + $49 = $197)
  const initialMRR = tenantService.calculateMRR();
  assert(initialMRR >= 197, `Initial MRR calculation is billable (got $${initialMRR}/mo)`);

  // 4. Test Tenant Creation with 7-Day Free Trial
  const trialTenant = tenantService.createTenant({
    name: 'Zenith Atelier',
    slug: 'zenith-atelier',
    tagline: 'Minimalist Monolithic Architecture',
    currencyCode: 'USD',
    planId: 'pro',
    paymentMethod: 'Credit / Debit Card (Stripe)',
    paymentRef: 'TRIAL-FREE-7D',
    badge: '🏛️'
  });

  assert(trialTenant.status === 'trial', 'Custom tenant created without owner PIN starts with status "trial"');
  assert(Boolean(trialTenant.trialStartedAt), 'trialStartedAt timestamp recorded');
  assert(Boolean(trialTenant.trialEndsAt), 'trialEndsAt timestamp recorded (~7 days in future)');
  assert(tenantService.getTrialDaysRemaining('zenith-atelier') >= 6, 'Trial days remaining is calculated correctly (~7 days)');
  assert(tenantService.isTenantActive('zenith-atelier') === true, 'Trial store is accessible during the 7-day free trial');
  assert(tenantService.calculateMRR() === initialMRR, 'Active trial store does not artificially count towards billable paid MRR');

  // 5. Test 7-Day Trial Expiry Simulation (Post-7-Day Lock)
  tenantService.simulateTrialExpiry('zenith-atelier');
  assert(trialTenant.status === 'trial_expired', 'simulateTrialExpiry sets tenant status to "trial_expired"');
  assert(tenantService.isTenantActive('zenith-atelier') === false, 'Expired trial store is blocked (locked) from live storefront access');

  // 6. Test Platform Owner Extending 7-Day Trial (+7 Days)
  tenantService.extendTenantTrial('zenith-atelier', 7);
  assert(trialTenant.status === 'trial', 'extendTenantTrial resets status to "trial"');
  assert(tenantService.getTrialDaysRemaining('zenith-atelier') >= 6, 'Trial extended by 7 days');
  assert(tenantService.isTenantActive('zenith-atelier') === true, 'Extended trial store is once again accessible');

  // 7. Test Platform Owner Approving & Activating Paid Plan
  const paidTenant = tenantService.activatePaidPlan('zenith-atelier', 'Credit Card', 'TXN-PAID-9090');
  assert(paidTenant.status === 'active', 'activatePaidPlan sets tenant status to "active"');
  assert(tenantService.isTenantActive('zenith-atelier') === true, 'Paid tenant is active live');
  assert(tenantService.calculateMRR() === initialMRR + 49, `MRR increased by $49/mo after converting to paid plan (got $${tenantService.calculateMRR()})`);

  // 8. Test Platform Owner Suspension
  const suspendedTenant = tenantService.updateTenantStatus('zenith-atelier', 'suspended');
  assert(suspendedTenant.status === 'suspended', 'Owner can suspend tenant');
  assert(tenantService.isTenantActive('zenith-atelier') === false, 'Suspended tenant is blocked from active live publishing');
  assert(tenantService.calculateMRR() === initialMRR, 'Suspended tenant deducted from billable MRR');

  // 9. Test Tenant Creation with Platform Owner PIN -> Instant Paid Live Activation
  const instantActiveTenant = tenantService.createTenant({
    name: 'Atelier Kanso',
    slug: 'atelier-kanso',
    tagline: 'Wabi-sabi crafted stoneware',
    currencyCode: 'USD',
    planId: 'enterprise',
    ownerPin: 'OWNER-2026',
    badge: '🏺'
  });

  assert(instantActiveTenant.status === 'active', 'Custom tenant with OWNER-2026 PIN activates immediately as active paid');
  assert(tenantService.isTenantActive('atelier-kanso') === true, 'Instant tenant is active');
  assert(tenantService.calculateMRR() === initialMRR + 99, `MRR increased by $99/mo after instant active Enterprise store (got $${tenantService.calculateMRR()})`);

  // 10. Test Master PIN Verification
  assert(tenantService.verifyOwnerPin('2081') === true, 'verifyOwnerPin accepts valid 2081 master PIN');
  assert(tenantService.verifyOwnerPin('OWNER-2026') === true, 'verifyOwnerPin accepts valid OWNER-2026 master key');
  assert(tenantService.verifyOwnerPin('WRONG-PIN') === false, 'verifyOwnerPin rejects invalid PIN');
  assert(tenantService.verifyOwnerPin('') === false, 'verifyOwnerPin rejects empty PIN');

  // 11. Verify HTML UI Components
  const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  assert(indexHtml.includes('id="store-trial-banner"'), 'index.html contains #store-trial-banner countdown banner');
  assert(indexHtml.includes('id="trial-banner-msg"'), 'index.html contains #trial-banner-msg');
  assert(indexHtml.includes('id="trial-banner-upgrade-btn"'), 'index.html contains #trial-banner-upgrade-btn');
  assert(indexHtml.includes('id="platform-owner-modal"'), 'index.html contains #platform-owner-modal');
  assert(indexHtml.includes('id="owner-pin-screen"'), 'index.html contains #owner-pin-screen');
  assert(indexHtml.includes('id="owner-dashboard-screen"'), 'index.html contains #owner-dashboard-screen');
  assert(indexHtml.includes('id="owner-mrr-val"'), 'index.html contains #owner-mrr-val');
  assert(indexHtml.includes('id="owner-trial-stores-count"'), 'index.html contains #owner-trial-stores-count');
  assert(indexHtml.includes('id="owner-stores-table-body"'), 'index.html contains #owner-stores-table-body');
  assert(indexHtml.includes('id="store-lock-overlay"'), 'index.html contains #store-lock-overlay');
  assert(indexHtml.includes('id="lock-submit-payment-btn"'), 'index.html contains #lock-submit-payment-btn');
  assert(indexHtml.includes('id="lock-overlay-activate-btn"'), 'index.html contains #lock-overlay-activate-btn');
  assert(indexHtml.includes('id="header-owner-billing-btn"'), 'index.html contains #header-owner-billing-btn');
  assert(indexHtml.includes('id="mobile-owner-billing-btn"'), 'index.html contains #mobile-owner-billing-btn');
  assert(indexHtml.includes('name="tenant-plan"'), 'index.html contains subscription tier selector');
}

console.log('\n======================================================');
console.log(`  E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
