/**
 * HomeHub - Application Coordinator
 * Brand: HomeHub (SHOP • STYLE • SMART)
 * Visual Direction: Soft Luxury Modern
 */

import { INITIAL_PRODUCTS, CATEGORIES } from './data/products.js';
import { storage } from './utils/storage.js';
import { formatPKR } from './utils/helpers.js';
import { Flipbook } from './components/flipbook.js';
import { Catalogue } from './components/catalogue.js';
import { ProductDetail } from './components/productDetail.js';
import { Cart } from './components/cart.js';
import { Wishlist } from './components/wishlist.js';
import { VideoGallery } from './components/videoGallery.js';
import { AdminPortal } from './components/admin.js';

class HomeHubApp {
  constructor() {
    // Load products from storage if modified via Admin, else initial concept catalogue
    this.products = storage.get('custom_products', INITIAL_PRODUCTS);
    this.categories = CATEGORIES;

    this.flipbook = null;
    this.catalogue = null;
    this.productDetail = null;
    this.cart = null;
    this.wishlist = null;
    this.videoGallery = null;
    this.adminPortal = null;

    this.init();
  }

  init() {
    this.initCart();
    this.initWishlist();
    this.initProductDetail();
    this.initFlipbook();
    this.initCatalogue();
    this.initVideoGallery();
    this.initAdminPortal();
    this.bindGlobalNavigation();
    this.handleInitialRouting();
    this.dismissPreloader();
  }

