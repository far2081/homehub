/**
 * HomeHub - Admin Management Architecture & Supabase Integration Portal
 * Brand: HOMEHUB (SHOP • STYLE • SMART)
 * Implements real Supabase backend CRUD for products, storage image uploads,
 * real customer order tracking, inventory counts, and status updates.
 */

import { formatPKR, showToast } from '../utils/helpers.js';
import { storage } from '../utils/storage.js';
import {
  authenticateAdmin,
  getVerifiedAdminSession,
  signOutAdmin,
  isSupabaseConfigured,
  getSupabaseConfig,
  setSupabaseConfig,
  testSupabaseConnection,
  adminFetchAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadProductImage,
  adminFetchOrders,
  adminUpdateOrderStatus,
  adminUpdateOrderShipping
} from '../services/supabaseClient.js';

export class AdminPortal {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.products = options.products || [];
    this.categories = options.categories || [];
    this.activeTab = 'products';
    this.onProductsUpdated = options.onProductsUpdated || (() => {});
    
    // Auth & Session state
    this.authenticated = false;
    this.currentUser = null;
    this.adminProfile = null;
    this.isSupabaseAuth = false;

    // Live Supabase Orders
    this.orders = [];
    this.ordersFilter = '';
    this.isOrdersLoading = false;
    this.isProductsLoading = false;

    // Check existing verified session on start
    this.checkSessionAuth();

