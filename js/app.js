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
