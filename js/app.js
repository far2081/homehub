/**
 * HomeHub - Application Coordinator
 * Brand: HomeHub (SHOP • STYLE • SMART)
 * Visual Direction: Soft Luxury Modern
 */

import { INITIAL_PRODUCTS, CATEGORIES } from './data/products.js';
import { storage } from './utils/storage.js';
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

  openBook(bookId) {
    if (this.flipbook) {
      this.flipbook.loadBook(bookId, 0);
      this.updateActiveNavBook(bookId);

      const section = document.getElementById('magazine-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.history.pushState(null, '', `#book-${bookId}`);
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

    // Header Quick Search Button
    const searchBtn = document.getElementById('header-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const catSection = document.getElementById('catalogue-section');
        const searchInput = document.getElementById('catalogue-search-input');
        if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { if (searchInput) searchInput.focus(); }, 350);
      });
    }

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

  handleInitialRouting() {
    const hash = window.location.hash;
    if (hash.startsWith('#book-')) {
      const bookId = hash.replace('#book-', '');
      this.openBook(bookId);
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
