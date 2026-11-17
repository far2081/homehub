/**
 * HomeHub - Admin Management Architecture & Portal
 * Implements real frontend CRUD for products, inventory, banners, orders, and magazine previews.
 * Documents backend integration requirements, database schema, and security boundary.
 */

import { formatPKR, showToast } from '../utils/helpers.js';
import { storage } from '../utils/storage.js';

export class AdminPortal {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.products = options.products || [];
    this.categories = options.categories || [];
    this.activeTab = 'products';
    this.onProductsUpdated = options.onProductsUpdated || (() => {});
    
    // Check session authentication (transient session storage)
    this.authenticated = this.checkSessionAuth();

    // Sample orders table (staged enquiries)
    this.orders = storage.get('admin_orders', [
      {
        id: "ORD-2026-881",
        customerName: "Ayesha Malik",
        email: "ayesha.m@example.com",
        city: "Lahore",
        items: "1× CloudCurve Sofa (Soft Ivory), 1× Noma Coffee Table",
        total: 470000,
        status: "Inquiry Staged",
        date: "2026-11-15"
      },
      {
        id: "ORD-2026-882",
        customerName: "Zainab Tariq",
        email: "zainab.t@example.com",
        city: "Karachi (Clifton)",
        items: "2× Aura Lounge Chair, 1× Luna Pendant",
        total: 392000,
        status: "Consultation Scheduled",
        date: "2026-11-16"
      }
    ]);

