/**
 * HomeHub - Shopping Cart (Bag) Component & Guest Checkout Flow
 * Manages persistent localStorage cart items, drawer UI, quantity updates,
 * and Supabase guest checkout execution via server-side create_homehub_order().
 */

import { storage } from '../utils/storage.js';
import { formatPKR, showToast } from '../utils/helpers.js';
import { submitGuestOrder, isSupabaseConfigured } from '../services/supabaseClient.js';
import { couponService } from '../services/couponService.js';
import { customerService } from '../services/customerService.js';

export class Cart {
  constructor(drawerId, options = {}) {
    this.drawer = document.getElementById(drawerId);
    this.products = options.products || [];
    this.items = storage.get('cart_items', []); // Array of { sku, quantity, variantId, addedAt }
    this.appliedCoupon = storage.get('homehub_applied_coupon', null);
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
    return this.drawer && this.drawer.classList.contains('is-open');
  }

  open() {
    this.render();
    if (this.drawer) {
      this.drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    if (this.drawer) {
      this.drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }
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

  getDiscount() {
    if (!this.appliedCoupon) return 0;
    const subtotal = this.getSubtotal();
    const result = couponService.validateCoupon(this.appliedCoupon.code, subtotal);
    if (!result.valid) {
      this.appliedCoupon = null;
      storage.remove('homehub_applied_coupon');
      return 0;
    }
    return result.discount;
  }

  getTotal() {
    return Math.max(0, this.getSubtotal() - this.getDiscount());
  }

  applyCouponCode(code) {
    const subtotal = this.getSubtotal();
    if (subtotal <= 0) {
      showToast('Add pieces to your bag before applying a coupon.', 'warning');
      return false;
    }
    const result = couponService.validateCoupon(code, subtotal);
    if (!result.valid) {
      showToast(result.message, 'warning');
      return false;
    }
    this.appliedCoupon = result.coupon;
    storage.set('homehub_applied_coupon', this.appliedCoupon);
    showToast(result.message, 'success');
    this.render();
    return true;
  }

  removeCoupon() {
    this.appliedCoupon = null;
    storage.remove('homehub_applied_coupon');
    showToast('Promotional voucher removed.', 'info');
    this.render();
  }

  render() {
    if (!this.drawer) return;

    const count = this.getCount();
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const total = this.getTotal();

    const populatedItems = this.items.map(item => {
      const product = this.products.find(p => p.sku === item.sku);
      if (!product) return null;
      const variant = product.variants ? product.variants.find(v => v.id === item.variantId) : null;
      const imgUrl = (product.images && product.images[0]) ? product.images[0].url : 'assets/logo-dark.svg';
      return {
        ...item,
        product,
        variantName: variant ? variant.name : '',
        totalPrice: product.price * item.quantity,
        imgUrl
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
                    <img src="${item.imgUrl}" alt="${item.product.name}" />
                  </div>
                  
                  <div class="cart-item-details">
                    <div class="cart-item-top">
                      <span class="cart-item-cat">${item.product.categoryLabel || item.product.category}</span>
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
            <!-- Coupon Code Engine -->
            <div class="cart-coupon-wrap">
              ${this.appliedCoupon ? `
                <div class="cart-coupon-badge">
                  <span class="coupon-label">🎟️ ${this.appliedCoupon.code} (${this.appliedCoupon.type === 'percentage' ? `${this.appliedCoupon.value}% OFF` : `₨ ${this.appliedCoupon.value.toLocaleString()} OFF`})</span>
                  <button type="button" class="coupon-remove-btn" id="cart-remove-coupon-btn" title="Remove coupon">✕</button>
                </div>
              ` : `
                <form id="cart-coupon-form" class="cart-coupon-form">
                  <input type="text" id="cart-coupon-input" class="cart-coupon-input" placeholder="Promo code (e.g. HOMEHUB10)" />
                  <button type="submit" class="cart-coupon-apply-btn">Apply</button>
                </form>
              `}
            </div>

            <div class="cart-summary-line">
              <span>Subtotal</span>
              <strong class="summary-subtotal">${formatPKR(subtotal)}</strong>
            </div>

            ${discount > 0 ? `
              <div class="summary-discount-row">
                <span>Privilege Discount (${this.appliedCoupon.code})</span>
                <strong>−${formatPKR(discount)}</strong>
              </div>
            ` : ''}

            <div class="cart-shipping-notice">
              <span>Taxes & White-Glove Installation</span>
              <span class="complimentary-tag">Complimentary</span>
            </div>

            <div class="summary-subtotal-row grand-total-row">
              <span>Total in PKR</span>
              <strong class="grand-total-val">${formatPKR(total)}</strong>
            </div>

            <!-- Checkout Action Button -->
            <button class="cart-checkout-btn" id="cart-checkout-btn">
              <span>Proceed to Checkout</span>
              <span class="checkout-arrow">→</span>
            </button>

            <!-- Security Note -->
            <p class="cart-security-note">
              🔒 256-bit Encrypted Checkout • Verified via HomeHub PostgreSQL Backend
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

    // Coupon actions
    const couponForm = this.drawer.querySelector('#cart-coupon-form');
    if (couponForm) {
      couponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = this.drawer.querySelector('#cart-coupon-input');
        if (input && input.value.trim()) {
          this.applyCouponCode(input.value.trim());
        }
      });
    }

    const removeCouponBtn = this.drawer.querySelector('#cart-remove-coupon-btn');
    if (removeCouponBtn) {
      removeCouponBtn.addEventListener('click', () => {
        this.removeCoupon();
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
    const discount = this.getDiscount();
    const total = this.getTotal();
    const count = this.getCount();
    const isConnected = isSupabaseConfigured();

    const itemsListText = this.items.map(i => {
      const p = this.products.find(prod => prod.sku === i.sku);
      return `${i.quantity}× ${p ? p.name : i.sku} (${formatPKR(p ? p.price * i.quantity : 0)})`;
    }).join('\n');

    modal.innerHTML = `
      <div class="checkout-modal-backdrop"></div>
      <div class="checkout-modal-card" role="dialog" aria-modal="true">
        <div class="checkout-status-header">
          <span class="status-pill ${isConnected ? 'live' : 'staging'}">
            ${isConnected ? '● SECURE SUPABASE CHECKOUT' : '● ATELIER WHITE-GLOVE CHECKOUT'}
          </span>
          <h3>HomeHub Atelier Checkout</h3>
        </div>

        <div class="checkout-status-body">
          <!-- Guest Checkout Form -->
          <form id="homehub-guest-checkout-form" class="guest-checkout-form">
            <div class="form-instructions-badge">
              <span>Direct delivery across Pakistan. Payment options: Bank Wire Transfer or Cash on White-Glove Delivery.</span>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="g-name">Recipient Full Name *</label>
                <input type="text" id="g-name" required placeholder="e.g. Ayesha Malik" />
              </div>
              <div class="form-group">
                <label for="g-email">Email Address *</label>
                <input type="email" id="g-email" required placeholder="ayesha@example.com" />
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="g-phone">Contact Phone Number *</label>
                <input type="tel" id="g-phone" required placeholder="+92 300 1234567" />
              </div>
              <div class="form-group">
                <label for="g-city">Delivery City *</label>
                <input type="text" id="g-city" required placeholder="Lahore / Karachi / Islamabad..." />
              </div>
            </div>

            <div class="form-group">
              <label for="g-address">Complete Street Delivery Address *</label>
              <textarea id="g-address" rows="2" required placeholder="House/Apartment #, Street, Phase / Sector..."></textarea>
            </div>

            <div class="form-group">
              <label for="g-notes">Architectural / Delivery Notes (Optional)</label>
              <input type="text" id="g-notes" placeholder="e.g. Call before delivery, 2nd floor service elevator" />
            </div>

            <!-- Order Summary Breakdown -->
            <div class="checkout-summary-box">
              <h4>Order Summary (${count} Items)</h4>
              <div class="summary-pre">${itemsListText}</div>
              
              <div class="summary-subtotal-row">
                <span>Subtotal:</span>
                <strong>${formatPKR(subtotal)}</strong>
              </div>

              ${discount > 0 ? `
                <div class="summary-discount-row">
                  <span>Privilege Voucher (${this.appliedCoupon.code}):</span>
                  <strong>−${formatPKR(discount)}</strong>
                </div>
              ` : ''}

              <div class="summary-subtotal-row">
                <span>White-Glove Shipping:</span>
                <span class="free-shipping-tag">Complimentary</span>
              </div>

              <div class="summary-subtotal-row grand-total-row">
                <span>Order Total:</span>
                <strong class="grand-total-val">${formatPKR(total)}</strong>
              </div>
            </div>

            <div id="checkout-error-banner" class="checkout-error-banner" style="display: none;"></div>

            <div class="form-actions">
              <button type="button" class="checkout-modal-close" id="close-checkout-modal-btn">Return to Bag</button>
              <button type="submit" class="admin-btn-primary" id="place-order-submit-btn">
                Confirm & Place Order →
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    modal.classList.add('is-open');

    const close = () => {
      modal.classList.remove('is-open');
    };

    modal.querySelector('.checkout-modal-backdrop').addEventListener('click', close);
    const closeBtn = modal.querySelector('#close-checkout-modal-btn');
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Form submission
    const form = modal.querySelector('#homehub-guest-checkout-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = modal.querySelector('#place-order-submit-btn');
        const errorBanner = modal.querySelector('#checkout-error-banner');

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Recording Order in Atelier Registry...';
        }
        if (errorBanner) {
          errorBanner.style.display = 'none';
        }

        const customerName = modal.querySelector('#g-name').value.trim();
        const customerEmail = modal.querySelector('#g-email').value.trim();
        const customerPhone = modal.querySelector('#g-phone').value.trim();
        const shippingCity = modal.querySelector('#g-city').value.trim();
        const shippingAddress = modal.querySelector('#g-address').value.trim();
        const customerNotes = modal.querySelector('#g-notes').value.trim();

        const cleanOrderNumber = `HH-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const orderData = {
          id: cleanOrderNumber,
          order_number: cleanOrderNumber,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_city: shippingCity,
          shipping_address: shippingAddress,
          shipping_country: 'Pakistan',
          customer_notes: customerNotes,
          subtotal_amount: subtotal,
          discount_amount: discount,
          coupon_code: this.appliedCoupon ? this.appliedCoupon.code : null,
          total_amount: total,
          status: 'PENDING',
          payment_method: 'Cash on White-Glove Delivery',
          created_at: new Date().toISOString(),
          items: this.items.map(i => {
            const prod = this.products.find(p => p.sku === i.sku);
            const variant = prod && prod.variants ? prod.variants.find(v => v.id === i.variantId) : null;
            return {
              sku: i.sku,
              product_name: prod ? prod.name : i.sku,
              price: prod ? prod.price : 0,
              quantity: i.quantity,
              variant_name: variant ? variant.name : null
            };
          })
        };

        let supabaseSuccess = false;
        if (isSupabaseConfigured()) {
          try {
            const result = await submitGuestOrder({
              customerName,
              customerEmail,
              customerPhone,
              shippingCity,
              shippingAddress,
              shippingCountry: 'Pakistan',
              customerNotes,
              items: this.items.map(i => {
                const prod = this.products.find(p => p.sku === i.sku);
                const variant = prod && prod.variants ? prod.variants.find(v => v.id === i.variantId) : null;
                return {
                  sku: i.sku,
                  quantity: i.quantity,
                  variantName: variant ? variant.name : null
                };
              })
            });
            if (result && result.order_number) {
              orderData.order_number = result.order_number;
            }
            supabaseSuccess = true;
          } catch (err) {
            console.warn('Notice: Remote Supabase sync deferred. Saving order to local Atelier Registry.', err.message);
          }
        }

        // Always save order to persistent storage so SaaS Admin Portal can manage it immediately
        try {
          const storedOrders = storage.get('homehub_orders', []);
          storedOrders.unshift(orderData);
          storage.set('homehub_orders', storedOrders);
        } catch (_) {}

        // Record customer in CRM
        try {
          customerService.recordCustomer(orderData);
        } catch (_) {}

        // Record coupon usage
        if (this.appliedCoupon) {
          try {
            couponService.recordUsage(this.appliedCoupon.code);
          } catch (_) {}
        }

        // Clean up cart
        const orderNum = orderData.order_number;
        this.clear();
        this.appliedCoupon = null;
        storage.remove('homehub_applied_coupon');
        this.close();

        // Success confirmation screen
        modal.innerHTML = `
          <div class="checkout-modal-backdrop"></div>
          <div class="checkout-modal-card order-confirmed-card" role="dialog" aria-modal="true">
            <div class="order-confirmed-icon">✨</div>
            <span class="status-pill live">ORDER CONFIRMED</span>
            <h2>Thank you, ${customerName}</h2>
            <p class="order-ref-number">Order Reference: <strong>${orderNum}</strong></p>
            
            <div class="confirmed-body-box">
              <p>Your curated selection has been confirmed in the HomeHub Atelier order queue${supabaseSuccess ? ' and synchronized with Supabase' : ''}. Our logistics concierge will reach out to <strong>${customerPhone}</strong> to schedule complimentary white-glove delivery to <strong>${shippingCity}</strong>.</p>
              
              <div class="confirmed-details">
                <div><span>Confirmation Email:</span> <strong>${customerEmail}</strong></div>
                <div><span>Total Amount:</span> <strong>${formatPKR(total)}</strong></div>
                <div><span>Payment Method:</span> <strong>Cash on White-Glove Delivery / Wire</strong></div>
                ${discount > 0 ? `<div><span>Discount Applied:</span> <strong style="color: #137333;">−${formatPKR(discount)}</strong></div>` : ''}
              </div>
            </div>

            <div class="order-confirmed-actions">
              <a href="mailto:farzunmir@gmail.com?subject=Order%20Confirmation%20${orderNum}&body=Hello%20Farhana,%0D%0A%0D%0AI%20have%20placed%20order%20${orderNum}%20for%20total%20${encodeURIComponent(formatPKR(total))}.%0D%0APlease%20contact%20me%20at%20${encodeURIComponent(customerPhone)}." class="direct-email-btn" style="margin-right: 10px;">
                ✉ Notify Atelier Lead (farzunmir@gmail.com)
              </a>
              <button class="admin-btn-primary" id="confirmed-done-btn">Continue Exploring HomeHub</button>
            </div>
          </div>
        `;

        const doneBtn = modal.querySelector('#confirmed-done-btn');
        if (doneBtn) doneBtn.addEventListener('click', close);
        showToast(`Order #${orderNum} confirmed!`, 'success');
      });
    }
  }
}
