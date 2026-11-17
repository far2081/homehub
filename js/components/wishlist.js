/**
 * HomeHub - Wishlist Drawer Component
 * Persistent wishlist using localStorage with quick move-to-cart functionality.
 */

import { storage } from '../utils/storage.js';
import { formatPKR, showToast } from '../utils/helpers.js';

export class Wishlist {
  constructor(drawerId, options = {}) {
    this.drawer = document.getElementById(drawerId);
    this.products = options.products || [];
    this.skus = storage.get('wishlist_skus', []);
    this.onUpdate = options.onUpdate || (() => {});
    this.onAddToCart = options.onAddToCart || (() => {});
    this.onViewProduct = options.onViewProduct || (() => {});

    this.init();
  }

  init() {
    this.render();
  }

  setProducts(products) {
    this.products = products;
    this.render();
  }

  isOpen() {
    return this.drawer.classList.contains('is-open');
  }

  open() {
    this.render();
    this.drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  save() {
    storage.set('wishlist_skus', this.skus);
    this.onUpdate(this.skus.length);
  }

  getCount() {
    return this.skus.length;
  }

  isWishlisted(sku) {
    return this.skus.includes(sku);
  }

  toggle(sku) {
    const product = this.products.find(p => p.sku === sku);
    const index = this.skus.indexOf(sku);

    if (index > -1) {
      this.skus.splice(index, 1);
      showToast(`Removed from your Wishlist`, 'info');
    } else {
      this.skus.push(sku);
      showToast(`Saved "${product ? product.name : sku}" to Wishlist`, 'success');
    }

    this.save();
    this.render();
    return this.isWishlisted(sku);
  }

  remove(sku) {
    this.skus = this.skus.filter(s => s !== sku);
    this.save();
    this.render();
  }

  render() {
    const count = this.getCount();
    const items = this.skus.map(sku => this.products.find(p => p.sku === sku)).filter(Boolean);

    this.drawer.innerHTML = `
      <div class="wishlist-backdrop" id="wishlist-backdrop"></div>
      <div class="wishlist-panel" role="dialog" aria-modal="true" aria-labelledby="wishlist-heading">
        
        <!-- Header -->
        <div class="wishlist-header">
          <div class="wishlist-title-wrap">
            <h2 id="wishlist-heading">Curated Wishlist</h2>
            <span class="wishlist-count-badge">${count} ${count === 1 ? 'piece' : 'pieces'}</span>
          </div>
          <button class="wishlist-close-btn" id="wishlist-close-btn" aria-label="Close Wishlist">✕</button>
        </div>

        <div class="wishlist-body">
          ${items.length === 0 ? `
            <div class="wishlist-empty-state">
              <div class="empty-heart-icon">♡</div>
              <h3>Your wishlist is empty</h3>
              <p>Save pieces you love while reading through our four digital magazine books or browsing the catalogue.</p>
              <button class="wishlist-explore-btn" id="wishlist-explore-btn">Discover Pieces</button>
            </div>
          ` : `
            <div class="wishlist-items-list">
              ${items.map(p => `
                <div class="wishlist-item-row" data-sku="${p.sku}">
                  <div class="wishlist-item-thumb" data-view-sku="${p.sku}">
                    <img src="${p.images[0].url}" alt="${p.name}" />
                  </div>

                  <div class="wishlist-item-details">
                    <div class="wishlist-item-top">
                      <span class="wishlist-cat">${p.categoryLabel}</span>
                      <button class="wishlist-item-remove" data-remove-sku="${p.sku}" title="Remove piece">
                        ✕
                      </button>
                    </div>

                    <h4 class="wishlist-item-title" data-view-sku="${p.sku}">${p.name}</h4>
                    <p class="wishlist-item-sku">SKU: ${p.sku}</p>
                    <div class="wishlist-price">${formatPKR(p.price)}</div>

                    <div class="wishlist-actions">
                      <button class="wishlist-move-btn" data-move-sku="${p.sku}">
                        Move to Bag
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const backdrop = this.drawer.querySelector('#wishlist-backdrop');
    const closeBtn = this.drawer.querySelector('#wishlist-close-btn');
    const exploreBtn = this.drawer.querySelector('#wishlist-explore-btn');

    if (backdrop) backdrop.addEventListener('click', () => this.close());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        this.close();
        const catSection = document.getElementById('catalogue-section');
        if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // View product
    this.drawer.querySelectorAll('[data-view-sku]').forEach(el => {
      el.addEventListener('click', (e) => {
        const sku = e.currentTarget.dataset.viewSku;
        this.close();
        this.onViewProduct(sku);
      });
    });

    // Remove
    this.drawer.querySelectorAll('[data-remove-sku]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sku = e.currentTarget.dataset.removeSku;
        this.remove(sku);
      });
    });

    // Move to bag
    this.drawer.querySelectorAll('[data-move-sku]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sku = e.currentTarget.dataset.moveSku;
        this.onAddToCart(sku, 1);
        this.remove(sku);
      });
    });
  }
}
