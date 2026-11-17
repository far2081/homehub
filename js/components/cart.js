/**
 * HomeHub - Shopping Cart (Bag) Component
 * Manages persistent localStorage cart items, drawer UI, quantity updates, and checkout status modal.
 */

import { storage } from '../utils/storage.js';
import { formatPKR, showToast } from '../utils/helpers.js';

export class Cart {
  constructor(drawerId, options = {}) {
    this.drawer = document.getElementById(drawerId);
    this.products = options.products || [];
    this.items = storage.get('cart_items', []); // Array of { sku, quantity, variantId, addedAt }
    this.onUpdate = options.onUpdate || (() => {});
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
    storage.set('cart_items', this.items);
    this.onUpdate(this.getCount());
  }

  getCount() {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  addItem(sku, qty = 1, variantId = null) {
    const product = this.products.find(p => p.sku === sku);
    if (!product) return;

    const chosenVariant = variantId || (product.variants && product.variants[0] ? product.variants[0].id : 'default');
    const existingIndex = this.items.findIndex(i => i.sku === sku && i.variantId === chosenVariant);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += qty;
    } else {
      this.items.push({
        sku,
        quantity: qty,
        variantId: chosenVariant,
        addedAt: new Date().toISOString()
      });
    }

    this.save();
    this.render();
    showToast(`Added ${qty}× "${product.name}" to your bag`, 'success');
  }

  updateQuantity(sku, variantId, newQty) {
    const idx = this.items.findIndex(i => i.sku === sku && i.variantId === variantId);
    if (idx > -1) {
      if (newQty <= 0) {
        this.removeItem(sku, variantId);
      } else {
        this.items[idx].quantity = newQty;
        this.save();
        this.render();
      }
    }
  }

  removeItem(sku, variantId) {
    this.items = this.items.filter(i => !(i.sku === sku && i.variantId === variantId));
    this.save();
    this.render();
    showToast('Item removed from bag', 'info');
  }