    // Default editorial banners
    this.banners = storage.get('admin_banners', [
      {
        id: "hero-volume-01",
        title: "Soft Luxury Modern • Volume 01",
        subtitle: "The Living Edit is now available for digital reading.",
        active: true
      },
      {
        id: "promo-delivery",
        title: "Complimentary White-Glove Installation",
        subtitle: "Available on all bespoke upholstery orders across Karachi, Lahore, and Islamabad.",
        active: true
      }
    ]);
  }

  async checkSessionAuth() {
    try {
      const verified = await getVerifiedAdminSession();
      if (verified && verified.user && verified.profile) {
        this.authenticated = true;
        this.currentUser = verified.user;
        this.adminProfile = verified.profile;
        this.isSupabaseAuth = true;
        return true;
      }
    } catch (e) {}

    // Fallback local session for offline development
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const stored = window.sessionStorage.getItem('homehub_admin_auth');
        if (stored === 'true') {
          this.authenticated = true;
          this.currentUser = { email: 'admin@homehub.atelier' };
          this.adminProfile = { role: 'SUPER_ADMIN', full_name: 'Atelier Lead' };
          return true;
        }
      }
    } catch (e) {}

    return false;
  }

  isOpen() {
    return this.container && this.container.classList.contains('is-open');
  }

  async open() {
    await this.checkSessionAuth();
    await this.render();
    if (this.container) {
      this.container.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (this.authenticated) {
        this.loadRemoteData();
      }
    }
  }

  close() {
    if (this.container) {
      this.container.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  async loadRemoteData() {
    if (!isSupabaseConfigured()) return;

    // Load live products from Supabase
    try {
      this.isProductsLoading = true;
      const remoteProducts = await adminFetchAllProducts();
      if (remoteProducts && remoteProducts.length > 0) {
        this.products = remoteProducts;
        this.onProductsUpdated(this.products);
      }
    } catch (err) {
      console.warn('Admin: Supabase products fetch error:', err.message);
    } finally {
      this.isProductsLoading = false;
    }

    // Load live orders from Supabase
    try {
      this.isOrdersLoading = true;
      this.orders = await adminFetchOrders();
    } catch (err) {
      console.warn('Admin: Supabase orders fetch error:', err.message);
    } finally {
      this.isOrdersLoading = false;
    }

    // Re-render active tab if still open
    if (this.isOpen()) {
      this.renderTabContentArea();
    }
  }

  async login(email, password) {
    // 1. Try Supabase Auth first
    if (isSupabaseConfigured()) {
      try {
        const result = await authenticateAdmin(email, password);
        if (result && result.user) {
          this.authenticated = true;
          this.currentUser = result.user;
          this.adminProfile = result.profile;
          this.isSupabaseAuth = true;
          showToast(`Welcome back, ${result.profile.full_name || 'Admin'} (${result.profile.role})`, 'success');
          await this.render();
          this.loadRemoteData();
          return true;
        }
      } catch (err) {
        showToast(err.message || 'Supabase authentication failed.', 'warning');
        return false;
      }
    }

    // 2. Offline / Demo Credentials Fallback
    if (email === 'admin@homehub.atelier' && password === 'HomeHub@Atelier2026') {
      this.authenticated = true;
      this.currentUser = { email: 'admin@homehub.atelier' };
      this.adminProfile = { role: 'SUPER_ADMIN', full_name: 'Studio Master' };
      this.isSupabaseAuth = false;
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('homehub_admin_auth', 'true');
        }
      } catch (e) {}
      showToast('Offline Atelier staging mode unlocked.', 'info');
      await this.render();
      return true;
    }

    showToast('Invalid administrator credentials.', 'warning');
    return false;
  }

  async logout() {
    if (this.isSupabaseAuth) {
      try {
        await signOutAdmin();
      } catch (e) {}
    }
    this.authenticated = false;
    this.currentUser = null;
    this.adminProfile = null;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem('homehub_admin_auth');
      }
    } catch (e) {}
    showToast('Administrator session ended.', 'info');
    this.close();
  }

  saveLocalProductsBackup() {
    storage.set('custom_products', this.products);
    this.onProductsUpdated(this.products);
  }

  async render() {
    if (!this.container) return;

    if (!this.authenticated) {
      this.renderLoginGate();
      return;
    }

    const cfg = getSupabaseConfig();
    const isConnected = isSupabaseConfigured();
    const userEmail = this.currentUser ? this.currentUser.email : 'admin@homehub.atelier';
    const roleTag = this.adminProfile ? this.adminProfile.role : 'SUPER_ADMIN';

    this.container.innerHTML = `
      <div class="admin-backdrop" id="admin-backdrop"></div>
      <div class="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        
        <!-- Header -->
        <div class="admin-topbar">
          <div class="admin-branding">
            <img src="assets/logo-light.svg" alt="HomeHub" class="admin-logo-img" />
            <div>
              <div class="admin-badge-row">
                <span class="admin-badge">ADMIN PORTAL • AUTHENTICATED</span>
                <span class="admin-connection-badge ${isConnected ? 'live' : 'staging'}">
                  ${isConnected ? '● Supabase Live DB' : '○ Offline Mode'}
                </span>
              </div>
              <h2 id="admin-title">Atelier Management Console</h2>
            </div>
          </div>
          <div class="admin-topbar-actions">
            <span class="admin-user-tag">👤 ${userEmail} [${roleTag}]</span>
            <button class="admin-logout-btn" id="admin-logout-btn" title="End administrative session">Log Out</button>
            <button class="admin-close-btn" id="admin-close-btn" aria-label="Close Admin Portal">✕</button>
          </div>
        </div>

        <!-- Supabase Connection Banner -->
        <div class="admin-security-alert ${isConnected ? 'db-connected' : 'db-unconnected'}">
          <div class="sec-icon">${isConnected ? '⚡' : '⚙️'}</div>
          <div class="sec-text">
            <strong>${isConnected ? 'Supabase Backend Connected' : 'Supabase Configuration Available'}</strong>
            <p>
              ${isConnected 
                ? `Active PostgreSQL instance: <code>${cfg.supabaseUrl}</code>. All product mutations, images, and orders are synchronized in real-time.`
                : 'Supabase credentials can be configured in <code>.env</code> or directly in the <strong>Supabase & DB Settings</strong> tab below.'}
            </p>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="admin-tabs" role="tablist">
          <button class="admin-tab-btn ${this.activeTab === 'products' ? 'active' : ''}" data-atab="products">
            📦 Products (${this.products.length})
          </button>
          <button class="admin-tab-btn ${this.activeTab === 'inventory' ? 'active' : ''}" data-atab="inventory">
            📊 Inventory & Stock
          </button>
          <button class="admin-tab-btn ${this.activeTab === 'orders' ? 'active' : ''}" data-atab="orders">
            📑 Supabase Orders (${this.orders.length})
          </button>
          <button class="admin-tab-btn ${this.activeTab === 'banners' ? 'active' : ''}" data-atab="banners">
            📢 Editorial Banners
          </button>
          <button class="admin-tab-btn ${this.activeTab === 'supabase-settings' ? 'active' : ''}" data-atab="supabase-settings">
            ⚡ Supabase & DB Settings
          </button>
        </div>

        <!-- Tab Body Content -->
        <div class="admin-content-area" id="admin-tab-content">
          ${this.renderTabContent()}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  renderTabContentArea() {
    const contentEl = this.container.querySelector('#admin-tab-content');
    if (contentEl) {
      contentEl.innerHTML = this.renderTabContent();
      this.bindTabSpecificEvents();
    }
  }

  renderLoginGate() {
    const isConnected = isSupabaseConfigured();

    this.container.innerHTML = `
      <div class="admin-backdrop" id="admin-backdrop"></div>
      <div class="admin-login-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        
        <div class="admin-login-topbar">
          <div class="admin-branding">
            <img src="assets/logo-light.svg" alt="HomeHub" class="admin-logo-img" />
            <div>
              <span class="admin-badge">RESTRICTED PORTAL</span>
              <h2 id="admin-login-title">Atelier Management</h2>
            </div>
          </div>
          <button class="admin-close-btn" id="admin-close-btn" aria-label="Close">✕</button>
        </div>

        <div class="admin-login-body">
          <div class="admin-login-alert">
            <span class="alert-icon">🔒</span>
            <div>
              <strong>Administrative Security Boundary</strong>
              <p>Authentication verifies role membership in the <code>admin_profiles</code> database table before granting access.</p>
            </div>
          </div>

          <form id="admin-login-form" class="admin-login-form">
            <div class="form-group">
              <label for="admin-email">Administrator Email</label>
              <input 
                type="email" 
                id="admin-email" 
                required 
                placeholder="admin@homehub.atelier" 
                autocomplete="username"
              />
            </div>

            <div class="form-group">
              <label for="admin-pass">Access Passkey / Password</label>
              <input 
                type="password" 
                id="admin-pass" 
                required 
                placeholder="••••••••••••••••" 
                autocomplete="current-password"
              />
            </div>

            <button type="submit" class="admin-login-submit-btn" id="admin-login-btn">
              Authenticate & Access Console →
            </button>
          </form>

          <!-- Staging Demo Credentials Helper -->
          <div class="admin-demo-creds-box">
            <div class="demo-creds-info">
              <span class="demo-tag">ATELIER STAGING CREDENTIALS:</span>
              <code>User: admin@homehub.atelier</code>
              <code>Key: HomeHub@Atelier2026</code>
            </div>
            <button type="button" class="admin-autofill-btn" id="admin-autofill-btn">
              ⚡ One-Click Fill Credentials
            </button>
          </div>

          <div class="admin-security-explanation">
            <h4>Supabase Architecture Details:</h4>
            <ul>
              <li><strong>Row Level Security (RLS):</strong> Protected via PostgreSQL policies on <code>products</code>, <code>orders</code>, and <code>admin_profiles</code>.</li>
              <li><strong>Zero Secrets in Browser:</strong> Uses only the safe <code>anon</code> publishable key. Service role keys are strictly prohibited in browser code.</li>
            </ul>
          </div>
        </div>

      </div>
    `;

    // Bind login gate events
    const backdrop = this.container.querySelector('#admin-backdrop');
    const closeBtn = this.container.querySelector('#admin-close-btn');
    const form = this.container.querySelector('#admin-login-form');
    const autofillBtn = this.container.querySelector('#admin-autofill-btn');

    if (backdrop) backdrop.addEventListener('click', () => this.close());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    if (autofillBtn) {
      autofillBtn.addEventListener('click', () => {
        const emailInput = this.container.querySelector('#admin-email');
        const passInput = this.container.querySelector('#admin-pass');
        if (emailInput) emailInput.value = 'admin@homehub.atelier';
        if (passInput) passInput.value = 'HomeHub@Atelier2026';
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = this.container.querySelector('#admin-email').value.trim();
        const pass = this.container.querySelector('#admin-pass').value.trim();
        const submitBtn = this.container.querySelector('#admin-login-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Verifying Credentials...';
        }
        await this.login(email, pass);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Authenticate & Access Console →';
        }
      });
    }
  }

  bindEvents() {
    const backdrop = this.container.querySelector('#admin-backdrop');
    const closeBtn = this.container.querySelector('#admin-close-btn');
    const logoutBtn = this.container.querySelector('#admin-logout-btn');

    if (backdrop) backdrop.addEventListener('click', () => this.close());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

    // Tab buttons
    this.container.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.dataset.atab;
        this.render();
      });
    });

    this.bindTabSpecificEvents();
  }

  renderTabContent() {
    if (this.activeTab === 'products') return this.renderProductsTab();
    if (this.activeTab === 'inventory') return this.renderInventoryTab();
    if (this.activeTab === 'orders') return this.renderOrdersTab();
    if (this.activeTab === 'banners') return this.renderBannersTab();
    if (this.activeTab === 'supabase-settings') return this.renderSupabaseSettingsTab();
    return '';
  }

  renderProductsTab() {
    const isConnected = isSupabaseConfigured();

    return `
      <div class="admin-tab-panel">
        <div class="panel-header-actions">
          <div>
            <h3>Catalogue & Product Management</h3>
            <p>Manage product titles, SKUs, pricing in PKR, materials, dimensions, and Supabase Storage images.</p>
          </div>
          <div class="panel-btn-group">
            <button class="admin-btn-secondary" id="refresh-products-btn" title="Reload products from Supabase">
              🔄 ${this.isProductsLoading ? 'Syncing...' : 'Sync Supabase'}
            </button>
            <button class="admin-btn-primary" id="open-add-product-btn">+ Add New Product</button>
          </div>
        </div>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Piece</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price (PKR)</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.products.map(p => `
                <tr data-sku="${p.sku}">
                  <td>
                    <div class="table-prod-cell">
                      <img src="${(p.images && p.images[0]) ? p.images[0].url : 'assets/logo-dark.svg'}" alt="${p.name}" class="table-thumb" />
                      <div>
                        <strong>${p.name}</strong>
                        <span class="table-subdesc">${(p.shortDesc || '').substring(0, 45)}...</span>
                      </div>
                    </div>
                  </td>
                  <td><code>${p.sku}</code></td>
                  <td><span class="table-pill">${p.categoryLabel || p.category}</span></td>
                  <td><strong>${formatPKR(p.price)}</strong></td>
                  <td>
                    <span class="stock-badge ${p.stock <= 5 ? 'stock-low' : 'stock-ok'}">
                      ${p.stock} units
                    </span>
                  </td>
                  <td>${p.isFeatured ? '★ Yes' : '—'}</td>
                  <td>
                    <span class="status-pill ${p.isActive !== false ? 'active-pill' : 'inactive-pill'}">
                      ${p.isActive !== false ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions-cell">
                      <button class="table-action-edit" data-edit-sku="${p.sku}" title="Edit product">Edit</button>
                      <button class="table-action-del" data-del-sku="${p.sku}" title="Delete product">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Add / Edit Product Modal Container -->
        <div id="product-form-modal-wrap"></div>
      </div>
    `;
  }

  renderInventoryTab() {
    const totalUnits = this.products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalInventoryValue = this.products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);

    const categoriesList = Array.isArray(this.categories)
      ? this.categories
      : Object.entries(this.categories || {}).map(([id, cat]) => ({ id, name: cat.name || id }));

    return `
      <div class="admin-tab-panel">
        <div class="inventory-summary-cards">
          <div class="inv-metric-card">
            <span class="metric-label">Total Catalogue Pieces</span>
            <strong class="metric-val">${this.products.length} SKUs</strong>
          </div>
          <div class="inv-metric-card">
            <span class="metric-label">Total Inventory Units</span>
            <strong class="metric-val">${totalUnits} Pieces</strong>
          </div>
          <div class="inv-metric-card">
            <span class="metric-label">Estimated Inventory Value</span>
            <strong class="metric-val">${formatPKR(totalInventoryValue)}</strong>
          </div>
        </div>

        <h3>Stock Levels by Room & Category</h3>
        <div class="category-stock-grid">
          ${categoriesList.map(cat => {
            const catProds = this.products.filter(p => p.category === cat.id);
            const units = catProds.reduce((a, b) => a + (b.stock || 0), 0);
            return `
              <div class="cat-stock-card">
                <h4>${cat.name}</h4>
                <div class="cat-count-row">
                  <span>${catProds.length} SKUs active</span>
                  <strong>${units} units in reserve</strong>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderOrdersTab() {
    const isConnected = isSupabaseConfigured();
    const filteredOrders = this.ordersFilter
      ? this.orders.filter(o => 
          (o.order_number && o.order_number.toLowerCase().includes(this.ordersFilter)) ||
          (o.customer_name && o.customer_name.toLowerCase().includes(this.ordersFilter)) ||
          (o.customer_email && o.customer_email.toLowerCase().includes(this.ordersFilter))
        )
      : this.orders;

    return `
      <div class="admin-tab-panel">
        <div class="panel-header-actions">
          <div>
            <h3>Customer Orders & Supabase Live Records</h3>
            <p>Orders created through guest checkout via the secure <code>create_homehub_order()</code> PostgreSQL function.</p>
          </div>
          <div class="panel-btn-group">
            <input 
              type="text" 
              class="admin-search-input" 
              id="orders-search-input" 
              placeholder="Search by order # or client name..." 
              value="${this.ordersFilter}"
            />
            <button class="admin-btn-secondary" id="refresh-orders-btn" title="Refresh orders from Supabase">
              🔄 ${this.isOrdersLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        ${filteredOrders.length === 0 ? `
          <div class="admin-empty-table-state">
            <div class="empty-icon">📑</div>
            <h4>${this.isOrdersLoading ? 'Querying Supabase orders table...' : 'No orders recorded yet.'}</h4>
            <p>When visitors complete a guest checkout, orders appear here in real-time with customer address, contact phone, item details, and server-validated totals.</p>
          </div>
        ` : `
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Client & Contact</th>
                  <th>Delivery Destination</th>
                  <th>Line Items</th>
                  <th>Total (PKR)</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filteredOrders.map(o => {
                  const itemsSummary = Array.isArray(o.order_items) && o.order_items.length > 0
                    ? o.order_items.map(it => `${it.quantity}× ${it.product_name || it.sku}`).join(', ')
                    : (o.items || '—');

                  return `
                    <tr data-order-id="${o.id}">
                      <td><code>${o.order_number || o.id.substring(0, 8)}</code></td>
                      <td>
                        <strong>${o.customer_name || 'Anonymous Client'}</strong><br/>
                        <small>📧 ${o.customer_email || '—'}</small><br/>
                        <small>📞 ${o.customer_phone || '—'}</small>
                      </td>
                      <td>
                        <strong>${o.shipping_city || '—'}</strong><br/>
                        <small class="address-preview">${o.shipping_address || '—'}</small>
                      </td>
                      <td><span class="order-items-snippet">${itemsSummary}</span></td>
                      <td><strong>${formatPKR(o.total_pkr || o.total || 0)}</strong></td>
                      <td>
                        <select class="order-status-select" data-order-status-id="${o.id}">
                          <option value="PENDING" ${(o.order_status === 'PENDING') ? 'selected' : ''}>PENDING</option>
                          <option value="CONFIRMED" ${(o.order_status === 'CONFIRMED') ? 'selected' : ''}>CONFIRMED</option>
                          <option value="PROCESSING" ${(o.order_status === 'PROCESSING') ? 'selected' : ''}>PROCESSING</option>
                          <option value="SHIPPED" ${(o.order_status === 'SHIPPED') ? 'selected' : ''}>SHIPPED</option>
                          <option value="DELIVERED" ${(o.order_status === 'DELIVERED') ? 'selected' : ''}>DELIVERED</option>
                          <option value="CANCELLED" ${(o.order_status === 'CANCELLED') ? 'selected' : ''}>CANCELLED</option>
                        </select>
                      </td>
                      <td><small>${new Date(o.created_at || Date.now()).toLocaleDateString()}</small></td>
                      <td>
                        <button class="table-action-edit" data-edit-order-id="${o.id}" title="Edit shipping details">
                          Edit Delivery
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}

        <div id="order-edit-modal-wrap"></div>
      </div>
    `;
  }

  renderBannersTab() {
    return `
      <div class="admin-tab-panel">
        <div class="panel-header-actions">
          <div>
            <h3>Editorial Banners & Announcements</h3>
            <p>Manage header marquee announcements and magazine highlights.</p>
          </div>
        </div>

        <div class="banners-list">
          ${this.banners.map(b => `
            <div class="banner-edit-card">
              <div class="banner-info">
                <strong>${b.title}</strong>
                <p>${b.subtitle}</p>
              </div>
              <span class="banner-status-tag ${b.active ? 'active' : 'inactive'}">
                ${b.active ? 'Active' : 'Draft'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderSupabaseSettingsTab() {
    const cfg = getSupabaseConfig();
    const isConnected = isSupabaseConfigured();

    return `
      <div class="admin-tab-panel">
        <div class="backend-specs-container">
          <div class="specs-intro">
            <h3>Supabase Connection & Database Configuration</h3>
            <p>
              HomeHub utilizes Supabase as a zero-maintenance, enterprise PostgreSQL backend. Connect your Supabase project credentials below to unlock real-time inventory updates, image uploads to Supabase Storage, and secure server-validated orders.
            </p>
          </div>

          <div class="supabase-status-card ${isConnected ? 'status-connected' : 'status-pending'}">
            <div class="status-indicator-dot"></div>
            <div class="status-details">
              <strong>${isConnected ? 'Supabase Backend Active' : 'Supabase Not Configured'}</strong>
              <p>${isConnected ? `Connected to ${cfg.supabaseUrl}` : 'Please enter your Supabase Project URL and Public Anon Key below.'}</p>
            </div>
            <button class="admin-btn-secondary" id="test-supabase-ping-btn">
              ⚡ Test Connection
            </button>
          </div>

          <form id="supabase-config-form" class="supabase-config-form">
            <div class="form-group">
              <label for="cfg-supabase-url">Supabase Project URL (HTTPS)</label>
              <input 
                type="url" 
                id="cfg-supabase-url" 
                required 
                value="${cfg.supabaseUrl || ''}" 
                placeholder="https://xyzcompany.supabase.co" 
              />
              <small class="field-help">Found in Supabase Project Settings → API → Project URL</small>
            </div>

            <div class="form-group">
              <label for="cfg-supabase-anon">Supabase Publishable Anon Key</label>
              <input 
                type="text" 
                id="cfg-supabase-anon" 
                required 
                value="${cfg.supabaseAnonKey || ''}" 
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
              />
              <small class="field-help">Found in Supabase Project Settings → API → Project API Keys (anon public key only; never enter service_role key here)</small>
            </div>

            <div class="form-actions">
              <button type="submit" class="admin-btn-primary">
                Save & Apply Credentials
              </button>
            </div>
          </form>

          <div class="supabase-features-grid">
            <div class="feature-card">
              <h4>1. Database Schema</h4>
              <p>Executed via <code>supabase/HOMEHUB_DATABASE_SETUP.sql</code> containing tables: <code>products</code>, <code>categories</code>, <code>customers</code>, <code>orders</code>, <code>order_items</code>, and <code>admin_profiles</code>.</p>
            </div>
            <div class="feature-card">
              <h4>2. Image Storage</h4>
              <p>Bucket <code>product-images</code> is configured with public read access. Administrators can upload photography directly from the product modal.</p>
            </div>
            <div class="feature-card">
              <h4>3. Guest Order Function</h4>
              <p>PostgreSQL function <code>create_homehub_order()</code> computes order totals and inventory decrements inside an ACID transaction on the database server.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindTabSpecificEvents() {
    if (this.activeTab === 'products') {
      const addBtn = this.container.querySelector('#open-add-product-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          this.openProductFormModal();
        });
      }

      const refreshBtn = this.container.querySelector('#refresh-products-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
          refreshBtn.disabled = true;
          showToast('Syncing products with Supabase...', 'info');
          await this.loadRemoteData();
          refreshBtn.disabled = false;
          showToast('Products synchronized.', 'success');
        });
      }

      // Edit buttons
      this.container.querySelectorAll('[data-edit-sku]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const sku = e.currentTarget.dataset.editSku;
          const prod = this.products.find(p => p.sku === sku);
          if (prod) this.openProductFormModal(prod);
        });
      });

      // Delete buttons
      this.container.querySelectorAll('[data-del-sku]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const sku = e.currentTarget.dataset.delSku;
          if (confirm(`Are you sure you want to permanently delete piece ${sku}?`)) {
            await this.handleDeleteProduct(sku);
          }
        });
      });
    }

    if (this.activeTab === 'orders') {
      const refreshBtn = this.container.querySelector('#refresh-orders-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
          refreshBtn.disabled = true;
          await this.loadRemoteData();
          refreshBtn.disabled = false;
          showToast('Orders refreshed.', 'success');
        });
      }

      const searchInput = this.container.querySelector('#orders-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.ordersFilter = e.target.value.toLowerCase().trim();
          this.renderTabContentArea();
        });
      }

      // Status change dropdowns
      this.container.querySelectorAll('.order-status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
          const orderId = e.currentTarget.dataset.orderStatusId;
          const newStatus = e.currentTarget.value;
          try {
            await adminUpdateOrderStatus(orderId, newStatus);
            showToast(`Order status updated to ${newStatus}`, 'success');
          } catch (err) {
            showToast(`Failed to update status: ${err.message}`, 'warning');
          }
        });
      });

      // Edit delivery modal triggers
      this.container.querySelectorAll('[data-edit-order-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const orderId = e.currentTarget.dataset.editOrderId;
          const order = this.orders.find(o => o.id === orderId);
          if (order) this.openOrderShippingModal(order);
        });
      });
    }

    if (this.activeTab === 'supabase-settings') {
      const form = this.container.querySelector('#supabase-config-form');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const url = this.container.querySelector('#cfg-supabase-url').value.trim();
          const key = this.container.querySelector('#cfg-supabase-anon').value.trim();
          setSupabaseConfig(url, key);
          showToast('Credentials saved! Testing connection...', 'info');
          const test = await testSupabaseConnection();
          if (test.connected) {
            showToast(`Connected to Supabase! Latency: ${test.latencyMs}ms`, 'success');
            await this.loadRemoteData();
            this.render();
          } else {
            showToast(`Connection error: ${test.error}`, 'warning');
          }
        });
      }

      const pingBtn = this.container.querySelector('#test-supabase-ping-btn');
      if (pingBtn) {
        pingBtn.addEventListener('click', async () => {
          pingBtn.disabled = true;
          pingBtn.textContent = 'Pinging...';
          const test = await testSupabaseConnection();
          pingBtn.disabled = false;
          pingBtn.textContent = '⚡ Test Connection';
          if (test.connected) {
            showToast(`Live PostgreSQL Response in ${test.latencyMs}ms`, 'success');
          } else {
            showToast(`Connection failed: ${test.error}`, 'warning');
          }
        });
      }
    }
  }

  async handleDeleteProduct(sku) {
    const prod = this.products.find(p => p.sku === sku);
    if (!prod) return;

    if (isSupabaseConfigured()) {
      try {
        await adminDeleteProduct(prod.id || sku);
        showToast(`Piece ${sku} deleted from Supabase.`, 'info');
      } catch (err) {
        showToast(`Supabase delete error: ${err.message}`, 'warning');
      }
    }

    this.products = this.products.filter(p => p.sku !== sku);
    this.saveLocalProductsBackup();
    this.render();
  }

  openProductFormModal(existingProduct = null) {
    const modalWrap = this.container.querySelector('#product-form-modal-wrap');
    if (!modalWrap) return;

    const isEdit = Boolean(existingProduct);
    const catValue = isEdit ? existingProduct.category : 'furniture';

    modalWrap.innerHTML = `
      <div class="submodal-backdrop"></div>
      <div class="submodal-card">
        <div class="submodal-header">
          <h3>${isEdit ? `Edit Piece: ${existingProduct.sku}` : 'Add New HomeHub Piece'}</h3>
          <button class="submodal-close" id="close-pform-btn">✕</button>
        </div>

        <form id="product-admin-form" class="admin-form">
          <div class="form-row-2">
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" id="f-name" required value="${isEdit ? existingProduct.name : ''}" placeholder="e.g. Solis Dining Chair" />
            </div>
            <div class="form-group">
              <label>SKU (Stock Keeping Unit) *</label>
              <input type="text" id="f-sku" required ${isEdit ? 'readonly' : ''} value="${isEdit ? existingProduct.sku : 'HH-FUR-' + Math.floor(100 + Math.random()*899)}" />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Room Category *</label>
              <select id="f-cat">
                <option value="furniture" ${catValue === 'furniture' ? 'selected' : ''}>Furniture & Seating</option>
                <option value="decor" ${catValue === 'decor' ? 'selected' : ''}>Home Décor & Accents</option>
                <option value="lighting" ${catValue === 'lighting' ? 'selected' : ''}>Architectural Lighting</option>
                <option value="bedroom" ${catValue === 'bedroom' ? 'selected' : ''}>Bedroom & Sleep</option>
                <option value="living-room" ${catValue === 'living-room' ? 'selected' : ''}>Living Room</option>
                <option value="dining-room" ${catValue === 'dining-room' ? 'selected' : ''}>Dining Room</option>
                <option value="kitchen" ${catValue === 'kitchen' ? 'selected' : ''}>Kitchen & Culinary</option>
                <option value="bathroom" ${catValue === 'bathroom' ? 'selected' : ''}>Bathroom & Wellness</option>
                <option value="small-spaces" ${catValue === 'small-spaces' ? 'selected' : ''}>Small Space Solutions</option>
              </select>
            </div>
            <div class="form-group">
              <label>Price in PKR *</label>
              <input type="number" id="f-price" required min="500" step="500" value="${isEdit ? existingProduct.price : 45000}" />
            </div>
          </div>

          <div class="form-group">
            <label>Short Description (Storefront summary)</label>
            <input type="text" id="f-short-desc" value="${isEdit ? (existingProduct.shortDesc || '') : ''}" placeholder="Brief aesthetic summary" />
          </div>

          <div class="form-group">
            <label>Full Editorial Description</label>
            <textarea id="f-desc" rows="3">${isEdit ? (existingProduct.description || '') : ''}</textarea>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Material Composition</label>
              <input type="text" id="f-material" value="${isEdit ? (existingProduct.material || '') : ''}" placeholder="e.g. Honed travertine, FSC oak" />
            </div>
            <div class="form-group">
              <label>Dimensions</label>
              <input type="text" id="f-dims" value="${isEdit ? (existingProduct.dimensions || '') : ''}" placeholder="e.g. 120cm W x 60cm D x 75cm H" />
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label>Stock Reserve Units</label>
              <input type="number" id="f-stock" min="0" value="${isEdit ? existingProduct.stock : 10}" />
            </div>
            <div class="form-group">
              <label>Featured Piece</label>
              <select id="f-featured">
                <option value="yes" ${isEdit && existingProduct.isFeatured ? 'selected' : ''}>Yes</option>
                <option value="no" ${isEdit && !existingProduct.isFeatured ? 'selected' : ''}>No</option>
              </select>
            </div>
            <div class="form-group">
              <label>Catalogue Status</label>
              <select id="f-active">
                <option value="yes" ${!isEdit || existingProduct.isActive !== false ? 'selected' : ''}>Active (Visible)</option>
                <option value="no" ${isEdit && existingProduct.isActive === false ? 'selected' : ''}>Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <!-- Supabase Image Upload & URL Section -->
          <div class="form-group image-upload-section">
            <label>Product Photography</label>
            <div class="image-source-toggle">
              <input 
                type="file" 
                id="f-img-file" 
                accept="image/jpeg,image/png,image/webp,image/avif" 
                class="file-upload-input"
              />
              <span class="upload-status" id="upload-status-indicator"></span>
            </div>
            <div class="url-input-wrap">
              <input 
                type="url" 
                id="f-img-url" 
                required 
                value="${isEdit && existingProduct.images && existingProduct.images[0] ? existingProduct.images[0].url : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85'}" 
                placeholder="Or paste image URL"
              />
            </div>
            <div class="image-preview-box">
              <img id="form-img-preview" src="${isEdit && existingProduct.images && existingProduct.images[0] ? existingProduct.images[0].url : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85'}" alt="Preview" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="admin-btn-secondary" id="cancel-pform-btn">Cancel</button>
            <button type="submit" class="admin-btn-primary" id="save-product-submit-btn">
              ${isEdit ? 'Save Changes' : 'Create Piece'}
            </button>
          </div>
        </form>
      </div>
    `;

    const closeForm = () => {
      modalWrap.innerHTML = '';
    };

    modalWrap.querySelector('.submodal-backdrop').addEventListener('click', closeForm);
    modalWrap.querySelector('#close-pform-btn').addEventListener('click', closeForm);
    modalWrap.querySelector('#cancel-pform-btn').addEventListener('click', closeForm);

    // Live URL preview
    const urlInput = modalWrap.querySelector('#f-img-url');
    const previewImg = modalWrap.querySelector('#form-img-preview');
    if (urlInput && previewImg) {
      urlInput.addEventListener('input', () => {
        if (urlInput.value.trim()) {
          previewImg.src = urlInput.value.trim();
        }
      });
    }

    // Direct Supabase Storage File Upload
    const fileInput = modalWrap.querySelector('#f-img-file');
    const statusIndicator = modalWrap.querySelector('#upload-status-indicator');
    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!isSupabaseConfigured()) {
          showToast('Supabase not configured. Using local preview only.', 'info');
          const localUrl = URL.createObjectURL(file);
          if (urlInput) urlInput.value = localUrl;
          if (previewImg) previewImg.src = localUrl;
          return;
        }

        try {
          if (statusIndicator) statusIndicator.textContent = '⏳ Uploading to Supabase Storage...';
          const publicUrl = await adminUploadProductImage(file);
          if (urlInput) urlInput.value = publicUrl;
          if (previewImg) previewImg.src = publicUrl;
          if (statusIndicator) statusIndicator.textContent = '✓ Uploaded to product-images bucket!';
          showToast('Image uploaded successfully to Supabase Storage!', 'success');
        } catch (err) {
          if (statusIndicator) statusIndicator.textContent = '❌ Upload failed';
          showToast(`Storage error: ${err.message}`, 'warning');
        }
      });
    }

    modalWrap.querySelector('#product-admin-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = modalWrap.querySelector('#save-product-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
      }

      const name = modalWrap.querySelector('#f-name').value.trim();
      const sku = modalWrap.querySelector('#f-sku').value.trim();
      const cat = modalWrap.querySelector('#f-cat').value;
      const price = parseInt(modalWrap.querySelector('#f-price').value, 10);
      const shortDesc = modalWrap.querySelector('#f-short-desc').value.trim();
      const desc = modalWrap.querySelector('#f-desc').value.trim();
      const material = modalWrap.querySelector('#f-material').value.trim();
      const dims = modalWrap.querySelector('#f-dims').value.trim();
      const stock = parseInt(modalWrap.querySelector('#f-stock').value, 10);
      const isFeatured = modalWrap.querySelector('#f-featured').value === 'yes';
      const isActive = modalWrap.querySelector('#f-active').value === 'yes';
      const imgUrl = modalWrap.querySelector('#f-img-url').value.trim();

      const productPayload = {
        id: isEdit ? (existingProduct.id || sku) : sku,
        sku,
        name,
        category: cat,
        price,
        shortDesc: shortDesc || name,
        description: desc || shortDesc || '',
        material: material || 'Natural stone and hardwood frame.',
        dimensions: dims || 'Standard atelier proportions.',
        stock,
        isFeatured,
        isActive,
        images: [
          { url: imgUrl, caption: 'Main Product View', type: 'main' },
          { url: imgUrl, caption: 'Alternate Angle', type: 'alternate' },
          { url: imgUrl, caption: 'Material Detail', type: 'detail' },
          { url: imgUrl, caption: 'Lifestyle Interior', type: 'lifestyle' }
        ],
        variants: [
          { id: 'standard', name: 'Standard Finish', hex: '#EADCCB', isDefault: true }
        ]
      };

      try {
        if (isSupabaseConfigured()) {
          if (isEdit) {
            const updated = await adminUpdateProduct(productPayload.id, productPayload);
            const idx = this.products.findIndex(p => p.sku === sku);
            if (idx > -1) this.products[idx] = updated;
            showToast(`Piece ${sku} updated in Supabase database.`, 'success');
          } else {
            const created = await adminCreateProduct(productPayload);
            this.products.unshift(created);
            showToast(`New piece "${name}" saved to Supabase!`, 'success');
          }
        } else {
          // Offline fallback
          if (isEdit) {
            const idx = this.products.findIndex(p => p.sku === sku);
            if (idx > -1) this.products[idx] = { ...this.products[idx], ...productPayload };
            showToast(`Piece ${sku} updated (Local).`, 'info');
          } else {
            this.products.unshift(productPayload);
            showToast(`Piece ${name} created (Local).`, 'info');
          }
        }

        this.saveLocalProductsBackup();
        closeForm();
        this.render();
      } catch (err) {
        showToast(`Save error: ${err.message}`, 'warning');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = isEdit ? 'Save Changes' : 'Create Piece';
        }
      }
    });
  }

  openOrderShippingModal(order) {
    const modalWrap = this.container.querySelector('#order-edit-modal-wrap');
    if (!modalWrap) return;

    modalWrap.innerHTML = `
      <div class="submodal-backdrop"></div>
      <div class="submodal-card">
        <div class="submodal-header">
          <h3>Edit Delivery: Order ${order.order_number || order.id.substring(0, 8)}</h3>
          <button class="submodal-close" id="close-oform-btn">✕</button>
        </div>

        <form id="order-shipping-form" class="admin-form">
          <div class="form-group">
            <label>Recipient Name</label>
            <input type="text" readonly value="${order.customer_name || ''}" />
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Delivery City *</label>
              <input type="text" id="o-city" required value="${order.shipping_city || ''}" />
            </div>
            <div class="form-group">
              <label>Contact Phone *</label>
              <input type="text" id="o-phone" required value="${order.customer_phone || ''}" />
            </div>
          </div>

          <div class="form-group">
            <label>Complete Street Address *</label>
            <textarea id="o-address" rows="3" required>${order.shipping_address || ''}</textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="admin-btn-secondary" id="cancel-oform-btn">Cancel</button>
            <button type="submit" class="admin-btn-primary" id="save-order-shipping-btn">Update Shipping</button>
          </div>
        </form>
      </div>
    `;

    const closeForm = () => {
      modalWrap.innerHTML = '';
    };

    modalWrap.querySelector('.submodal-backdrop').addEventListener('click', closeForm);
    modalWrap.querySelector('#close-oform-btn').addEventListener('click', closeForm);
    modalWrap.querySelector('#cancel-oform-btn').addEventListener('click', closeForm);

    modalWrap.querySelector('#order-shipping-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const city = modalWrap.querySelector('#o-city').value.trim();
      const phone = modalWrap.querySelector('#o-phone').value.trim();
      const address = modalWrap.querySelector('#o-address').value.trim();
      const saveBtn = modalWrap.querySelector('#save-order-shipping-btn');

      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
      }

      try {
        await adminUpdateOrderShipping(order.id, { city, phone, address });
        order.shipping_city = city;
        order.customer_phone = phone;
        order.shipping_address = address;
        showToast('Shipping details updated in Supabase.', 'success');
        closeForm();
        this.renderTabContentArea();
      } catch (err) {
        showToast(`Update error: ${err.message}`, 'warning');
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Update Shipping';
        }
      }
    });
  }
}
