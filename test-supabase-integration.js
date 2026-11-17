/**
 * HomeHub - Supabase Backend & Admin Integration Test Suite
 */

import http from 'http';
import assert from 'assert';

// Minimal mock DOM for Node.js test environment
global.window = {
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  sessionStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  }
};
global.document = {
  getElementById: () => ({
    classList: { contains: () => false, add: () => {}, remove: () => {} },
    innerHTML: '',
    querySelector: () => null,
    querySelectorAll: () => []
  }),
  createElement: () => ({
    classList: { contains: () => false, add: () => {}, remove: () => {} },
    innerHTML: '',
    querySelector: () => null,
    querySelectorAll: () => []
  }),
  body: {
    appendChild: () => {},
    style: {}
  }
};

import {
  initSupabase,
  getSupabaseConfig,
  isSupabaseConfigured,
  dbProductToStorefront,
  storefrontToDbProduct,
  testSupabaseConnection
} from './js/services/supabaseClient.js';
import { AdminPortal } from './js/components/admin.js';
import { Cart } from './js/components/cart.js';
import { INITIAL_PRODUCTS, CATEGORIES } from './js/data/products.js';

console.log('======================================================');
console.log('  HOMEHUB — SUPABASE INTEGRATION TEST SUITE');
console.log('======================================================\n');

async function runTests() {
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`✗ FAIL: ${name}`, e.message);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`✗ FAIL: ${name}`, e.message);
    }
  }

  // 1. Test /api/config endpoint
  await asyncTest('Server /api/config serves safe Supabase credentials', async () => {
    const data = await new Promise((resolve, reject) => {
      http.get('http://localhost:3000/api/config', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });

    assert.ok(data.supabaseUrl, 'Missing supabaseUrl');
    assert.ok(data.supabaseAnonKey, 'Missing supabaseAnonKey');
    assert.strictEqual(data.supabaseServiceRoleKey, undefined, 'service_role key must never be exposed!');
    assert.ok(data.supabaseUrl.includes('supabase.co'), 'URL should point to supabase.co');
  });

  // 2. Test Data Adapters
  test('dbProductToStorefront converts Supabase row to storefront model', () => {
    const row = {
      id: 'HH-TEST-001',
      sku: 'HH-TEST-001',
      name: 'Travertine Coffee Table',
      category_id: 'furniture',
      price_pkr: 125000,
      short_desc: 'Monolithic cut honed travertine',
      description: 'Full description of table',
      material: 'Italian Travertine',
      dimensions: '120 × 60 × 40 cm',
      stock_count: 5,
      is_featured: true,
      is_active: true,
      images: [{ url: 'https://images.unsplash.com/test.jpg', caption: 'Front', type: 'main' }],
      variants: [{ id: 'sand', name: 'Sandstone', hex: '#EADCCB', isDefault: true }]
    };

    const sf = dbProductToStorefront(row);
    assert.strictEqual(sf.id, 'HH-TEST-001');
    assert.strictEqual(sf.sku, 'HH-TEST-001');
    assert.strictEqual(sf.name, 'Travertine Coffee Table');
    assert.strictEqual(sf.price, 125000);
    assert.strictEqual(sf.stock, 5);
    assert.strictEqual(sf.isFeatured, true);
    assert.strictEqual(sf.isActive, true);
    assert.strictEqual(sf.images[0].url, 'https://images.unsplash.com/test.jpg');
    assert.strictEqual(sf.variants[0].name, 'Sandstone');
  });

  test('storefrontToDbProduct converts storefront item to Supabase row', () => {
    const item = {
      sku: 'HH-LGT-999',
      name: 'Brass Ring Chandelier',
      category: 'lighting',
      price: 88000,
      shortDesc: 'Solid spun brass chandelier',
      description: 'Detailed description',
      material: 'Spun raw brass',
      dimensions: '80cm diameter',
      stock: 3,
      isFeatured: false,
      isActive: true,
      images: [{ url: 'https://images.unsplash.com/brass.jpg', caption: 'Main' }],
      variants: [{ id: 'aged', name: 'Aged Brass' }]
    };

    const row = storefrontToDbProduct(item);
    assert.strictEqual(row.sku, 'HH-LGT-999');
    assert.strictEqual(row.name, 'Brass Ring Chandelier');
    assert.strictEqual(row.category_id, 'lighting');
    assert.strictEqual(row.price_pkr, 88000);
    assert.strictEqual(row.stock_count, 3);
    assert.strictEqual(row.is_active, true);
  });

  // 3. Test Admin Portal Instantiation & Methods
  test('AdminPortal initializes and methods are present', () => {
    const portal = new AdminPortal('admin-portal-container', {
      products: INITIAL_PRODUCTS,
      categories: CATEGORIES
    });

    assert.ok(typeof portal.login === 'function', 'login method should exist');
    assert.ok(typeof portal.logout === 'function', 'logout method should exist');
    assert.ok(typeof portal.openProductFormModal === 'function', 'openProductFormModal should exist');
    assert.ok(typeof portal.handleDeleteProduct === 'function', 'handleDeleteProduct should exist');
    assert.ok(typeof portal.loadRemoteData === 'function', 'loadRemoteData should exist');
    assert.ok(typeof portal.openOrderShippingModal === 'function', 'openOrderShippingModal should exist');
  });

  // 4. Test Cart Guest Checkout Initialization
  test('Cart component initializes with guest checkout support', () => {
    const cart = new Cart('cart-drawer-container', {
      products: INITIAL_PRODUCTS
    });

    assert.ok(typeof cart.openCheckoutStatusModal === 'function', 'openCheckoutStatusModal should exist');
    assert.ok(typeof cart.addItem === 'function', 'addItem should exist');
    assert.ok(typeof cart.clear === 'function', 'clear should exist');
  });

  console.log('\n======================================================');
  console.log(`  SUPABASE TEST SUMMARY: ${passed} PASSED out of ${total}`);
  console.log('======================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test Suite crashed:', err);
  process.exit(1);
});
