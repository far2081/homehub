/**
-- ====================================================================
-- HomeHub - Supabase Client & Backend Service Architecture
-- Standard: Vanilla JavaScript ES6 Module (No React / No Bundler)
-- Brand: HomeHub (SHOP • STYLE • SMART)
-- Currency: PKR (Pakistani Rupee)
-- ====================================================================
*/

import { CATEGORIES, INITIAL_PRODUCTS } from '../data/products.js';

let _supabase = null;
let _config = {
  supabaseUrl: '',
  supabaseAnonKey: ''
};
let _initPromise = null;

/**
 * Fetch configuration from server /api/config or storage
 */
export async function initSupabase() {
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    try {
      // 1. Try fetching from server-side environment endpoint
      const res = await fetch('/api/config', { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data.supabaseUrl && data.supabaseAnonKey) {
          _config.supabaseUrl = data.supabaseUrl.trim();
          _config.supabaseAnonKey = data.supabaseAnonKey.trim();
        }
      }
    } catch (e) {
      // Offline / standalone mode
    }

    // 2. Check localStorage override if not set by server
    if (!_config.supabaseUrl || !_config.supabaseAnonKey) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = window.localStorage.getItem('homehub_supabase_config');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.supabaseUrl && parsed.supabaseAnonKey) {
              _config.supabaseUrl = parsed.supabaseUrl.trim();
              _config.supabaseAnonKey = parsed.supabaseAnonKey.trim();
            }
          }
        }
      } catch (e) {}
    }

    // 3. Initialize Supabase client if credentials present and client library available
    if (_config.supabaseUrl && _config.supabaseAnonKey) {
      const createClientFn = (typeof window !== 'undefined' && window.supabase && window.supabase.createClient)
        ? window.supabase.createClient
        : (typeof global !== 'undefined' && global.supabase && global.supabase.createClient)
          ? global.supabase.createClient
          : null;

      if (createClientFn) {
        try {
          _supabase = createClientFn(_config.supabaseUrl, _config.supabaseAnonKey, {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true
            }
          });
        } catch (err) {
          console.error('HomeHub Supabase Init Error:', err);
        }
      }
    }

    return _supabase;
  })();

  return _initPromise;
}

export function getSupabase() {
  return _supabase;
}

export function isSupabaseConfigured() {
  return Boolean(_supabase && _config.supabaseUrl && _config.supabaseAnonKey);
}

export function getSupabaseConfig() {
  return { ..._config };
}

export function setSupabaseConfig(url, key) {
  _config.supabaseUrl = (url || '').trim();
  _config.supabaseAnonKey = (key || '').trim();

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('homehub_supabase_config', JSON.stringify(_config));
    }
  } catch (e) {}

  if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient && _config.supabaseUrl && _config.supabaseAnonKey) {
    _supabase = window.supabase.createClient(_config.supabaseUrl, _config.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  }
  return _supabase;
}

/**
 * Test connectivity with Supabase backend
 */
export async function testSupabaseConnection() {
  await initSupabase();
  if (!_supabase) {
    return {
      connected: false,
      error: 'Supabase client is not initialized. Please verify SUPABASE_URL and SUPABASE_ANON_KEY.'
    };
  }

  const start = Date.now();
  try {
    const { data, error } = await _supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) {
      return {
        connected: false,
        error: error.message || 'Database query failed'
      };
    }

    return {
      connected: true,
      latencyMs: Date.now() - start
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message || 'Network connection failed'
    };
  }
}

// --------------------------------------------------------------------
// DATA ADAPTERS (PostgreSQL rows <-> HomeHub Storefront Model)
// --------------------------------------------------------------------

export function dbProductToStorefront(row) {
  if (!row) return null;
  const categoryId = row.category_id || 'furniture';
  const catObj = CATEGORIES ? CATEGORIES[categoryId] : null;

  return {
    id: row.id,
    sku: row.sku || row.id,
    name: row.name || 'Untitled Piece',
    category: categoryId,
    categoryLabel: catObj ? catObj.name : categoryId.toUpperCase(),
    price: Number(row.price_pkr || 0),
    shortDesc: row.short_desc || '',
    description: row.description || '',
    material: row.material || '',
    dimensions: row.dimensions || '',
    weight: row.weight || '',
    stock: Number(row.stock_count !== undefined ? row.stock_count : 10),
    isFeatured: Boolean(row.is_featured),
    isActive: Boolean(row.is_active !== false),
    variants: Array.isArray(row.variants) && row.variants.length > 0 ? row.variants : [
      { id: 'default', name: 'Standard Finish', hex: '#EADCCB', isDefault: true }
    ],
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85', caption: row.name, type: 'main' }
    ],
    relatedSkus: []
  };
}