  dismissPreloader() {
    if (typeof document === 'undefined') return;
    const preloader = document.getElementById('homehub-preloader');
    if (preloader) {
      if (typeof window !== 'undefined' && window.location && window.location.search && window.location.search.includes('nopreloader')) {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        return;
      }
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 500);
      }, 350);
    }
  }

  initCart() {
    this.cart = new Cart('cart-drawer-container', {
      products: this.products,
      onUpdate: (count) => this.updateHeaderBadges(),
      onViewProduct: (sku) => this.openProduct(sku)
    });
  }

  initWishlist() {
    this.wishlist = new Wishlist('wishlist-drawer-container', {
      products: this.products,
      onUpdate: (count) => {
        this.updateHeaderBadges();
        if (this.catalogue) this.catalogue.renderGrid();
      },
      onAddToCart: (sku, qty) => this.cart.addItem(sku, qty),
      onViewProduct: (sku) => this.openProduct(sku)
    });
  }

  initProductDetail() {
    this.productDetail = new ProductDetail('pdp-modal-container', {
      products: this.products,
      onAddToCart: (sku, qty, variantId) => this.cart.addItem(sku, qty, variantId),
      onToggleWishlist: (sku) => this.wishlist.toggle(sku),
      isWishlistedFn: (sku) => this.wishlist.isWishlisted(sku),
      onProductNavigate: (sku) => {
        // Updated URL hash
        window.history.pushState(null, '', `#product-${sku}`);
      }
    });
  }

  initFlipbook() {
    this.flipbook = new Flipbook('flipbook-mount-point', {
      initialBook: 'living-edit',
      onProductSelect: (sku) => this.openProduct(sku),
      onAddToCart: (sku, qty) => this.cart.addItem(sku, qty || 1),
      onBookChange: (bookId) => {
        this.updateActiveNavBook(bookId);
      }
    });
  }

  initCatalogue() {
    this.catalogue = new Catalogue('catalogue-mount-point', {
      products: this.products,
      categories: this.categories,
      onProductClick: (sku) => this.openProduct(sku),
      onAddToCart: (sku) => this.cart.addItem(sku, 1),
      onToggleWishlist: (sku) => this.wishlist.toggle(sku),
      isWishlistedFn: (sku) => this.wishlist.isWishlisted(sku)
    });
  }

  initVideoGallery() {
    this.videoGallery = new VideoGallery('video-mount-point', {
      products: this.products,
      onProductClick: (sku) => this.openProduct(sku)
    });
  }

  initAdminPortal() {
    this.adminPortal = new AdminPortal('admin-portal-container', {
      products: this.products,
      categories: this.categories,
      onProductsUpdated: (updatedProducts) => {
        this.products = updatedProducts;
        if (this.catalogue) this.catalogue.setProducts(updatedProducts);
        if (this.productDetail) this.productDetail.products = updatedProducts;
        if (this.cart) this.cart.setProducts(updatedProducts);
        if (this.wishlist) this.wishlist.setProducts(updatedProducts);
      }
    });
  }

  updateHeaderBadges() {
    const cartBadge = document.getElementById('header-cart-badge');
    const wishBadge = document.getElementById('header-wishlist-badge');

    if (cartBadge) {
      const cCount = this.cart.getCount();
      cartBadge.textContent = cCount;
      cartBadge.style.display = cCount > 0 ? 'flex' : 'none';
    }

    if (wishBadge) {
      const wCount = this.wishlist.getCount();
      wishBadge.textContent = wCount;
      wishBadge.style.display = wCount > 0 ? 'flex' : 'none';
    }
  }

  openProduct(sku) {
    if (this.productDetail) {
      this.productDetail.open(sku);
      window.history.pushState(null, '', `#product-${sku}`);
    }
  }

  openBook(bookId, targetPage = 0) {
    if (this.flipbook) {
      this.flipbook.loadBook(bookId, targetPage);
      this.updateActiveNavBook(bookId);

      const stage = document.getElementById('flipbook-mount-point') || document.getElementById('magazine-section');
      if (stage) {
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.history.pushState(null, '', targetPage > 0 ? `#book-${bookId}-page-${targetPage + 1}` : `#book-${bookId}`);
    }
  }

  updateActiveNavBook(bookId) {
    document.querySelectorAll('.nav-book-link').forEach(link => {
      const target = link.dataset.targetBook;
      link.classList.toggle('active', target === bookId);
    });
  }

  bindGlobalNavigation() {
    // 4 Book Header links
    document.querySelectorAll('.nav-book-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const bookId = e.currentTarget.dataset.targetBook;
        this.openBook(bookId);
      });
    });

    // Mobile Drawer Book Links
    document.querySelectorAll('.mobile-book-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const bookId = e.currentTarget.dataset.targetBook;
        this.closeMobileDrawer();
        this.openBook(bookId);
      });
    });

    // Mobile Hamburger
    const hamburger = document.getElementById('mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
    const mobileClose = document.getElementById('mobile-nav-close');

    if (hamburger && mobileDrawer) {
      hamburger.addEventListener('click', () => {
        mobileDrawer.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }

    const closeDrawer = () => {
      if (mobileDrawer) mobileDrawer.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeDrawer);
    if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
    this.closeMobileDrawer = closeDrawer;

    // Header Quick Search Button (Opens dedicated luxury search modal)
    const searchBtn = document.getElementById('header-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.openSearchModal();
      });
    }

    // Footer Information Links (About, Contact, Privacy, Terms)
    const aboutBtn = document.getElementById('footer-about-btn');
    if (aboutBtn) aboutBtn.addEventListener('click', () => this.openInfoModal('about'));

    const contactBtn = document.getElementById('footer-contact-btn');
    if (contactBtn) contactBtn.addEventListener('click', () => this.openInfoModal('contact'));

    const privacyBtn = document.getElementById('footer-privacy-btn');
    if (privacyBtn) privacyBtn.addEventListener('click', () => this.openInfoModal('privacy'));

    const termsBtn = document.getElementById('footer-terms-btn');
    if (termsBtn) termsBtn.addEventListener('click', () => this.openInfoModal('terms'));

    // Header Client Account Button
    const accountBtn = document.getElementById('header-account-btn');
    if (accountBtn) {
      accountBtn.addEventListener('click', () => this.openAccountModal());
    }

    // Cart Button Trigger
    const cartBtn = document.getElementById('header-cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.cart.open());
    }

    // Wishlist Button Trigger
    const wishBtn = document.getElementById('header-wishlist-btn');
    if (wishBtn) {
      wishBtn.addEventListener('click', () => this.wishlist.open());
    }

    // Admin Triggers
    document.querySelectorAll('.admin-open-trigger').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.adminPortal.open();
      });
    });

    // Initial Badge states
    this.updateHeaderBadges();

    // Listen to hash changes (back / forward navigation)
    window.addEventListener('popstate', () => {
      this.handleInitialRouting();
    });
  }

  openAccountModal() {
    const modal = document.getElementById('account-modal-container');
    if (!modal) return;

    modal.innerHTML = `
      <div class="account-backdrop" id="account-backdrop"></div>
      <div class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-dialog-title">
        <div class="account-header">
          <h3 id="account-dialog-title">Client Atelier Profile</h3>
          <button class="cart-close-btn" id="close-account-modal-btn" aria-label="Close">✕</button>
        </div>

        <div class="account-profile-card">
          <div class="account-avatar">FA</div>
          <div class="account-user-meta">
            <strong>Farhana Aamir</strong>
            <span>farzunmir@gmail.com</span>
            <div class="account-tier-badge">Private Atelier Client</div>
          </div>
        </div>

        <div class="account-nav-list">
          <button class="account-nav-item" id="account-view-wishlist-btn">
            <span>❤️ Saved Wishlist Pieces</span>
            <strong>${this.wishlist ? this.wishlist.getCount() : 0} Pieces →</strong>
          </button>
          <button class="account-nav-item" id="account-view-bag-btn">
            <span>🛍️ Active Shopping Bag</span>
            <strong>${this.cart ? this.cart.getCount() : 0} Items →</strong>
          </button>
          <button class="account-nav-item" id="account-view-consult-btn">
            <span>📋 White-Glove Staged Consultation</span>
            <span>Active in Atelier →</span>
          </button>
        </div>

        <div style="border-top: 1px solid var(--color-border); padding-top: 1.2rem; margin-top: 1rem;">
          <p style="font-size: 0.75rem; color: var(--color-muted-earth); margin-bottom: 0.8rem;">
            Atelier staff, design directors and administrators can access the full management console below:
          </p>
          <button class="account-admin-switch-btn admin-open-trigger" id="account-launch-admin-btn">
            🔑 Switch to Staff Admin Console
          </button>
        </div>
      </div>
    `;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const close = () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      modal.innerHTML = '';
    };

    modal.querySelector('#account-backdrop').addEventListener('click', close);
    modal.querySelector('#close-account-modal-btn').addEventListener('click', close);

    const wishBtn = modal.querySelector('#account-view-wishlist-btn');
    if (wishBtn) {
      wishBtn.addEventListener('click', () => {
        close();
        if (this.wishlist) this.wishlist.open();
      });
    }

    const bagBtn = modal.querySelector('#account-view-bag-btn');
    if (bagBtn) {
      bagBtn.addEventListener('click', () => {
        close();
        if (this.cart) this.cart.open();
      });
    }

    const consultBtn = modal.querySelector('#account-view-consult-btn');
    if (consultBtn) {
      consultBtn.addEventListener('click', () => {
        close();
        if (this.cart) this.cart.openCheckoutStatusModal();
      });
    }

    const adminBtn = modal.querySelector('#account-launch-admin-btn');
    if (adminBtn) {
      adminBtn.addEventListener('click', () => {
        close();
        if (this.adminPortal) this.adminPortal.open();
      });
    }
  }

  openSearchModal() {
    const modal = document.getElementById('search-modal-container');
    if (!modal) return;

    modal.innerHTML = `
      <div class="search-backdrop" id="search-backdrop"></div>
      <div class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
        <div class="search-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#7D746A;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="search" 
            class="search-input-field" 
            id="modal-search-input" 
            placeholder="Search architectural pieces, materials (e.g. travertine, bouclé)..." 
            aria-label="Search Collection" 
          />
          <button class="search-close-btn" id="close-search-modal-btn" aria-label="Close search">✕</button>
        </div>
        <div class="search-results-list" id="search-results-container">
          <p style="color:var(--color-muted-earth); font-size:0.85rem; padding:1.2rem 0; margin:0; text-align:center;">
            Type a query to search the HomeHub collection and find corresponding pieces.
          </p>
        </div>
      </div>
    `;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const input = modal.querySelector('#modal-search-input');
    const resultsContainer = modal.querySelector('#search-results-container');
    
    const close = () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      modal.innerHTML = '';
    };

    modal.querySelector('#search-backdrop').addEventListener('click', close);
    modal.querySelector('#close-search-modal-btn').addEventListener('click', close);

    if (input) {
      setTimeout(() => input.focus(), 150);
      input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
          resultsContainer.innerHTML = `
            <p style="color:var(--color-muted-earth); font-size:0.85rem; padding:1.2rem 0; margin:0; text-align:center;">
              Type a query to search the HomeHub collection and find corresponding pieces.
            </p>
          `;
          return;
        }

        const matches = this.products.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.material && p.material.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query))
        );

        if (matches.length === 0) {
          resultsContainer.innerHTML = `
            <p style="color:var(--color-muted-earth); font-size:0.88rem; padding:1.5rem 0; text-align:center;">
              No matching pieces found for "${e.target.value}".
            </p>
          `;
          return;
        }

        resultsContainer.innerHTML = matches.map(p => `
          <div class="search-result-item" data-sku="${p.id}">
            <img src="${p.images ? p.images[0] : ''}" alt="${p.name}" class="search-result-media" />
            <div class="search-result-meta">
              <h4 class="search-result-title">${p.name}</h4>
              <p class="search-result-details">${p.material || p.category} • ${p.dimensions || ''}</p>
            </div>
            <span class="search-result-price">${formatPKR ? formatPKR(p.price) : `₨ ${p.price.toLocaleString()}`}</span>
          </div>
        `).join('');

        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const sku = item.dataset.sku;
            close();
            this.openProduct(sku);
          });
        });
      });
    }
  }

  openInfoModal(type) {
    const modal = document.getElementById('info-modal-container');
    if (!modal) return;

    let title = '';
    let body = '';

    if (type === 'about') {
      title = 'About HomeHub Atelier';
      body = `
        <p><strong>Soft Luxury Modernism</strong></p>
        <p>HomeHub is an independent home and lifestyle publication brand based in Pakistan. We curate four digital volumes exploring fluid contours, geological permanence, natural light, and space intelligence.</p>
        <p>Every piece in our collection is handcrafted by skilled local artisans using solid FSC-certified hardwoods, Italian bouclé wools, honed travertine marble, and precision brass joinery.</p>
        <p>Designed and built with pride by <strong>Farhana Aamir</strong>.</p>
      `;
    } else if (type === 'contact') {
      title = 'Contact & Atelier Care';
      body = `
        <p><strong>Founder & Designer Inquiries</strong><br />
        Farhana Aamir — <a href="mailto:farzunmir@gmail.com" style="color:var(--color-terracotta); text-decoration:underline;">farzunmir@gmail.com</a></p>
        <p><strong>White-Glove Delivery Across Pakistan</strong><br />
        Complimentary delivery and private assembly service across Karachi, Lahore, and Islamabad.</p>
        <p><strong>Bespoke Commissioning</strong><br />
        Custom timber finishes and upholstery swatches are available upon request with a production lead time of 3–4 weeks.</p>
      `;
    } else if (type === 'privacy') {
      title = 'Client Privacy Policy';
      body = `
        <p><strong>Client Confidentiality</strong><br />
        HomeHub respects the privacy of our atelier clients. We do not sell or distribute personal information to third parties.</p>
        <p>All client preferences, shopping bags, and saved wishlist pieces are stored locally on your device using secure client-side storage.</p>
      `;
    } else if (type === 'terms') {
      title = 'Terms & Bespoke Commissioning';
      body = `
        <p><strong>Original Brand Guarantee</strong><br />
        All furniture, lighting, and décor pieces featured in HomeHub digital publications are covered by our 5-year structural warranty.</p>
        <p><strong>Returns & Exchanges</strong><br />
        14-day inspection window upon white-glove delivery. Bespoke commissions are crafted to order.</p>
      `;
    }

    modal.innerHTML = `
      <div class="info-backdrop" id="info-backdrop"></div>
      <div class="info-dialog" role="dialog" aria-modal="true" aria-labelledby="info-dialog-title">
        <div class="info-header">
          <h3 id="info-dialog-title">${title}</h3>
          <button class="cart-close-btn" id="close-info-modal-btn" aria-label="Close">✕</button>
        </div>
        <div class="info-body">
          ${body}
        </div>
      </div>
    `;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const close = () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      modal.innerHTML = '';
    };

    modal.querySelector('#info-backdrop').addEventListener('click', close);
    modal.querySelector('#close-info-modal-btn').addEventListener('click', close);
  }

  handleInitialRouting() {
    const hash = window.location.hash;
    if (hash.startsWith('#book-')) {
      const match = hash.match(/^#book-(living-edit|objects-of-home|light-life|small-spaces)(?:-page-(\d+))?$/);
      if (match) {
        const bookId = match[1];
        const pageNum = match[2] ? Math.max(0, parseInt(match[2], 10) - 1) : 0;
        this.openBook(bookId, pageNum);
      }
    } else if (hash.startsWith('#product-')) {
      const sku = hash.replace('#product-', '');
      this.openProduct(sku);
    } else if (hash === '#admin') {
      this.adminPortal.open();
    }
  }
}

export { HomeHubApp };

// Instantiate on DOMContentLoaded in browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.homeHub = new HomeHubApp();
  });
}
