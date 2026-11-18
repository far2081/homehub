/**
 * HomeHub — Modular Plugin & Architecture Engine
 * Pure Vanilla JavaScript ES6 Module Registry (Zero WordPress / Zero WooCommerce)
 * Provides lifecycle management, configuration persistence, and event bus for 15 core modules.
 */

import { storage } from '../utils/storage.js';

class HomeHubPluginRegistry {
  constructor() {
    this._modules = new Map();
    this._listeners = new Map();
    this._storageKey = 'homehub_plugin_registry';
    this._initDefaultModules();
    this._loadPersistedState();
  }

  _initDefaultModules() {
    const modules = [
      {
        id: 'catalogue',
        name: 'Product Catalogue',
        version: '1.2.0',
        category: 'core',
        enabled: true,
        description: '9 Room Categories, 14 authentic furniture pieces, multi-angle imagery, and PKR pricing.',
        config: { defaultSort: 'featured', itemsPerRowDesktop: 6, itemsPerRowMobile: 2 }
      },
      {
        id: 'commerce',
        name: 'Commerce & Bag Engine',
        version: '1.1.0',
        category: 'core',
        enabled: true,
        description: 'Shopping bag management, quantity steppers, subtotal in PKR, and persistence.',
        config: { maxQtyPerItem: 10, complimentaryShippingThreshold: 0 }
      },
      {
        id: 'orders',
        name: 'Order Lifecycle & RPC',
        version: '1.3.0',
        category: 'commerce',
        enabled: true,
        description: 'Guest order creation, Supabase PostgreSQL function validation, tracking, and cancellation rules.',
        config: { defaultStatus: 'PENDING', allowCancellationWithinHours: 24 }
      },
      {
        id: 'inventory',
        name: 'Inventory & Stock Tracker',
        version: '1.0.4',
        category: 'operations',
        enabled: true,
        description: 'Real-time stock deduction, low-stock threshold alerts, and overselling protection.',
        config: { lowStockThreshold: 2, trackStockHistory: true }
      },
      {
        id: 'shipping',
        name: 'White-Glove Shipping',
        version: '1.0.0',
        category: 'operations',
        enabled: true,
        description: 'Pakistan metropolitan delivery routing (Karachi, Lahore, Islamabad, etc.).',
        config: { freeDeliveryEnabled: true, standardRatePKR: 0 }
      },
      {
        id: 'coupons',
        name: 'Promotions & Coupons',
        version: '1.1.0',
        category: 'marketing',
        enabled: true,
        description: 'Discount code engine supporting percentage and fixed PKR discounts at checkout.',
        config: { allowStacking: false, defaultCoupon: 'HOMEHUB10' }
      },
      {
        id: 'wishlist',
        name: 'Wishlist & Save For Later',
        version: '1.0.2',
        category: 'commerce',
        enabled: true,
        description: 'Bookmarks drawer with instant one-tap transfer to shopping bag.',
        config: { maxWishlistItems: 50 }
      },
      {
        id: 'customers',
        name: 'Client Directory & Profiles',
        version: '1.0.5',
        category: 'crm',
        enabled: true,
        description: 'Customer profiles, contact logs, delivery destinations, and total spend analytics.',
        config: { autoCreateFromGuestOrders: true }
      },
      {
        id: 'reviews',
        name: 'Client Reviews & Endorsements',
        version: '1.0.0',
        category: 'marketing',
        enabled: true,
        description: 'Architectural endorsements, verified client testimonials, and 5-star ratings.',
        config: { moderationRequired: false }
      },
      {
        id: 'magazineCMS',
        name: 'Digital Editorial Magazines',
        version: '2.0.0',
        category: 'content',
        enabled: true,
        description: '4 Interactive 3D flipbook magazines with panoramic double-page spreads and product hotspots.',
        config: { soundEffects: true, autoTurnSpeedMs: 4000 }
      },
      {
        id: 'videoCMS',
        name: 'Video Masterclasses',
        version: '1.2.0',
        category: 'content',
        enabled: true,
        description: '5 Curated interior makeover masterclasses with styling takeaways and Shop-the-Look trays.',
        config: { autoplayNext: false, defaultQuality: '1080p' }
      },
      {
        id: 'invoices',
        name: 'PDF Receipts & Print Engine',
        version: '1.1.0',
        category: 'operations',
        enabled: true,
        description: 'Downloadable PDF invoices and browser-native printing with order reference breakdown.',
        config: { companyName: 'HomeHub Atelier', contactEmail: 'farzunmir@gmail.com' }
      },
      {
        id: 'analytics',
        name: 'SaaS Sales Analytics',
        version: '1.0.8',
        category: 'analytics',
        enabled: true,
        description: 'Gross revenue, order velocity, inventory health, and performance metrics.',
        config: { currency: 'PKR', refreshIntervalMinutes: 5 }
      },
      {
        id: 'seo',
        name: 'Architectural SEO & Metadata',
        version: '1.0.1',
        category: 'marketing',
        enabled: true,
        description: 'Dynamic Open Graph, Twitter Cards, Schema.org product structured data, and PWA manifest.',
        config: { ogSiteName: 'HomeHub Atelier', twitterHandle: '@homehub' }
      },
      {
        id: 'settings',
        name: 'Atelier Core Settings',
        version: '1.0.0',
        category: 'core',
        enabled: true,
        description: 'Brand identity, palette configuration, founder line, and white-glove delivery policies.',
        config: { founderEmail: 'farzunmir@gmail.com', location: 'Karachi, Pakistan' }
      }
    ];

    modules.forEach((mod) => {
      this._modules.set(mod.id, { ...mod });
    });
  }