export function storefrontToDbProduct(item) {
  return {
    id: item.id || item.sku,
    sku: item.sku || item.id,
    name: item.name,
    category_id: item.category || 'furniture',
    price_pkr: Number(item.price || 0),
    short_desc: item.shortDesc || item.name,
    description: item.description || item.shortDesc || '',
    material: item.material || 'Solid Hardwood & Architectural Joinery',
    dimensions: item.dimensions || 'Standard Atelier Dimensions',
    weight: item.weight || '10 kg',
    stock_count: Number(item.stock !== undefined ? item.stock : 10),
    is_featured: Boolean(item.isFeatured),
    is_active: item.isActive !== undefined ? Boolean(item.isActive) : true,
    images: Array.isArray(item.images) ? item.images : [],
    variants: Array.isArray(item.variants) ? item.variants : []
  };
}

// --------------------------------------------------------------------
// STOREFRONT DATABASE OPERATIONS
// --------------------------------------------------------------------

/**
 * Load active catalogue products from Supabase
 */
export async function fetchStorefrontProducts() {
  await initSupabase();
  if (!_supabase) {
    return { data: INITIAL_PRODUCTS, isFallback: true };
  }

  try {
    const { data, error } = await _supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase products fetch failed or empty, using fallback:', error);
      return { data: INITIAL_PRODUCTS, isFallback: true };
    }

    const adapted = data.map(dbProductToStorefront);
    return { data: adapted, isFallback: false };
  } catch (err) {
    console.warn('Network error loading Supabase products:', err);
    return { data: INITIAL_PRODUCTS, isFallback: true };
  }
}

/**
 * Load active categories from Supabase
 */
export async function fetchStorefrontCategories() {
  await initSupabase();
  if (!_supabase) return null;

  try {
    const { data, error } = await _supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data) return null;
    return data;
  } catch (e) {
    return null;
  }
}

/**
 * Execute secure server-side guest order creation
 */
export async function submitGuestOrder(orderData) {
  await initSupabase();
  if (!_supabase) {
    throw new Error('Supabase backend is currently not connected. Please contact HomeHub Atelier support.');
  }

  const payload = {
    p_customer_name: orderData.customerName,
    p_customer_email: orderData.customerEmail,
    p_customer_phone: orderData.customerPhone,
    p_shipping_address: orderData.shippingAddress,
    p_shipping_city: orderData.shippingCity,
    p_shipping_country: orderData.shippingCountry || 'Pakistan',
    p_items: orderData.items.map(item => ({
      sku: item.sku,
      quantity: Number(item.quantity) || 1,
      variant_name: item.variantName || null
    })),
    p_customer_notes: orderData.customerNotes || null,
    p_auth_user_id: null
  };

  const { data, error } = await _supabase.rpc('create_homehub_order', payload);

  if (error) {
    throw new Error(error.message || 'Server error creating order.');
  }

  return data;
}

// --------------------------------------------------------------------
// AUTHENTICATION & ADMIN ROLE VERIFICATION
// --------------------------------------------------------------------

/**
 * Authenticate admin via Supabase Auth and verify admin_profiles
 */
export async function authenticateAdmin(email, password) {
  await initSupabase();
  if (!_supabase) {
    throw new Error('Supabase is not configured.');
  }

  // 1. Supabase Auth Sign In
  const { data: authData, error: authError } = await _supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password
  });

  if (authError || !authData || !authData.user) {
    throw new Error(authError ? authError.message : 'Invalid credentials.');
  }

  // 2. Strict Role Verification in admin_profiles
  const { data: profile, error: profileError } = await _supabase
    .from('admin_profiles')
    .select('id, email, full_name, role, is_active')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile || !profile.is_active || !['ADMIN', 'SUPER_ADMIN', 'STUDIO_EDITOR'].includes(profile.role)) {
    await _supabase.auth.signOut();
    throw new Error('Access Denied: Your account is not registered as an active administrator in admin_profiles.');
  }

  return {
    user: authData.user,
    profile: profile
  };
}