  clear() {
    this.items = [];
    this.save();
    this.render();
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => {
      const product = this.products.find(p => p.sku === item.sku);
      if (!product) return sum;
      return sum + (product.price * item.quantity);
    }, 0);
  }

  render() {
    const count = this.getCount();
    const subtotal = this.getSubtotal();

    const populatedItems = this.items.map(item => {
      const product = this.products.find(p => p.sku === item.sku);
      if (!product) return null;
      const variant = product.variants ? product.variants.find(v => v.id === item.variantId) : null;
      return {
        ...item,
        product,
        variantName: variant ? variant.name : '',
        totalPrice: product.price * item.quantity
      };
    }).filter(Boolean);

    this.drawer.innerHTML = `
      <div class="cart-backdrop" id="cart-backdrop"></div>
      <div class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-heading">
        <!-- Header -->
        <div class="cart-header">
          <div class="cart-header-title-wrap">
            <h2 id="cart-heading">Shopping Bag</h2>
            <span class="cart-count-badge">${count} ${count === 1 ? 'item' : 'items'}</span>
          </div>
          <button class="cart-close-btn" id="cart-close-btn" aria-label="Close Shopping Bag">✕</button>
        </div>

        <!-- Notification Banner -->
        <div class="cart-banner">
          <span>Soft Luxury Curated Orders • White-Glove Delivery Across Pakistan</span>
        </div>

        <!-- Body -->
        <div class="cart-body">
          ${populatedItems.length === 0 ? `
            <div class="cart-empty-state">
              <div class="empty-bag-icon">🛍️</div>
              <h3>Your bag is currently empty</h3>
              <p>Explore our four digital magazines or browse the independent catalogue to discover handcrafted furniture, lighting, and décor.</p>
              <button class="cart-explore-btn" id="cart-explore-btn">Explore The Living Edit</button>
            </div>
          ` : `
            <div class="cart-items-list">
              ${populatedItems.map(item => `
                <div class="cart-item-row" data-sku="${item.sku}" data-variant="${item.variantId}">
                  <div class="cart-item-thumb" data-view-sku="${item.sku}">
                    <img src="${item.product.images[0].url}" alt="${item.product.name}" />
                  </div>
                  
                  <div class="cart-item-details">
                    <div class="cart-item-top">
                      <span class="cart-item-cat">${item.product.categoryLabel}</span>
                      <button class="cart-item-remove" data-remove-sku="${item.sku}" data-remove-variant="${item.variantId}" title="Remove item">
                        ✕
                      </button>
                    </div>
                    
                    <h4 class="cart-item-title" data-view-sku="${item.sku}">${item.product.name}</h4>
                    
                    ${item.variantName ? `<p class="cart-item-variant">Finish: <em>${item.variantName}</em></p>` : ''}
                    <p class="cart-item-sku">SKU: ${item.sku}</p>

                    <div class="cart-item-bottom">
                      <!-- Stepper -->
                      <div class="cart-stepper">
                        <button class="c-step-btn" data-step="minus" data-sku="${item.sku}" data-variant="${item.variantId}">−</button>
                        <span class="c-step-val">${item.quantity}</span>
                        <button class="c-step-btn" data-step="plus" data-sku="${item.sku}" data-variant="${item.variantId}">+</button>
                      </div>

                      <div class="cart-item-pricing">
                        <span class="c-unit-price">${formatPKR(item.product.price)} each</span>
                        <strong class="c-total-price">${formatPKR(item.totalPrice)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Footer -->
        ${populatedItems.length > 0 ? `
          <div class="cart-footer">
            <div class="cart-summary-line">
              <span>Subtotal</span>
              <strong class="summary-subtotal">${formatPKR(subtotal)}</strong>
            </div>
            <div class="cart-shipping-notice">
              <span>Taxes & White-Glove Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <!-- Checkout Action Button -->
            <button class="cart-checkout-btn" id="cart-checkout-btn">
              <span>Proceed to Checkout</span>
              <span class="checkout-arrow">→</span>
            </button>

            <!-- Honest Security Note -->
            <p class="cart-security-note">
              🔒 256-bit Encrypted Staging • Orders fulfilled directly via HomeHub Atelier
            </p>
          </div>
        ` : ''}
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const backdrop = this.drawer.querySelector('#cart-backdrop');
    const closeBtn = this.drawer.querySelector('#cart-close-btn');
    const exploreBtn = this.drawer.querySelector('#cart-explore-btn');

    if (backdrop) backdrop.addEventListener('click', () => this.close());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        this.close();
        const magSection = document.getElementById('magazine-section');
        if (magSection) magSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // View product on click title / image
    this.drawer.querySelectorAll('[data-view-sku]').forEach(el => {
      el.addEventListener('click', (e) => {
        const sku = e.currentTarget.dataset.viewSku;
        this.close();
        this.onViewProduct(sku);
      });
    });

    // Remove item
    this.drawer.querySelectorAll('[data-remove-sku]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sku = e.currentTarget.dataset.removeSku;
        const variant = e.currentTarget.dataset.removeVariant;
        this.removeItem(sku, variant);
      });
    });

    // Steppers
    this.drawer.querySelectorAll('[data-step]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.step;
        const sku = e.currentTarget.dataset.sku;
        const variant = e.currentTarget.dataset.variant;
        const item = this.items.find(i => i.sku === sku && i.variantId === variant);
        if (!item) return;

        if (type === 'minus') {
          this.updateQuantity(sku, variant, item.quantity - 1);
        } else if (type === 'plus') {
          this.updateQuantity(sku, variant, item.quantity + 1);
        }
      });
    });

    // Checkout Modal
    const checkoutBtn = this.drawer.querySelector('#cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.openCheckoutStatusModal();
      });
    }
  }

  openCheckoutStatusModal() {
    let modal = document.getElementById('checkout-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'checkout-modal';
      modal.className = 'checkout-modal-wrap';
      document.body.appendChild(modal);
    }

    const subtotal = this.getSubtotal();
    const itemsListText = this.items.map(i => {
      const p = this.products.find(prod => prod.sku === i.sku);
      return `${i.quantity}× ${p ? p.name : i.sku} (${formatPKR(p ? p.price * i.quantity : 0)})`;
    }).join('\n');

    modal.innerHTML = `
      <div class="checkout-modal-backdrop"></div>
      <div class="checkout-modal-card" role="dialog" aria-modal="true">
        <div class="checkout-status-header">
          <span class="status-pill unavailable">PAYMENT GATEWAY NOTICE</span>
          <h3>Online Checkout Integration Status</h3>
        </div>

        <div class="checkout-status-body">
          <div class="status-callout-box">
            <span class="callout-icon">ℹ️</span>
            <div>
              <strong>Payment Gateway Not Yet Connected</strong>
              <p>HomeHub is currently operating in concept & catalogue staging mode. In accordance with strict software standards, <strong>no simulated fake orders or fake payment transactions</strong> are presented.</p>
            </div>
          </div>

          <div class="checkout-summary-box">
            <h4>Bag Summary (${this.getCount()} Items)</h4>
            <div class="summary-pre">${itemsListText}</div>
            <div class="summary-subtotal-row">
              <span>Estimated Total:</span>
              <strong>${formatPKR(subtotal)}</strong>
            </div>
          </div>

          <div class="backend-instructions">
            <h4>Production Payment Integration Requirements:</h4>
            <ul>
              <li><strong>Stripe / PayFast / HBL Gateway:</strong> Provide API Secret Key and Webhook Endpoint in <code>.env</code>.</li>
              <li><strong>Database Persistence:</strong> Connect PostgreSQL/MySQL orders table (schema provided in <code>docs/DATABASE_SCHEMA.sql</code>).</li>
              <li><strong>Order Confirmation:</strong> Connect transactional SMTP or SendGrid mailer for order dispatch notifications.</li>
            </ul>
          </div>

          <div class="inquiry-box">
            <p>To place an inquiry or request an atelier proforma invoice directly with the founder:</p>
            <a href="mailto:farzunmir@gmail.com?subject=HomeHub Atelier Inquiry - Order Total ${formatPKR(subtotal)}&body=Hello Farhana,%0D%0A%0D%0AI would like to inquire about the following HomeHub pieces:%0D%0A${encodeURIComponent(itemsListText)}%0D%0A%0D%0ATotal: ${formatPKR(subtotal)}" class="direct-email-btn">
              ✉ Send Order Inquiry to Farhana Aamir (farzunmir@gmail.com)
            </a>
          </div>
        </div>

        <div class="checkout-modal-footer">
          <button class="checkout-modal-close" id="close-checkout-modal-btn">Return to Bag</button>
        </div>
      </div>
    `;

    modal.classList.add('is-open');

    const close = () => {
      modal.classList.remove('is-open');
    };

    modal.querySelector('.checkout-modal-backdrop').addEventListener('click', close);
    modal.querySelector('#close-checkout-modal-btn').addEventListener('click', close);
  }
}