  _loadPersistedState() {
    try {
      const stored = storage.get(this._storageKey);
      if (stored && typeof stored === 'object') {
        Object.keys(stored).forEach((id) => {
          if (this._modules.has(id)) {
            const current = this._modules.get(id);
            if (typeof stored[id].enabled === 'boolean') {
              current.enabled = stored[id].enabled;
            }
            if (stored[id].config && typeof stored[id].config === 'object') {
              current.config = { ...current.config, ...stored[id].config };
            }
          }
        });
      }
    } catch (_) {}
  }

  _savePersistedState() {
    try {
      const state = {};
      this._modules.forEach((mod, id) => {
        state[id] = { enabled: mod.enabled, config: mod.config };
      });
      storage.set(this._storageKey, state);
    } catch (_) {}
  }

  getAllModules() {
    return Array.from(this._modules.values());
  }

  getModule(id) {
    return this._modules.get(id) || null;
  }

  isEnabled(id) {
    const mod = this._modules.get(id);
    return mod ? mod.enabled : false;
  }

  toggleModule(id, enabledState = null) {
    const mod = this._modules.get(id);
    if (!mod) return false;

    // Never allow disabling core module
    if (mod.category === 'core' && enabledState === false) {
      return false;
    }

    mod.enabled = enabledState !== null ? Boolean(enabledState) : !mod.enabled;
    this._savePersistedState();
    this.emit('module:toggled', { id, enabled: mod.enabled });
    return mod.enabled;
  }

  updateConfig(id, newConfig) {
    const mod = this._modules.get(id);
    if (!mod) return false;
    mod.config = { ...mod.config, ...newConfig };
    this._savePersistedState();
    this.emit('module:config_updated', { id, config: mod.config });
    return true;
  }

  // Lightweight Event Bus
  on(event, handler) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(handler);
  }

  emit(event, data) {
    if (this._listeners.has(event)) {
      this._listeners.get(event).forEach((fn) => {
        try { fn(data); } catch (e) { console.error('Plugin event error:', e); }
      });
    }
  }
}

export const pluginRegistry = new HomeHubPluginRegistry();