/**
 * Check if current session belongs to a verified admin
 */
export async function getVerifiedAdminSession() {
  await initSupabase();
  if (!_supabase) return null;

  try {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session || !session.user) return null;

    const { data: profile } = await _supabase
      .from('admin_profiles')
      .select('id, email, full_name, role, is_active')
      .eq('id', session.user.id)
      .single();

    if (!profile || !profile.is_active || !['ADMIN', 'SUPER_ADMIN', 'STUDIO_EDITOR'].includes(profile.role)) {
      return null;
    }

    return { user: session.user, profile };
  } catch (e) {
    return null;
  }
}

/**
 * Sign out administrator
 */
export async function signOutAdmin() {
  if (_supabase) {
    await _supabase.auth.signOut();
  }
}

// --------------------------------------------------------------------
// ADMIN PRODUCT CRUD & IMAGE STORAGE
// --------------------------------------------------------------------

export async function adminFetchAllProducts() {
  await initSupabase();
  if (!_supabase) return [];

  const { data, error } = await _supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(dbProductToStorefront);
}

export async function adminCreateProduct(productData) {
  await initSupabase();
  if (!_supabase) throw new Error('Supabase not connected');

  const row = storefrontToDbProduct(productData);
  const { data, error } = await _supabase
    .from('products')
    .insert([row])
    .select()
    .single();

  if (error) throw error;
  return dbProductToStorefront(data);
}

export async function adminUpdateProduct(id, updates) {
  await initSupabase();
  if (!_supabase) throw new Error('Supabase not connected');

  const dbUpdates = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.category !== undefined) dbUpdates.category_id = updates.category;
  if (updates.price !== undefined) dbUpdates.price_pkr = Number(updates.price);
  if (updates.shortDesc !== undefined) dbUpdates.short_desc = updates.shortDesc;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.material !== undefined) dbUpdates.material = updates.material;
  if (updates.dimensions !== undefined) dbUpdates.dimensions = updates.dimensions;
  if (updates.weight !== undefined) dbUpdates.weight = updates.weight;
  if (updates.stock !== undefined) dbUpdates.stock_count = Number(updates.stock);
  if (updates.isFeatured !== undefined) dbUpdates.is_featured = Boolean(updates.isFeatured);
  if (updates.isActive !== undefined) dbUpdates.is_active = Boolean(updates.isActive);
  if (updates.images !== undefined) dbUpdates.images = updates.images;
  if (updates.variants !== undefined) dbUpdates.variants = updates.variants;

  const { data, error } = await _supabase
    .from('products')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return dbProductToStorefront(data);
}

export async function adminDeleteProduct(id) {
  await initSupabase();
  if (!_supabase) throw new Error('Supabase not connected');

  const { error } = await _supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Upload image file to Supabase Storage bucket 'product-images'
 */
export async function adminUploadProductImage(file) {
  await initSupabase();
  if (!_supabase) throw new Error('Supabase not connected');

  const fileExt = (file.name || 'image.jpg').split('.').pop();
  const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt || 'jpg'}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await _supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: urlData } = _supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// --------------------------------------------------------------------
// ADMIN ORDER MANAGEMENT
// --------------------------------------------------------------------

export async function adminFetchOrders() {
  await initSupabase();
  if (!_supabase) return [];

  const { data, error } = await _supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function adminUpdateOrderStatus(orderId, newStatus) {
  await initSupabase();
  if (!_supabase) throw new Error('Supabase not connected');

  const { data, error } = await _supabase
    .from('orders')
    .update({ order_status: newStatus })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateOrderShipping(orderId, shippingData) {
  await initSupabase();
  if (!_supabase) throw new Error('Supabase not connected');

  const { data, error } = await _supabase
    .from('orders')
    .update({
      shipping_address: shippingData.address,
      shipping_city: shippingData.city,
      customer_phone: shippingData.phone
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
