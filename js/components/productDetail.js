/**
 * HomeHub - Luxury Product Detail Page / Modal Component
 * Renders large image gallery (4+ thumbnails), full specs, swatches, quantity, and related pieces.
 */

import { formatPKR } from '../utils/helpers.js';

export class ProductDetail {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.products = options.products || [];
    this.currentProduct = null;
    this.activeImageIndex = 0;
    this.selectedVariantId = null;
    this.quantity = 1;

    this.onAddToCart = options.onAddToCart || (() => {});
    this.onToggleWishlist = options.onToggleWishlist || (() => {});
    this.isWishlistedFn = options.isWishlistedFn || (() => false);
    this.onProductNavigate = options.onProductNavigate || (() => {});

    this.init();
  }

  init() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.container.classList.contains('is-open');
  }

  open(sku) {
    const product = this.products.find(p => p.sku === sku);
    if (!product) return;

    this.currentProduct = product;
    this.activeImageIndex = 0;
    this.selectedVariantId = product.variants && product.variants[0] ? product.variants[0].id : null;
    this.quantity = 1;

    this.render();
    this.container.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // lock scroll
  }

  close() {
    this.container.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  render() {
    const p = this.currentProduct;
    if (!p) return;

    const isWish = this.isWishlistedFn(p.sku);
    const activeImg = p.images[this.activeImageIndex] || p.images[0];
    const related = (p.relatedSkus || []).map(sku => this.products.find(item => item.sku === sku)).filter(Boolean);

    this.container.innerHTML = `
      <div class="pdp-backdrop" id="pdp-backdrop"></div>
      <div class="pdp-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="pdp-title">
        
        <!-- Close Button -->
        <button class="pdp-close-btn" id="pdp-close-btn" aria-label="Close Product View">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="pdp-modal-body">
          <!-- Concept Notice Banner -->
          <div class="pdp-concept-strip">
            <span>HomeHub Atelier Concept • Initial Product Specification • PKR Pricing</span>
          </div>

          <div class="pdp-grid">
            <!-- Left: Gallery -->
            <div class="pdp-gallery">
              <div class="pdp-main-image-wrap">
                <img 
                  src="${activeImg.url}" 
                  alt="${activeImg.caption || p.name}" 
                  class="pdp-main-image" 
                  id="pdp-main-img" 
                />
                <span class="pdp-image-caption" id="pdp-img-caption">
                  ${activeImg.caption || 'Product Photography'}
                </span>
                <span class="pdp-image-counter">
                  ${this.activeImageIndex + 1} / ${p.images.length}
                </span>
              </div>

              <!-- Thumbnails row (4 or more) -->
              <div class="pdp-thumbnails" role="tablist" aria-label="Product Images">
                ${p.images.map((img, idx) => `
                  <button 
                    class="pdp-thumb-btn ${idx === this.activeImageIndex ? 'active' : ''}" 
                    data-thumb-idx="${idx}"
                    title="${img.caption}"
                    aria-label="Image ${idx + 1}"
                  >
                    <img src="${img.url}" alt="${img.caption}" />
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Right: Details & Purchase -->
            <div class="pdp-info">
              <div class="pdp-header">
                <div class="pdp-meta-top">
                  <span class="pdp-category">${p.categoryLabel}</span>
                  <span class="pdp-sku">${p.sku}</span>
                </div>
                <h1 class="pdp-title" id="pdp-title">${p.name}</h1>
                <div class="pdp-price">${formatPKR(p.price)}</div>
              </div>

              <div class="pdp-divider"></div>

              <!-- Description -->
              <div class="pdp-desc-section">
                <p class="pdp-short-desc">${p.shortDesc}</p>
                <p class="pdp-full-desc">${p.description}</p>
              </div>

              <!-- Color / Finish Selector -->
              ${p.variants && p.variants.length > 0 ? `
                <div class="pdp-variants-section">
                  <label class="pdp-section-label">
                    Finishing / Variant: 
                    <strong id="pdp-active-variant-label">
                      ${(p.variants.find(v => v.id === this.selectedVariantId) || p.variants[0]).name}
                    </strong>
                  </label>
                  <div class="pdp-swatches">
                    ${p.variants.map(v => `
                      <button 
                        class="pdp-swatch-btn ${v.id === this.selectedVariantId ? 'active' : ''}" 
                        data-variant-id="${v.id}"
                        data-variant-name="${v.name}"
                        title="${v.name}"
                      >
                        <span class="pdp-swatch-circle" style="background-color: ${v.hex};"></span>
                        <span class="pdp-swatch-name">${v.name}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Specifications Box -->
              <div class="pdp-specs-box">
                <div class="spec-row">
                  <span class="spec-label">Material</span>
                  <span class="spec-value">${p.material}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Dimensions</span>
                  <span class="spec-value">${p.dimensions}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Weight</span>
                  <span class="spec-value">${p.weight || 'N/A'}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Availability</span>
                  <span class="spec-value stock-highlight">
                    ● In Stock (${p.stock} units allocated)
                  </span>
                </div>
              </div>

              <!-- Purchase Action Controls -->
              <div class="pdp-actions-row">
                <!-- Quantity Counter -->
                <div class="pdp-qty-stepper">
                  <button class="qty-btn" id="pdp-qty-minus" aria-label="Decrease quantity">−</button>
                  <span class="qty-val" id="pdp-qty-val">${this.quantity}</span>
                  <button class="qty-btn" id="pdp-qty-plus" aria-label="Increase quantity">+</button>
                </div>

                <!-- Add to Bag -->
                <button class="pdp-add-bag-btn" id="pdp-add-bag-btn">
                  <span>Add to Bag</span>
                  <span class="btn-price-summary">• ${formatPKR(p.price * this.quantity)}</span>
                </button>

                <!-- Wishlist Toggle -->
                <button class="pdp-wish-btn ${isWish ? 'is-active' : ''}" id="pdp-wish-btn" title="Save to Wishlist">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="${isWish ? '#C87D65' : 'none'}" stroke="currentColor" stroke-width="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              <!-- Brand Guarantees Accordion -->
              <div class="pdp-guarantees">
                <div class="guarantee-item">
                  <span class="g-icon">🚚</span>
                  <div>
                    <strong>White-Glove Delivery Across Pakistan</strong>
                    <p>Complimentary assembly & room-of-choice placement in Karachi, Lahore, and Islamabad.</p>
                  </div>
                </div>
                <div class="guarantee-item">
                  <span class="g-icon">🛡️</span>
                  <div>
                    <strong>10-Year Structural Frame Warranty</strong>
                    <p>FSC-certified kiln-dried hardwoods and architectural grade joinery.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Products Section -->
          ${related.length > 0 ? `
            <div class="pdp-related-section">
              <div class="related-header">
                <h3>Complementary Pieces</h3>
                <p>Curated to harmonize with the ${p.name}</p>
              </div>
              <div class="related-grid">
                ${related.map(rel => `
                  <div class="related-card" data-related-sku="${rel.sku}">
                    <div class="related-img-wrap">
                      <img src="${rel.images[0].url}" alt="${rel.name}" loading="lazy" />
                    </div>
                    <div class="related-meta">
                      <span class="rel-cat">${rel.categoryLabel}</span>
                      <h4 class="rel-title">${rel.name}</h4>
                      <span class="rel-price">${formatPKR(rel.price)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Backdrop and Close
    const backdrop = this.container.querySelector('#pdp-backdrop');
    const closeBtn = this.container.querySelector('#pdp-close-btn');

    if (backdrop) backdrop.addEventListener('click', () => this.close());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Thumbnails
    const thumbs = this.container.querySelectorAll('[data-thumb-idx]');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.thumbIdx, 10);
        this.setActiveImage(idx);
      });
    });

    // Variants
    const swatches = this.container.querySelectorAll('[data-variant-id]');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.variantId;
        const name = e.currentTarget.dataset.variantName;
        this.selectedVariantId = id;

        swatches.forEach(s => s.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const label = this.container.querySelector('#pdp-active-variant-label');
        if (label) label.textContent = name;
      });
    });

    // Quantity stepper
    const minusBtn = this.container.querySelector('#pdp-qty-minus');
    const plusBtn = this.container.querySelector('#pdp-qty-plus');
    const qtyVal = this.container.querySelector('#pdp-qty-val');
    const priceSummary = this.container.querySelector('.btn-price-summary');

    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          if (qtyVal) qtyVal.textContent = this.quantity;
          if (priceSummary && this.currentProduct) {
            priceSummary.textContent = `• ${formatPKR(this.currentProduct.price * this.quantity)}`;
          }
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        if (this.quantity < (this.currentProduct.stock || 10)) {
          this.quantity++;
          if (qtyVal) qtyVal.textContent = this.quantity;
          if (priceSummary && this.currentProduct) {
            priceSummary.textContent = `• ${formatPKR(this.currentProduct.price * this.quantity)}`;
          }
        }
      });
    }

    // Add to Bag Button
    const addBagBtn = this.container.querySelector('#pdp-add-bag-btn');
    if (addBagBtn) {
      addBagBtn.addEventListener('click', () => {
        this.onAddToCart(this.currentProduct.sku, this.quantity, this.selectedVariantId);
        // Visual feedback
        addBagBtn.classList.add('added');
        addBagBtn.innerHTML = `<span>✓ Added to Bag</span>`;
        setTimeout(() => {
          if (this.currentProduct) {
            addBagBtn.classList.remove('added');
            addBagBtn.innerHTML = `<span>Add to Bag</span><span class="btn-price-summary">• ${formatPKR(this.currentProduct.price * this.quantity)}</span>`;
          }
        }, 1500);
      });
    }

    // Wishlist Toggle
    const wishBtn = this.container.querySelector('#pdp-wish-btn');
    if (wishBtn) {
      wishBtn.addEventListener('click', () => {
        this.onToggleWishlist(this.currentProduct.sku);
        const isWish = this.isWishlistedFn(this.currentProduct.sku);
        wishBtn.classList.toggle('is-active', isWish);
        const iconSvg = wishBtn.querySelector('svg');
        if (iconSvg) iconSvg.setAttribute('fill', isWish ? '#C87D65' : 'none');
      });
    }

    // Related cards
    const relatedCards = this.container.querySelectorAll('[data-related-sku]');
    relatedCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const sku = e.currentTarget.dataset.relatedSku;
        this.open(sku);
        if (typeof this.onProductNavigate === 'function') {
          this.onProductNavigate(sku);
        }
      });
    });
  }

  setActiveImage(idx) {
    if (!this.currentProduct || !this.currentProduct.images[idx]) return;
    this.activeImageIndex = idx;
    const imgData = this.currentProduct.images[idx];

    const mainImg = this.container.querySelector('#pdp-main-img');
    const caption = this.container.querySelector('#pdp-img-caption');
    const counter = this.container.querySelector('.pdp-image-counter');

    if (mainImg) {
      mainImg.style.opacity = '0.4';
      mainImg.src = imgData.url;
      mainImg.onload = () => {
        mainImg.style.opacity = '1';
      };
    }
    if (caption) caption.textContent = imgData.caption || '';
    if (counter) counter.textContent = `${idx + 1} / ${this.currentProduct.images.length}`;

    // Update active thumb outline
    const thumbs = this.container.querySelectorAll('[data-thumb-idx]');
    thumbs.forEach(t => {
      t.classList.toggle('active', parseInt(t.dataset.thumbIdx, 10) === idx);
    });
  }
}
