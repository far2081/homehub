/**
 * HomeHub - Product Catalogue Component
 * Handles product grids, search, category filtering, sorting, and fast actions.
 */

import { formatPKR } from '../utils/helpers.js';

export class Catalogue {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.products = options.products || [];
    this.categories = options.categories || [];
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.currentSort = 'featured';
    this.onProductClick = options.onProductClick || (() => {});
    this.onAddToCart = options.onAddToCart || (() => {});
    this.onToggleWishlist = options.onToggleWishlist || (() => {});
    this.isWishlistedFn = options.isWishlistedFn || (() => false);

    this.render();
  }

  setProducts(products) {
    this.products = products;
    this.renderGrid();
  }

  setCategory(catId) {
    this.currentCategory = catId;
    // Update active category pill
    const pills = this.container.querySelectorAll('.cat-pill');
    pills.forEach(p => {
      p.classList.toggle('active', p.dataset.category === catId);
    });
    this.renderGrid();
  }

  setSearchQuery(query) {
    this.searchQuery = (query || '').trim().toLowerCase();
    const searchInput = this.container.querySelector('#catalogue-search-input');
    if (searchInput && searchInput.value !== query) {
      searchInput.value = query;
    }
    this.renderGrid();
  }

  setSort(sortType) {
    this.currentSort = sortType;
    this.renderGrid();
  }

  getFilteredProducts() {
    let list = [...this.products];

    // Filter by Category
    if (this.currentCategory !== 'all') {
      list = list.filter(p => p.category === this.currentCategory);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.sku.toLowerCase().includes(this.searchQuery) ||
        p.categoryLabel.toLowerCase().includes(this.searchQuery) ||
        p.material.toLowerCase().includes(this.searchQuery) ||
        p.shortDesc.toLowerCase().includes(this.searchQuery)
      );
    }

    // Sort
    if (this.currentSort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (this.currentSort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (this.currentSort === 'name-az') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // featured
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }

  render() {
    this.container.innerHTML = `
      <div class="catalogue-section">
        <!-- Concept Disclaimer Banner -->
        <div class="catalogue-concept-banner">
          <span class="banner-badge">INITIAL CATALOGUE CONCEPTS</span>
          <p class="banner-text">
            All items below represent HomeHub's independent brand collection with sample PKR pricing and aesthetic placeholder imagery. Real production inventory will be synchronized via the Admin Management API.
          </p>
        </div>

        <!-- Catalogue Controls Bar -->
        <div class="catalogue-toolbar">
          <!-- Category Filter Tabs -->
          <div class="catalogue-categories" role="tablist" aria-label="Product Categories">
            ${this.categories.map(cat => `
              <button 
                class="cat-pill ${cat.id === this.currentCategory ? 'active' : ''}" 
                data-category="${cat.id}"
                role="tab"
                aria-selected="${cat.id === this.currentCategory}"
              >
                ${cat.name}
              </button>
            `).join('')}
          </div>

          <!-- Search & Sort Row -->
          <div class="catalogue-actions">
            <!-- Search Input -->
            <div class="catalogue-search-box">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                id="catalogue-search-input" 
                placeholder="Search collection, material, SKU..." 
                value="${this.searchQuery}"
                aria-label="Search collection"
              />
              <button class="clear-search-btn" id="clear-search-btn" style="display: none;" title="Clear Search">✕</button>
            </div>

            <!-- Sort Select -->
            <div class="catalogue-sort-box">
              <label for="catalogue-sort-select">Sort by:</label>
              <select id="catalogue-sort-select" aria-label="Sort products">
                <option value="featured" ${this.currentSort === 'featured' ? 'selected' : ''}>Featured First</option>
                <option value="price-low" ${this.currentSort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-high" ${this.currentSort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
                <option value="name-az" ${this.currentSort === 'name-az' ? 'selected' : ''}>Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Result Stats -->
        <div class="catalogue-stats" id="catalogue-stats">
          <!-- Injected dynamically -->
        </div>

        <!-- Product Grid -->
        <div class="catalogue-grid" id="catalogue-grid">
          <!-- Injected dynamically -->
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderGrid();
  }

  bindEvents() {
    // Category pills
    const pills = this.container.querySelectorAll('.cat-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.category;
        this.setCategory(cat);
      });
    });

    // Search input
    const searchInput = this.container.querySelector('#catalogue-search-input');
    const clearBtn = this.container.querySelector('#clear-search-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
        this.setSearchQuery(val);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        clearBtn.style.display = 'none';
        this.setSearchQuery('');
      });
    }

    // Sort select
    const sortSelect = this.container.querySelector('#catalogue-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.setSort(e.target.value);
      });
    }
  }

  renderProducts() {
    this.renderGrid();
  }

  renderGrid() {
    const grid = this.container.querySelector('#catalogue-grid');
    const stats = this.container.querySelector('#catalogue-stats');
    if (!grid || !stats) return;

    const filtered = this.getFilteredProducts();

    stats.innerHTML = `
      <span class="stats-count">Showing <strong>${filtered.length}</strong> of ${this.products.length} independent pieces</span>
      ${this.searchQuery ? `<span class="stats-query">Matching "<em>${this.searchQuery}</em>"</span>` : ''}
    `;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="catalogue-empty">
          <div class="empty-icon">🪑</div>
          <h3>No matching pieces found</h3>
          <p>Try refining your search terms or clearing category filters to view all products.</p>
          <button class="empty-reset-btn" id="empty-reset-btn">View Complete Collection</button>
        </div>
      `;

      const resetBtn = grid.querySelector('#empty-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.setCategory('all');
          this.setSearchQuery('');
        });
      }
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const isWish = this.isWishlistedFn(p.sku);
      const mainImg = p.images && p.images[0] ? p.images[0].url : '';
      const altImg = p.images && p.images[1] ? p.images[1].url : mainImg;

      return `
        <article class="product-card" data-sku="${p.sku}">
          <div class="card-media">
            <img 
              src="${mainImg}" 
              alt="${p.name}" 
              class="card-img-main" 
              loading="lazy" 
            />
            <img 
              src="${altImg}" 
              alt="${p.name} alternate view" 
              class="card-img-hover" 
              loading="lazy" 
            />
            
            <!-- Wishlist Heart Button -->
            <button 
              class="card-wishlist-btn ${isWish ? 'is-active' : ''}" 
              data-wishlist-sku="${p.sku}" 
              title="${isWish ? 'Remove from Wishlist' : 'Save to Wishlist'}"
              aria-label="Wishlist toggle"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWish ? '#C87D65' : 'none'}" stroke="currentColor" stroke-width="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            <!-- Quick Badges -->
            <div class="card-badges">
              ${p.isFeatured ? '<span class="badge-featured">Featured</span>' : ''}
              <span class="badge-sku">${p.sku}</span>
            </div>

            <!-- Quick View Overlay on hover -->
            <div class="card-quick-overlay">
              <button class="quick-view-btn" data-view-sku="${p.sku}">Inspect Piece</button>
            </div>
          </div>

          <div class="card-body">
            <div class="card-cat">${p.categoryLabel}</div>
            <h3 class="card-title" data-view-sku="${p.sku}">${p.name}</h3>
            <p class="card-desc">${p.shortDesc}</p>
            
            <!-- Variants Color Preview -->
            <div class="card-swatches">
              ${(p.variants || []).map(v => `
                <span class="swatch-dot" style="background-color: ${v.hex};" title="${v.name}"></span>
              `).join('')}
            </div>

            <div class="card-footer">
              <div class="card-price">${formatPKR(p.price)}</div>
              <button class="card-add-btn" data-add-sku="${p.sku}">
                <span>+ Bag</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach card event listeners
    grid.querySelectorAll('[data-view-sku]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const sku = e.currentTarget.dataset.viewSku;
        this.onProductClick(sku);
      });
    });

    grid.querySelectorAll('[data-wishlist-sku]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sku = e.currentTarget.dataset.wishlistSku;
        this.onToggleWishlist(sku);
      });
    });

    grid.querySelectorAll('[data-add-sku]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sku = e.currentTarget.dataset.addSku;
        this.onAddToCart(sku);
      });
    });
  }
}