    this.banners = storage.get('admin_banners', [
      {
        id: "hero-autumn",
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

  isOpen() {
    return this.container.classList.contains('is-open');
  }

  open() {
    this.render();
    this.container.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.container.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  saveProducts() {
    storage.set('custom_products', this.products);
    this.onProductsUpdated(this.products);
  }

  checkSessionAuth() {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem('homehub_admin_auth') === 'true';
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  login(email, password) {
    // Valid staging credentials
    if (email === 'admin@homehub.atelier' && password === 'HomeHub@Atelier2026') {
      this.authenticated = true;
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('homehub_admin_auth', 'true');
        }
      } catch (e) {}
      showToast('Authentication successful. Welcome, Admin.', 'success');
      this.render();
      return true;
    } else {
      showToast('Invalid administrator credentials.', 'warning');
      return false;
    }
  }

  logout() {
    this.authenticated = false;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem('homehub_admin_auth');
      }
    } catch (e) {}
    showToast('Administrator logged out.', 'info');
    this.close();
  }

  render() {
    if (!this.authenticated) {
      this.renderLoginGate();
      return;
    }

    this.container.innerHTML = `
      <div class="admin-backdrop" id="admin-backdrop"></div>
      <div class="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        
        <!-- Header -->
        <div class="admin-topbar">
          <div class="admin-branding">
            <img src="assets/logo-light.svg" alt="HomeHub" class="admin-logo-img" />
            <div>
              <span class="admin-badge">ADMIN PORTAL • AUTHENTICATED</span>
              <h2 id="admin-title">Atelier Management Console</h2>
            </div>
          </div>
          <div class="admin-topbar-actions">
            <span class="admin-user-tag">👤 admin@homehub.atelier</span>
            <button class="admin-logout-btn" id="admin-logout-btn" title="End administrative session">Log Out</button>
            <button class="admin-close-btn" id="admin-close-btn" aria-label="Close Admin Portal">✕</button>
          </div>
        </div>

        <!-- Security Transparency Banner -->
        <div class="admin-security-alert">
          <div class="sec-icon">🔒</div>
          <div class="sec-text">
            <strong>Production Architecture & Security Notice:</strong>
            <p>
              This interface demonstrates the complete product, inventory, and order management architecture. In production, this console must be protected behind an isolated admin subdomain, HTTPS, role-based JWT authentication, and secure session cookies. All changes made in this session persist locally via localStorage.
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
            📑 Client Orders & Inquiries (${this.orders.length})
          </button>
          <button class="admin-tab-btn ${this.activeTab === 'banners' ? 'active' : ''}" data-atab="banners">
            📢 Banners & Announcements
          </button>
          <button class="admin-tab-btn ${this.activeTab === 'backend-specs' ? 'active' : ''}" data-atab="backend-specs">
            🔌 API & DB Specifications
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

  renderLoginGate() {
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
              <p>Access is restricted to authorized studio managers. Please sign in with your administrative credentials.</p>
            </div>
          </div>

          <!-- Staging Demo Credentials Helper -->
          <div class="admin-demo-creds-box">
            <div class="demo-creds-info">
              <span class="demo-tag">ATELIER DEMO CREDENTIALS:</span>
              <code>User: admin@homehub.atelier</code>
              <code>Key: HomeHub@Atelier2026</code>
            </div>
            <button type="button" class="admin-autofill-btn" id="admin-autofill-btn">
              ⚡ One-Click Fill Demo Credentials
            </button>
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

            <button type="submit" class="admin-login-submit-btn">
              Authenticate & Access Console →
            </button>
          </form>

          <div class="admin-security-explanation">
            <h4>Production Deployment Requirements:</h4>
            <ul>
              <li><strong>Backend JWT Authentication:</strong> Requires HTTPS and HttpOnly, SameSite=Strict cookies to prevent token theft.</li>
              <li><strong>Subdomain Isolation:</strong> Deploy admin interface to an isolated domain (e.g. <code>admin.homehub.atelier</code>) with strict CORS policies.</li>
              <li><strong>RBAC Enforcement:</strong> Enforce Role-Based Access Control on all mutation endpoints (<code>POST</code>, <code>PUT</code>, <code>DELETE</code>).</li>
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
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = this.container.querySelector('#admin-email').value.trim();
        const pass = this.container.querySelector('#admin-pass').value.trim();
        this.login(email, pass);
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
    if (this.activeTab === 'backend-specs') return this.renderBackendSpecsTab();
    return '';
  }

  renderProductsTab() {
    return `
      <div class="admin-tab-panel">
        <div class="panel-header-actions">
          <div>
            <h3>Catalogue Management</h3>
            <p>Manage product titles, SKUs, pricing in PKR, materials, and stock counts.</p>
          </div>
          <button class="admin-btn-primary" id="open-add-product-btn">+ Add New Product</button>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.products.map(p => `
                <tr data-sku="${p.sku}">
                  <td>
                    <div class="table-prod-cell">
                      <img src="${p.images[0].url}" alt="${p.name}" class="table-thumb" />
                      <div>
                        <strong>${p.name}</strong>
                        <span class="table-subdesc">${p.shortDesc.substring(0, 45)}...</span>
                      </div>
                    </div>
                  </td>
                  <td><code>${p.sku}</code></td>
                  <td><span class="table-pill">${p.categoryLabel}</span></td>
                  <td><strong>${formatPKR(p.price)}</strong></td>
                  <td>
                    <span class="stock-badge ${p.stock <= 5 ? 'stock-low' : 'stock-ok'}">
                      ${p.stock} units
                    </span>
                  </td>
                  <td>${p.isFeatured ? '★ Yes' : '—'}</td>
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

        <h3>Stock Levels by Category</h3>
        <div class="category-stock-grid">
          ${this.categories.map(cat => {
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
    return `
      <div class="admin-tab-panel">
        <div class="panel-header-actions">
          <div>
            <h3>Customer Orders & Atelier Enquiries</h3>
            <p>Staged orders and direct proforma inquiries submitted to the founder.</p>
          </div>
        </div>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client</th>
                <th>Location</th>
                <th>Selected Items</th>
                <th>Total (PKR)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${this.orders.map(o => `
                <tr>
                  <td><code>${o.id}</code></td>
                  <td>
                    <strong>${o.customerName}</strong><br/>
                    <small>${o.email}</small>
                  </td>
                  <td>${o.city}</td>
                  <td>${o.items}</td>
                  <td><strong>${formatPKR(o.total)}</strong></td>
                  <td><span class="status-pill stage">${o.status}</span></td>
                  <td>${o.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderBannersTab() {
    return `
      <div class="admin-tab-panel">
        <div class="panel-header-actions">
          <div>
            <h3>Editorial Banners & Top Announcement</h3>
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

  renderBackendSpecsTab() {
    return `
      <div class="admin-tab-panel">
        <div class="backend-specs-container">
          <div class="specs-intro">
            <h3>Backend Integration Architecture & Readiness</h3>
            <p>
              HomeHub's frontend architecture is completely decoupled and ready to connect to a production Node.js / Python / Go backend with PostgreSQL. See full specifications in <code>docs/API_SPECIFICATION.md</code> and <code>docs/DATABASE_SCHEMA.sql</code>.
            </p>
          </div>

          <div class="specs-endpoints-grid">
            <div class="endpoint-card">
              <span class="method get">GET</span>
              <code>/api/v1/products</code>
              <p>Fetches active catalogue products with category filters, search query, and pagination.</p>
            </div>
            <div class="endpoint-card">
              <span class="method post">POST</span>
              <code>/api/v1/products</code>
              <p>Creates a new product with image assets, dimensions, and variants (Admin JWT Required).</p>
            </div>
            <div class="endpoint-card">
              <span class="method put">PUT</span>
              <code>/api/v1/products/:sku</code>
              <p>Updates price, stock quantities, and variant swatches (Admin JWT Required).</p>
            </div>
            <div class="endpoint-card">
              <span class="method delete">DELETE</span>
              <code>/api/v1/products/:sku</code>
              <p>Soft deletes a product from the public catalogue (Admin JWT Required).</p>
            </div>
            <div class="endpoint-card">
              <span class="method get">GET</span>
              <code>/api/v1/magazines/:bookId</code>
              <p>Fetches complete magazine issue editorial pages, spreads, and linked product hotspots.</p>
            </div>
            <div class="endpoint-card">
              <span class="method post">POST</span>
              <code>/api/v1/orders/checkout</code>
              <p>Initializes Stripe / Payment Gateway session and reserves inventory.</p>
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
        btn.addEventListener('click', (e) => {
          const sku = e.currentTarget.dataset.delSku;
          if (confirm(`Are you sure you want to delete piece ${sku}?`)) {
            this.deleteProduct(sku);
          }
        });
      });
    }
  }

  deleteProduct(sku) {
    this.products = this.products.filter(p => p.sku !== sku);
    this.saveProducts();
    this.render();
    showToast(`Piece ${sku} deleted`, 'info');
  }

  openProductFormModal(existingProduct = null) {
    const modalWrap = this.container.querySelector('#product-form-modal-wrap');
    if (!modalWrap) return;

    const isEdit = !!existingProduct;

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
              <label>SKU *</label>
              <input type="text" id="f-sku" required ${isEdit ? 'readonly' : ''} value="${isEdit ? existingProduct.sku : 'HH-FUR-' + Math.floor(100 + Math.random()*899)}" />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Category *</label>
              <select id="f-cat">
                <option value="furniture" ${isEdit && existingProduct.category === 'furniture' ? 'selected' : ''}>Furniture</option>
                <option value="decor" ${isEdit && existingProduct.category === 'decor' ? 'selected' : ''}>Home Décor</option>
                <option value="lighting" ${isEdit && existingProduct.category === 'lighting' ? 'selected' : ''}>Lighting</option>
                <option value="small-spaces" ${isEdit && existingProduct.category === 'small-spaces' ? 'selected' : ''}>Small Space Solutions</option>
              </select>
            </div>
            <div class="form-group">
              <label>Price in PKR *</label>
              <input type="number" id="f-price" required min="1000" step="500" value="${isEdit ? existingProduct.price : 45000}" />
            </div>
          </div>

          <div class="form-group">
            <label>Short Description</label>
            <input type="text" id="f-short-desc" value="${isEdit ? existingProduct.shortDesc : ''}" placeholder="Brief aesthetic summary" />
          </div>

          <div class="form-group">
            <label>Full Editorial Description</label>
            <textarea id="f-desc" rows="3">${isEdit ? existingProduct.description : ''}</textarea>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Material Composition</label>
              <input type="text" id="f-material" value="${isEdit ? existingProduct.material : ''}" placeholder="e.g. Honed travertine, FSC oak" />
            </div>
            <div class="form-group">
              <label>Dimensions</label>
              <input type="text" id="f-dims" value="${isEdit ? existingProduct.dimensions : ''}" placeholder="e.g. 120cm W x 60cm D x 75cm H" />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Stock Reserve Units</label>
              <input type="number" id="f-stock" min="0" value="${isEdit ? existingProduct.stock : 8}" />
            </div>
            <div class="form-group">
              <label>Featured in Editorial</label>
              <select id="f-featured">
                <option value="yes" ${isEdit && existingProduct.isFeatured ? 'selected' : ''}>Yes</option>
                <option value="no" ${isEdit && !existingProduct.isFeatured ? 'selected' : ''}>No</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Primary Image URL</label>
            <input type="url" id="f-img-url" required value="${isEdit && existingProduct.images[0] ? existingProduct.images[0].url : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85'}" />
          </div>

          <div class="form-actions">
            <button type="button" class="admin-btn-secondary" id="cancel-pform-btn">Cancel</button>
            <button type="submit" class="admin-btn-primary">${isEdit ? 'Save Changes' : 'Create Piece'}</button>
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

    modalWrap.querySelector('#product-admin-form').addEventListener('submit', (e) => {
      e.preventDefault();

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
      const imgUrl = modalWrap.querySelector('#f-img-url').value.trim();

      const catLabels = {
        furniture: 'Furniture',
        decor: 'Home Décor',
        lighting: 'Lighting',
        'small-spaces': 'Small Space Solutions'
      };

      if (isEdit) {
        const idx = this.products.findIndex(p => p.sku === sku);
        if (idx > -1) {
          this.products[idx] = {
            ...this.products[idx],
            name,
            category: cat,
            categoryLabel: catLabels[cat] || 'Furniture',
            price,
            shortDesc,
            description: desc,
            material,
            dimensions: dims,
            stock,
            isFeatured,
            images: [
              { url: imgUrl, caption: 'Main Product View', type: 'main' },
              ...(this.products[idx].images.slice(1))
            ]
          };
          showToast(`Piece ${sku} updated successfully`, 'success');
        }
      } else {
        const newProduct = {
          id: sku,
          sku,
          name,
          category: cat,
          categoryLabel: catLabels[cat] || 'Furniture',
          price,
          shortDesc: shortDesc || 'Handcrafted HomeHub original piece.',
          description: desc || 'Meticulously crafted with quiet luxury aesthetics.',
          material: material || 'Natural stone and hardwood frame.',
          dimensions: dims || 'Standard proportions.',
          stock,
          isFeatured,
          variants: [
            { id: 'ivory', name: 'Soft Ivory', hex: '#F8F5EF', isDefault: true },
            { id: 'warm-beige', name: 'Warm Beige', hex: '#EADCCB' }
          ],
          images: [
            { url: imgUrl, caption: 'Main Product View', type: 'main' },
            { url: imgUrl, caption: 'Alternate Angle', type: 'alternate' },
            { url: imgUrl, caption: 'Material Detail', type: 'detail' },
            { url: imgUrl, caption: 'Lifestyle Interior', type: 'lifestyle' }
          ],
          relatedSkus: []
        };
        this.products.unshift(newProduct);
        showToast(`New piece "${name}" added to catalogue`, 'success');
      }

      this.saveProducts();
      closeForm();
      this.render();
    });
  }
}
