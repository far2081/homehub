/**
 * HomeHub - Application Coordinator
 * Brand: HomeHub (SHOP • STYLE • SMART)
 * Visual Direction: Soft Luxury Modern
 */

import { INITIAL_PRODUCTS, CATEGORIES } from './data/products.js';
import { storage } from './utils/storage.js';
import { formatPKR, setCurrencyFormatter, showToast } from './utils/helpers.js';
import { tenantService } from './services/tenantService.js';
import { Flipbook } from './components/flipbook.js';
import { Catalogue } from './components/catalogue.js';
import { ProductDetail } from './components/productDetail.js';
import { Cart } from './components/cart.js';
import { Wishlist } from './components/wishlist.js';
import { VideoGallery } from './components/videoGallery.js';
import { AdminPortal } from './components/admin.js';
import { BookNavigation, BOOK_NAV_DATA } from './components/bookNavigation.js';
import { CATEGORY_INSPIRATION_DATA } from './data/categoryInspiration.js';
import { fetchStorefrontProducts } from './services/supabaseClient.js';
import { customerService } from './services/customerService.js';
import { openPrintInvoice } from './utils/invoice.js';
import { couponService } from './services/couponService.js';
import { pluginRegistry } from './services/pluginRegistry.js';
import { CURATED_SUBJECTS } from './data/curatedSubjects.js';
import { SOCIAL_CHANNELS } from './data/socialChannels.js';

// Curated Collection and Category Definitions for Full-Page Webpage Views
const COLLECTIONS = {
  // Furniture Book collections
  'living-room': {
    title: 'Living Room Collection',
    deck: 'Architectural silhouettes, low-profile seating, and solid timber centerpieces tailored for serene living.',
    filter: (p) => p.category === 'furniture' || ['HH-FUR-001', 'HH-FUR-002', 'HH-FUR-003', 'HH-LGT-002', 'HH-DEC-002', 'HH-DEC-003'].includes(p.id)
  },
  'bedroom': {
    title: 'Bedroom Collection',
    deck: 'Tactile organic linens, platform joinery, and serene ambient lighting designed for restoration.',
    filter: (p) => p.category === 'furniture' || ['HH-FUR-004', 'HH-SSS-002', 'HH-LGT-003', 'HH-DEC-003', 'HH-DEC-004'].includes(p.id)
  },
  'dining-room': {
    title: 'Dining Room Collection',
    deck: 'Monolithic travertine tables, sculpted oak seating, and intimate pendant illumination.',
    filter: (p) => ['HH-FUR-002', 'HH-DEC-001', 'HH-DEC-004', 'HH-LGT-001'].includes(p.id) || p.category === 'furniture'
  },
  'sofas-seating': {
    title: 'Sofas & Seating',
    deck: 'Sculptural lounge profiles, high-density comfort cores, and Italian bouclé upholstery.',
    filter: (p) => ['HH-FUR-001', 'HH-FUR-003'].includes(p.id) || (p.category === 'furniture' && p.name.toLowerCase().includes('chair'))
  },
  'tables-desks': {
    title: 'Tables & Desks',
    deck: 'Honed travertine slabs, solid FSC white oak surfaces, and minimalist workspace architecture.',
    filter: (p) => ['HH-FUR-002', 'HH-SSS-001', 'HH-SSS-002'].includes(p.id) || p.name.toLowerCase().includes('table') || p.name.toLowerCase().includes('desk')
  },
  'storage-shelving': {
    title: 'Storage & Shelving',
    deck: 'Slatted tambour consoles, modular floating credenzas, and integrated cable architectural joinery.',
    filter: (p) => ['HH-SSS-001', 'HH-SSS-002'].includes(p.id) || p.category === 'small-spaces'
  },
  'beds-headboards': {
    title: 'Beds & Sleep Systems',
    deck: 'Integrated floating nightstands, solid ash platform architecture, and natural linen contours.',
    filter: (p) => ['HH-FUR-004'].includes(p.id) || p.name.toLowerCase().includes('bed')
  },

  // Décor Book collections
  'vases-ceramics': {
    title: 'Vases & Ceramic Objects',
    deck: 'Hand-thrown unglazed stoneware, tactile mineral glazes, and organic vessel silhouettes.',
    filter: (p) => ['HH-DEC-001'].includes(p.id) || p.category === 'decor'
  },
  'wall-art': {
    title: 'Wall Art & Relief Sculptures',
    deck: 'Textured lime-wash panels, bas-relief plaster compositions, and shadow-casting forms.',
    filter: (p) => ['HH-DEC-002'].includes(p.id) || p.category === 'decor'
  },
  'cushions-textiles': {
    title: 'Cushions & Loom Textiles',
    deck: 'Handwoven Belgian linen, tactile alpaca bouclé, and understated earthy pigments.',
    filter: (p) => ['HH-DEC-003'].includes(p.id) || p.category === 'decor'
  },
  'mirrors-accessories': {
    title: 'Mirrors & Decorative Objects',
    deck: 'Asymmetric cast-bronze mirrors, travertine bookends, and sculptural brass bowls.',
    filter: (p) => ['HH-DEC-004'].includes(p.id) || p.category === 'decor'
  },

  // Lighting Book collections
  'ceiling-lights': {
    title: 'Ceiling Lights & Chandeliers',
    deck: 'Warm architectural wash, diffused acoustic canopies, and suspended brass geometry.',
    filter: (p) => ['HH-LGT-001'].includes(p.id) || p.category === 'lighting'
  },
  'pendant-lights': {
    title: 'Pendant Lights & Suspensions',
    deck: 'Hand-spun raw brass shades, dim-to-warm LED illumination, and dining horizon balance.',
    filter: (p) => ['HH-LGT-001', 'HH-LGT-004'].includes(p.id) || p.category === 'lighting'
  },
  'table-lamps': {
    title: 'Table & Accent Lamps',
    deck: 'Tactile alabaster stone pedestals, pleated linen shades, and intimate desktop glow.',
    filter: (p) => ['HH-LGT-003'].includes(p.id) || p.category === 'lighting'
  },
  'floor-lamps': {
    title: 'Floor Lamps & Torchières',
    deck: 'Arched carbon-steel lines, weighted marble bases, and reading-corner ambiance.',
    filter: (p) => ['HH-LGT-002'].includes(p.id) || p.category === 'lighting'
  },
  'wall-lights': {
    title: 'Wall Sconces & Flush Mounts',
    deck: 'Directable brass arms, fluted optic glass diffusers, and hallway grazing light.',
    filter: (p) => ['HH-LGT-004'].includes(p.id) || p.category === 'lighting'
  },

  // Generic categories
  'furniture': {
    title: 'Furniture Atelier',
    deck: 'Solid hardwoods, monolithic stone slabs, and tactile upholstery designed to last generations.',
    filter: (p) => p.category === 'furniture'
  },
  'decor': {
    title: 'Home Décor & Curated Objects',
    deck: 'Artisanal ceramics, architectural mirrors, and tactile textiles that give spaces soul.',
    filter: (p) => p.category === 'decor'
  },
  'lighting': {
    title: 'Architectural & Ambient Lighting',
    deck: 'Warm 2700K illumination, sculpted brass silhouettes, and handcrafted stone bases.',
    filter: (p) => p.category === 'lighting'
  },
  'small-spaces': {
    title: 'Small Spaces & Smart Living',
    deck: 'Multifunctional nested joinery, space-intelligent proportions, and concealed storage.',
    filter: (p) => p.category === 'small-spaces'
  }
};

class HomeHubApp {
  constructor() {
    this.customerServiceDirect = customerService;
    this.openPrintInvoiceDirect = openPrintInvoice;
    this.couponServiceDirect = couponService;
    this.pluginRegistryDirect = pluginRegistry;
    this.tenantService = tenantService;

    // Multi-tenant active store resolution
    this.currentTenant = tenantService.init();
    this.currentTenantSlug = this.currentTenant.slug;

    // Currency formatting bound to active tenant
    setCurrencyFormatter((amt) => tenantService.formatPrice(amt, this.currentTenant));

    if (typeof window !== 'undefined') {
      window.homehub = this;
      window.homeHub = this;
    }

    // Load products tailored to active tenant
    this.products = tenantService.getProductsForTenant(this.currentTenantSlug);
    this.categories = CATEGORIES;

    this.flipbook = null;
    this.catalogue = null;
    this.productDetail = null;
    this.cart = null;
    this.wishlist = null;
    this.videoGallery = null;
    this.adminPortal = null;
    this.bookNav = null;

    this.init();
  }

  init() {
    this.initServiceWorker();
    this.initPWAInstall();
    this.tenantService.applyTenantTheme(this.currentTenant);
    this.initTenantSwitcher();
    this.initLaunchStoreModal();
    this.initCart();
    this.initWishlist();
    this.initProductDetail();
    this.initFlipbook();
    this.initCatalogue();
    this.initVideoGallery();
    this.initAdminPortal();
    this.initBookNavigation();
    this.bindGlobalNavigation();
    this.handleInitialRouting();
    this.dismissPreloader();
    this.loadSupabaseProducts();
  }

  initServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      const registerSW = () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => {
            console.log('HomeHub PWA ServiceWorker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('ServiceWorker registration skipped:', err.message);
          });
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
      }
    }
  }

  openInstallModal() {
    const iosModal = document.getElementById('pwa-ios-modal');
    if (iosModal) {
      iosModal.style.display = 'flex';
      iosModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  closeInstallModal() {
    const iosModal = document.getElementById('pwa-ios-modal');
    if (iosModal) {
      iosModal.style.display = 'none';
      iosModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  initPWAInstall() {
    let deferredPrompt = null;
    const banner = document.getElementById('pwa-install-banner');
    const closeBtn = document.getElementById('pwa-banner-close-btn');
    const iosModal = document.getElementById('pwa-ios-modal');
    const iosClose = document.getElementById('pwa-ios-close');
    const iosDismiss = document.getElementById('pwa-ios-dismiss-btn');
    const iosBackdrop = document.getElementById('pwa-ios-backdrop');

    const isStandalone = (typeof window !== 'undefined') && (
      Boolean(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true
    );

    const isIOS = (typeof navigator !== 'undefined') && (
      /iPad|iPhone|iPod/.test(navigator.userAgent || '') ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );

    if (iosClose) iosClose.addEventListener('click', () => this.closeInstallModal());
    if (iosDismiss) iosDismiss.addEventListener('click', () => this.closeInstallModal());
    if (iosBackdrop) iosBackdrop.addEventListener('click', () => this.closeInstallModal());

    // Listen for beforeinstallprompt event (Chromium, Android, Chrome OS, Edge)
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Sync banner title and badge to active tenant
        const activeTenant = this.currentTenant || { name: 'HomeHub', badge: '🏛️' };
        const bannerTitle = document.getElementById('pwa-banner-title');
        const bannerBadge = document.getElementById('pwa-banner-badge');
        if (bannerTitle) bannerTitle.textContent = `Install ${activeTenant.shortName || activeTenant.name} App`;
        if (bannerBadge) bannerBadge.textContent = activeTenant.badge || '🏛️';

        let dismissed = false;
        try {
          dismissed = sessionStorage.getItem('pwa_banner_dismissed') === 'true';
        } catch (_) {}

        if (!isStandalone && !dismissed && banner) {
          setTimeout(() => {
            banner.style.display = 'block';
          }, 2500);
        }
      });
    }

    // Dismiss banner for current session
    if (closeBtn && banner) {
      closeBtn.addEventListener('click', () => {
        banner.style.display = 'none';
        try {
          sessionStorage.setItem('pwa_banner_dismissed', 'true');
        } catch (_) {}
      });
    }

    // Trigger install on click using document-level event delegation
    const handleInstallClick = (e) => {
      if (e && e.preventDefault) e.preventDefault();

      if (isStandalone) {
        showToast('App is already installed and running in standalone mode!', 'info');
        return;
      }

      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
          if (choice && choice.outcome === 'accepted') {
            showToast('Thank you for installing the HomeHub Atelier app!', 'success');
            if (banner) banner.style.display = 'none';
          }
        }).catch(() => {});
        deferredPrompt = null;
      } else {
        this.openInstallModal();
      }
    };

    const bindTriggers = () => {
      document.querySelectorAll('.install-app-trigger, #pwa-banner-install-btn').forEach(btn => {
        if (!btn.dataset.pwaBound) {
          btn.dataset.pwaBound = 'true';
          btn.addEventListener('click', handleInstallClick);
        }
      });
    };
    bindTriggers();

    if (typeof document !== 'undefined') {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest && e.target.closest('.install-app-trigger, #pwa-banner-install-btn');
        if (trigger) {
          handleInstallClick(e);
        }
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('appinstalled', () => {
        showToast('App installed to your device successfully!', 'success');
        if (banner) banner.style.display = 'none';
        deferredPrompt = null;
      });
    }
  }

  async loadSupabaseProducts() {
    if (this.currentTenantSlug !== 'homehub') return;
    try {
      const res = await fetchStorefrontProducts();
      if (res && res.data && res.data.length > 0 && !res.isFallback) {
        // Merge with local creations so user-added products are never wiped out
        const remoteSkus = new Set(res.data.map(p => p.sku));
        const localOnly = (this.products || []).filter(p => !remoteSkus.has(p.sku));
        this.products = [...localOnly, ...res.data];
        if (this.catalogue) this.catalogue.setProducts(this.products);
        if (this.productDetail) this.productDetail.products = this.products;
        if (this.cart) this.cart.setProducts(this.products);
        if (this.wishlist) this.wishlist.setProducts(this.products);
        if (this.adminPortal) {
          this.adminPortal.products = this.products;
          if (this.adminPortal.isOpen() && this.adminPortal.activeTab === 'products') {
            this.adminPortal.renderTabContentArea();
          }
        }
      }
    } catch (err) {
      console.warn('Could not load products from Supabase, using local catalogue:', err);
    }
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
      tenantSlug: this.currentTenantSlug,
      onUpdate: (count) => this.updateHeaderBadges(),
      onViewProduct: (sku) => this.openProduct(sku)
    });
  }

  initWishlist() {
    this.wishlist = new Wishlist('wishlist-drawer-container', {
      products: this.products,
      tenantSlug: this.currentTenantSlug,
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
      initialBook: 'small-spaces',
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
      tenantSlug: this.currentTenantSlug,
      onProductsUpdated: (updatedProducts) => {
        this.products = updatedProducts;
        if (this.catalogue) this.catalogue.setProducts(updatedProducts);
        if (this.productDetail) this.productDetail.products = updatedProducts;
        if (this.cart) this.cart.setProducts(updatedProducts);
        if (this.wishlist) this.wishlist.setProducts(updatedProducts);
      }
    });
  }

  initBookNavigation() {
    this.bookNav = new BookNavigation('book-nav-modal', {
      onHome: () => this.showHomepage(),
      onNavigate: (target) => this.handleBookNavigationTarget(target)
    });
  }

  /* ==========================================================================
     Multi-Tenant SaaS Storefront Management
     ========================================================================== */
  initTenantSwitcher() {
    this.renderTenantSwitcherList();

    const switcherWrap = document.getElementById('tenant-switcher-wrap');
    const switcherBtn = document.getElementById('tenant-switcher-btn');

    if (switcherBtn && switcherWrap) {
      switcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = switcherWrap.classList.toggle('is-open');
        switcherBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!switcherWrap.contains(e.target)) {
          switcherWrap.classList.remove('is-open');
          switcherBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Header and Mobile Launch Store Buttons
    const headerLaunchBtn = document.getElementById('header-launch-store-btn');
    const mobileLaunchBtn = document.getElementById('mobile-launch-store-btn');

    const openLaunchModal = (e) => {
      if (e) e.stopPropagation();
      if (switcherWrap) switcherWrap.classList.remove('is-open');
      this.openLaunchStoreModal();
    };

    if (headerLaunchBtn) headerLaunchBtn.addEventListener('click', openLaunchModal);
    if (mobileLaunchBtn) mobileLaunchBtn.addEventListener('click', openLaunchModal);
  }

  renderTenantSwitcherList() {
    const listEl = document.getElementById('tenant-dropdown-list');
    const mobileListEl = document.getElementById('mobile-tenant-list');
    const allTenants = this.tenantService.getAllTenants();
    const activeSlug = this.currentTenantSlug;

    // Desktop Dropdown List
    if (listEl) {
      listEl.innerHTML = allTenants.map(t => {
        const isActive = t.slug === activeSlug;
        return `
          <button type="button" class="tenant-dropdown-item ${isActive ? 'active' : ''}" data-switch-tenant="${t.slug}" role="menuitem">
            <div class="tenant-item-main">
              <span class="tenant-item-badge">${t.badge || '🏛️'}</span>
              <div class="tenant-item-info">
                <span class="tenant-item-name">${t.name}</span>
                <span class="tenant-item-meta">${t.currency.code} (${t.currency.symbol}) • ${t.shortName}</span>
              </div>
            </div>
            ${isActive ? '<span class="tenant-item-check">✓</span>' : ''}
          </button>
        `;
      }).join('');

      listEl.querySelectorAll('[data-switch-tenant]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const slug = btn.dataset.switchTenant;
          this.switchStore(slug);
        });
      });
    }

    // Mobile Drawer List
    if (mobileListEl) {
      mobileListEl.innerHTML = allTenants.map(t => {
        const isActive = t.slug === activeSlug;
        return `
          <button type="button" class="mobile-tenant-btn ${isActive ? 'active' : ''}" data-switch-tenant="${t.slug}">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.15rem;">${t.badge || '🏛️'}</span>
              <div>
                <div style="font-size: 0.86rem; font-weight: 600; color: var(--color-charcoal);">${t.name}</div>
                <div style="font-size: 0.72rem; color: var(--color-muted-earth);">${t.currency.code} (${t.currency.symbol}) • ${t.tagline}</div>
              </div>
            </div>
            ${isActive ? '<span style="color: var(--color-terracotta); font-weight: bold; font-size: 0.9rem;">✓</span>' : ''}
          </button>
        `;
      }).join('');

      mobileListEl.querySelectorAll('[data-switch-tenant]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const slug = btn.dataset.switchTenant;
          this.switchStore(slug);
        });
      });
    }
  }

  switchStore(newSlug) {
    if (!newSlug) return;
    const tenant = this.tenantService.setActiveTenant(newSlug);
    this.currentTenant = tenant;
    this.currentTenantSlug = tenant.slug;

    // 1. Theme and branding variables
    this.tenantService.applyTenantTheme(tenant);
    setCurrencyFormatter((amt) => this.tenantService.formatPrice(amt, tenant));

    // 2. Load isolated products for active tenant
    this.products = this.tenantService.getProductsForTenant(tenant.slug);

    // 3. Update Catalogue & ProductDetail
    if (this.catalogue) this.catalogue.setProducts(this.products);
    if (this.productDetail) this.productDetail.products = this.products;

    // 4. Switch Cart and Wishlist storage & isolated state
    if (this.cart) this.cart.switchTenant(tenant.slug, this.products);
    if (this.wishlist) this.wishlist.switchTenant(tenant.slug, this.products);
    this.updateHeaderBadges();

    // 5. Switch Admin portal tenant
    if (this.adminPortal) this.adminPortal.switchTenant(tenant.slug, this.products);

    // 6. Refresh Switcher UI
    this.renderTenantSwitcherList();

    // 7. Update PWA Install Banner branding for active tenant
    const pwaTitle = document.getElementById('pwa-banner-title');
    const pwaBadge = document.getElementById('pwa-banner-badge');
    if (pwaTitle) pwaTitle.textContent = `Install ${tenant.shortName || tenant.name} App`;
    if (pwaBadge) pwaBadge.textContent = tenant.badge || '🏛️';

    // Close dropdown
    const switcherWrap = document.getElementById('tenant-switcher-wrap');
    if (switcherWrap) switcherWrap.classList.remove('is-open');

    // Close mobile drawer if open
    const drawer = document.getElementById('mobile-nav-drawer');
    if (drawer && drawer.classList.contains('is-open')) {
      drawer.classList.remove('is-open');
    }

    showToast(`Switched storefront to ${tenant.name}`, 'info');
  }

  initLaunchStoreModal() {
    const modal = document.getElementById('launch-store-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('launch-store-close');
    const cancelBtn = document.getElementById('launch-store-cancel-btn');
    const backdrop = document.getElementById('launch-store-backdrop');
    const form = document.getElementById('launch-store-form');
    const nameInput = document.getElementById('tenant-input-name');
    const slugInput = document.getElementById('tenant-input-slug');
    const colorInput = document.getElementById('tenant-input-color');

    const closeModal = () => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Auto slug generate from name
    if (nameInput && slugInput) {
      nameInput.addEventListener('input', () => {
        if (!slugInput.dataset.manuallyEdited) {
          slugInput.value = nameInput.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
      });
      slugInput.addEventListener('input', () => {
        slugInput.dataset.manuallyEdited = 'true';
      });
    }

    // Color preset chips
    const colorChips = modal.querySelectorAll('.color-chip');
    colorChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const color = chip.dataset.color;
        if (colorInput && color) colorInput.value = color;
      });
    });

    // Form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
          const name = (nameInput.value || '').trim();
          const slug = (slugInput.value || '').trim();
          const tagline = (document.getElementById('tenant-input-tagline')?.value || '').trim();
          const currencyCode = document.getElementById('tenant-input-currency')?.value || 'USD';
          const themeColor = colorInput ? colorInput.value : '#5C6B5E';
          const badge = (document.getElementById('tenant-input-badge')?.value || '').trim() || '✨';

          const newTenant = this.tenantService.createTenant({
            name,
            slug,
            tagline,
            currencyCode,
            themeColor,
            badge
          });

          closeModal();
          form.reset();
          if (slugInput) delete slugInput.dataset.manuallyEdited;

          this.switchStore(newTenant.slug);
          showToast(`✨ Store "${newTenant.name}" launched successfully!`, 'success');
        } catch (err) {
          showToast(`Could not launch store: ${err.message}`, 'error');
        }
      });
    }
  }

  openLaunchStoreModal() {
    const modal = document.getElementById('launch-store-modal');
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const nameInput = document.getElementById('tenant-input-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 50);
    }
  }

  updateHeaderBadges() {
    const cartBadge = document.getElementById('header-cart-badge');
    const wishBadge = document.getElementById('header-wishlist-badge');
    const mobileCartBadge = document.getElementById('mobile-bottom-cart-badge');

    if (cartBadge) {
      const cCount = this.cart.getCount();
      cartBadge.textContent = cCount;
      cartBadge.style.display = cCount > 0 ? 'flex' : 'none';
      if (mobileCartBadge) {
        mobileCartBadge.textContent = cCount;
        mobileCartBadge.style.display = cCount > 0 ? 'inline-flex' : 'none';
      }
    }

    if (wishBadge) {
      const wCount = this.wishlist.getCount();
      wishBadge.textContent = wCount;
      wishBadge.style.display = wCount > 0 ? 'flex' : 'none';
    }
  }

  updateBottomNavActive(tabName) {
    document.querySelectorAll('.mobile-bottom-nav-item').forEach(item => item.classList.remove('active'));
    const activeItem = document.getElementById(`mobile-tab-${tabName}`);
    if (activeItem) activeItem.classList.add('active');
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
    // Dedicated HOME Buttons (Header, Drawer, Brand Logo, Inner Pages)
    const homeTriggers = [
      document.getElementById('header-home-btn'),
      document.getElementById('header-brand-logo'),
      document.querySelector('.header-brand-mark'),
      document.getElementById('mobile-drawer-home-btn'),
      document.getElementById('header-nav-home'),
      document.getElementById('shop-page-home-btn'),
      document.getElementById('ideas-page-home-btn')
    ];

    homeTriggers.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showHomepage();
        });
      }
    });

    // Primary Header Navigation Links: Shop, Interior Ideas, Magazines
    const shopNavBtn = document.getElementById('header-nav-shop');
    if (shopNavBtn) shopNavBtn.addEventListener('click', (e) => { e.preventDefault(); this.showShopView(); });

    const ideasNavBtn = document.getElementById('header-nav-ideas');
    if (ideasNavBtn) ideasNavBtn.addEventListener('click', (e) => { e.preventDefault(); this.showIdeasView(); });

    const magazinesNavBtn = document.getElementById('header-nav-magazines');
    if (magazinesNavBtn) magazinesNavBtn.addEventListener('click', (e) => { e.preventDefault(); this.showMagazinesView(); });

    // Homepage Action Buttons
    const heroReadMagBtn = document.getElementById('hero-btn-read-magazine');
    if (heroReadMagBtn) {
      heroReadMagBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const magSec = document.getElementById('magazine-section');
        if (magSec) {
          magSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    const heroShopBtn = document.getElementById('hero-btn-shop');
    if (heroShopBtn) heroShopBtn.addEventListener('click', (e) => { e.preventDefault(); this.showShopView(); });

    const heroIdeasBtn = document.getElementById('hero-btn-ideas');
    if (heroIdeasBtn) heroIdeasBtn.addEventListener('click', (e) => { e.preventDefault(); this.showIdeasView(); });

    const heroMagazinesBtn = document.getElementById('hero-btn-magazines');
    if (heroMagazinesBtn) heroMagazinesBtn.addEventListener('click', (e) => { e.preventDefault(); this.showMagazinesView(); });

    const curatedViewAllBtn = document.getElementById('home-curated-view-all');
    if (curatedViewAllBtn) {
      curatedViewAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showShopView();
      });
    }

    // Curated Section Carousel Navigation Arrows
    const curatedTrack = document.getElementById('curated-slide-track');
    const curatedPrevBtn = document.getElementById('curated-slide-prev');
    const curatedNextBtn = document.getElementById('curated-slide-next');
    if (curatedPrevBtn && curatedTrack) {
      curatedPrevBtn.addEventListener('click', () => {
        curatedTrack.scrollBy({ left: -340, behavior: 'smooth' });
      });
    }
    if (curatedNextBtn && curatedTrack) {
      curatedNextBtn.addEventListener('click', () => {
        curatedTrack.scrollBy({ left: 340, behavior: 'smooth' });
      });
    }

    // Curated Section 4-Category Filter Tabs
    const curatedTabs = document.querySelectorAll('.curated-cat-tab');
    if (curatedTabs.length > 0 && curatedTrack) {
      curatedTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const selectedCat = tab.dataset.category;
          curatedTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          const cards = curatedTrack.querySelectorAll('.home-piece-card');
          cards.forEach(card => {
            if (selectedCat === 'all' || card.dataset.category === selectedCat) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
          curatedTrack.scrollTo({ left: 0, behavior: 'smooth' });
        });
      });
    }

    // Curated Section Working Add to Cart Buttons
    document.querySelectorAll('.piece-add-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sku = btn.dataset.sku;
        if (!sku) return;

        if (this.cart && typeof this.cart.addItem === 'function') {
          this.cart.addItem(sku, 1);
        }

        btn.classList.add('added');
        const origText = btn.textContent;
        btn.textContent = 'Added ✓';
        setTimeout(() => {
          btn.classList.remove('added');
          btn.textContent = origText;
        }, 1800);

        const prod = (this.products || []).find(p => p.sku === sku);
        showToast(prod ? `${prod.name} added to your bag!` : 'Item added to your bag!', 'success');
      });
    });

    // Curated Section: Dedicated Single-Subject Archive Navigation
    document.querySelectorAll('.curated-subject-card, .curated-explore-btn').forEach(elem => {
      elem.addEventListener('click', (e) => {
        if (e.target.closest('.piece-add-cart-btn')) return;
        e.preventDefault();
        e.stopPropagation();
        const subject = elem.dataset.curatedSubject || elem.dataset.subject || elem.closest('.curated-subject-card')?.dataset.curatedSubject;
        if (subject) {
          this.showCuratedSubjectView(subject);
        }
      });
      if (elem.classList.contains('.curated-subject-card') || elem.hasAttribute('data-curated-subject')) {
        elem.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const subject = elem.dataset.curatedSubject;
            if (subject) this.showCuratedSubjectView(subject);
          }
        });
      }
    });

    // Footer Social Channel Buttons (Facebook, X/Twitter, YouTube, Instagram)
    document.querySelectorAll('.footer-social-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const channelKey = btn.dataset.socialChannel;
        if (channelKey) {
          this.openSocialChannelModal(channelKey);
        }
      });
    });

    // Curated Homepage Pieces PDP Trigger (Clicking Card or View Details)
    document.querySelectorAll('.home-piece-card:not(.curated-subject-card), .piece-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target.closest('.piece-add-cart-btn') || e.target.closest('.curated-explore-btn')) return;
        e.preventDefault();
        e.stopPropagation();
        const sku = btn.dataset.sku || btn.closest('.home-piece-card')?.dataset.sku;
        if (sku) {
          this.openProduct(sku);
        }
      });
    });

    // Categories Dropdown Links (All 9 Categories)
    document.querySelectorAll('.category-dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const catId = item.dataset.cat;
        if (catId) this.showCategoryView(catId);
      });
    });

    // Homepage Category Rail Cards (All 9 Categories)
    document.querySelectorAll('.home-cat-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const catId = card.dataset.cat;
        if (catId) this.showCategoryView(catId);
      });
    });

    // Mobile Drawer Primary Links
    const mobShop = document.getElementById('mobile-link-shop');
    if (mobShop) mobShop.addEventListener('click', (e) => { e.preventDefault(); this.closeMobileDrawer(); this.showShopView(); });

    const mobIdeas = document.getElementById('mobile-link-ideas');
    if (mobIdeas) mobIdeas.addEventListener('click', (e) => { e.preventDefault(); this.closeMobileDrawer(); this.showIdeasView(); });

    const mobMagazines = document.getElementById('mobile-link-magazines');
    if (mobMagazines) mobMagazines.addEventListener('click', (e) => { e.preventDefault(); this.closeMobileDrawer(); this.showMagazinesView(); });

    // Mobile Drawer 9 Room Category Links
    document.querySelectorAll('.cat-mobile-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const catId = link.dataset.cat;
        this.closeMobileDrawer();
        if (catId) this.showCategoryView(catId);
      });
    });

    // Mobile Drawer Utilities
    const mobAccount = document.getElementById('mobile-link-account');
    if (mobAccount) mobAccount.addEventListener('click', (e) => { e.preventDefault(); this.closeMobileDrawer(); this.openAccountModal(); });

    const mobWishlist = document.getElementById('mobile-link-wishlist');
    if (mobWishlist) mobWishlist.addEventListener('click', (e) => { e.preventDefault(); this.closeMobileDrawer(); this.wishlist.open(); });

    const mobCart = document.getElementById('mobile-link-cart');
    if (mobCart) mobCart.addEventListener('click', (e) => { e.preventDefault(); this.closeMobileDrawer(); this.cart.open(); });

    // Header Book Navigation Triggers (Preserved for compatibility)
    document.querySelectorAll('.nav-book-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const bookKey = btn.dataset.navBook;
        if (this.bookNav) this.bookNav.open(bookKey);
      });
    });

    // Mobile Drawer Book Navigation Triggers
    document.querySelectorAll('.mobile-nav-book-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const bookKey = btn.dataset.navBook;
        this.closeMobileDrawer();
        if (this.bookNav) this.bookNav.open(bookKey);
      });
    });

    // 4 Book Header links (if any legacy or extra links remain)
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

    // Admin Triggers (Direct delegation for static and dynamically injected links)
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('a[href="#admin"], .admin-open-trigger');
      if (trigger) {
        e.preventDefault();
        if (this.adminPortal) this.adminPortal.open();
      }
    });

    // Mobile Bottom App Navigation (PWA Shell)
    const mobTabHome = document.getElementById('mobile-tab-home');
    if (mobTabHome) mobTabHome.addEventListener('click', (e) => { e.preventDefault(); this.showHomepage(); });

    const mobTabMagazines = document.getElementById('mobile-tab-magazines');
    if (mobTabMagazines) mobTabMagazines.addEventListener('click', (e) => { e.preventDefault(); this.showMagazinesView(); });

    const mobTabShop = document.getElementById('mobile-tab-shop');
    if (mobTabShop) mobTabShop.addEventListener('click', (e) => { e.preventDefault(); this.showShopView(); });

    const mobTabCart = document.getElementById('mobile-tab-cart');
    if (mobTabCart) mobTabCart.addEventListener('click', (e) => { e.preventDefault(); this.cart.open(); });

    const mobTabAccount = document.getElementById('mobile-tab-account');
    if (mobTabAccount) mobTabAccount.addEventListener('click', (e) => { e.preventDefault(); this.openAccountModal(); });

    // Initial Badge states
    this.updateHeaderBadges();

    // Listen to hash and state changes (back / forward navigation & URL hash routes)
    window.addEventListener('popstate', () => {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        try {
          const params = new URLSearchParams(window.location.search);
          const storeSlug = params.get('store');
          if (storeSlug && storeSlug !== this.currentTenantSlug) {
            this.switchStore(storeSlug);
          }
        } catch (_) {}
      }
      this.handleInitialRouting();
    });
    window.addEventListener('hashchange', () => {
      this.handleInitialRouting();
    });
  }

  openAccountModal() {
    const modal = document.getElementById('account-modal-container');
    if (!modal) return;

    const renderModalContent = () => {
      const currentUser = customerService.getCurrentUser();

      if (!currentUser) {
        modal.innerHTML = `
          <div class="account-backdrop" id="account-backdrop"></div>
          <div class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-dialog-title">
            <div class="account-header">
              <h3 id="account-dialog-title">Client Atelier Account</h3>
              <button class="cart-close-btn" id="close-account-modal-btn" aria-label="Close">✕</button>
            </div>

            <!-- Auth Mode Tabs -->
            <div class="account-auth-tabs">
              <button class="auth-tab-btn active" id="tab-client-signin">Sign In</button>
              <button class="auth-tab-btn" id="tab-client-register">Register Account</button>
            </div>

            <div id="account-auth-error" class="checkout-error-banner" style="display: none; margin-bottom: 1rem;"></div>

            <!-- Sign In Form -->
            <form id="form-client-signin" class="client-auth-form">
              <div class="form-group" style="margin-bottom: 1rem;">
                <label for="signin-email" style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-muted-earth); margin-bottom:6px;">Email Address *</label>
                <input type="email" id="signin-email" required placeholder="ayesha@example.com" style="width:100%; padding:10px 14px; border-radius:var(--radius-pill); border:1px solid var(--color-border); font-family:inherit; font-size:0.85rem;" />
              </div>
              <div class="form-group" style="margin-bottom: 1.2rem;">
                <label for="signin-password" style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-muted-earth); margin-bottom:6px;">Password *</label>
                <input type="password" id="signin-password" required placeholder="••••••••" style="width:100%; padding:10px 14px; border-radius:var(--radius-pill); border:1px solid var(--color-border); font-family:inherit; font-size:0.85rem;" />
              </div>
              <button type="submit" class="admin-btn-primary" style="width:100%; padding:12px; font-size:0.85rem;">Sign In to Client Atelier →</button>
            </form>

            <!-- Register Form (Hidden by default) -->
            <form id="form-client-register" class="client-auth-form" style="display: none;">
              <div class="form-group" style="margin-bottom: 0.8rem;">
                <label for="reg-name" style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-muted-earth); margin-bottom:4px;">Full Name *</label>
                <input type="text" id="reg-name" required placeholder="e.g. Ayesha Malik" style="width:100%; padding:9px 14px; border-radius:var(--radius-pill); border:1px solid var(--color-border); font-family:inherit; font-size:0.85rem;" />
              </div>
              <div class="form-group" style="margin-bottom: 0.8rem;">
                <label for="reg-email" style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-muted-earth); margin-bottom:4px;">Email Address *</label>
                <input type="email" id="reg-email" required placeholder="ayesha@example.com" style="width:100%; padding:9px 14px; border-radius:var(--radius-pill); border:1px solid var(--color-border); font-family:inherit; font-size:0.85rem;" />
              </div>
              <div class="form-group" style="margin-bottom: 0.8rem;">
                <label for="reg-password" style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-muted-earth); margin-bottom:4px;">Password (min 6 characters) *</label>
                <input type="password" id="reg-password" minlength="6" required placeholder="••••••••" style="width:100%; padding:9px 14px; border-radius:var(--radius-pill); border:1px solid var(--color-border); font-family:inherit; font-size:0.85rem;" />
              </div>
              <div class="form-row-2" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:1.2rem;">
                <div class="form-group">
                  <label for="reg-phone" style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-muted-earth); margin-bottom:4px;">Phone Number</label>
                  <input type="tel" id="reg-phone" placeholder="+92 300 1234567" style="width:100%; padding:9px 14px; border-radius:var(--radius-pill); border:1px solid var(--color-border); font-family:inherit; font-size:0.85rem;" />
                </div>
                <div class="form-group">
                  <label for="reg-city" style="display:block; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-muted-earth); margin-bottom:4px;">City</label>
                  <input type="text" id="reg-city" placeholder="Lahore / Karachi..." style="width:100%; padding:9px 14px; border-radius:var(--radius-pill); border:1px solid var(--color-border); font-family:inherit; font-size:0.85rem;" />
                </div>
              </div>
              <button type="submit" class="admin-btn-primary" style="width:100%; padding:12px; font-size:0.85rem;">Create Client Atelier Account →</button>
            </form>

            <div style="border-top: 1px solid var(--color-border); padding-top: 1.2rem; margin-top: 1.4rem;">
              <p style="font-size: 0.75rem; color: var(--color-muted-earth); margin-bottom: 0.6rem;">
                Atelier staff, design directors and administrators can access the full management console below:
              </p>
              <button class="account-admin-switch-btn admin-open-trigger" id="account-launch-admin-btn">
                🔑 Switch to Staff Admin Console
              </button>
            </div>
          </div>
        `;
      } else {
        const clientOrders = customerService.getCustomerOrders(currentUser.email);
        const initials = currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'HH';

        modal.innerHTML = `
          <div class="account-backdrop" id="account-backdrop"></div>
          <div class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-dialog-title" style="max-width: 680px;">
            <div class="account-header">
              <h3 id="account-dialog-title">Client Atelier Profile</h3>
              <button class="cart-close-btn" id="close-account-modal-btn" aria-label="Close">✕</button>
            </div>

            <div class="account-profile-card">
              <div class="account-avatar">${initials}</div>
              <div class="account-user-meta">
                <strong>${currentUser.name}</strong>
                <span>${currentUser.email}</span>
                <div class="account-tier-badge">${currentUser.tier || 'Private Atelier Client'}</div>
                ${currentUser.city ? `<span style="font-size:0.72rem; color:var(--color-muted-earth); margin-top:2px;">📍 ${currentUser.city}</span>` : ''}
              </div>
              <button id="client-signout-btn" class="footer-admin-link" style="margin-left: auto; align-self: center;">Sign Out</button>
            </div>

            <!-- Customer Order History -->
            <div class="account-orders-section" style="margin-top: 1.6rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                <h4 style="font-family:'Cormorant Garamond', serif; font-size:1.25rem; margin:0; color:var(--color-noir);">
                  Atelier Order History (${clientOrders.length})
                </h4>
                <span style="font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-muted-olive); font-weight:600;">
                  Live Status Tracking
                </span>
              </div>

              ${clientOrders.length === 0 ? `
                <div style="background:var(--color-surface-subtle); padding:1.5rem; text-align:center; border:1px solid var(--color-border); border-radius:var(--radius-sm);">
                  <div style="font-size:1.8rem; margin-bottom:0.4rem;">📦</div>
                  <p style="font-size:0.82rem; color:var(--color-muted-earth); margin:0;">
                    No order history recorded for <strong>${currentUser.email}</strong> yet.<br/>
                    Orders placed with this email will automatically appear here with real-time status and downloadable invoices.
                  </p>
                </div>
              ` : `
                <div class="account-orders-list" style="display:flex; flex-direction:column; gap:12px; max-height:280px; overflow-y:auto; padding-right:4px;">
                  ${clientOrders.map(order => {
                    const statusClass = (order.status || order.order_status || 'PENDING').toLowerCase();
                    const itemsText = Array.isArray(order.items)
                      ? order.items.map(it => `${it.quantity || 1}× ${it.product_name || it.sku}`).join(', ')
                      : 'Curated Architectural Pieces';

                    return `
                      <div class="account-order-card" style="border:1px solid var(--color-border); background:var(--color-surface-pure); padding:14px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                        <div style="flex:1; min-width:220px;">
                          <div style="display:flex; align-items:center; gap:8px;">
                            <strong style="font-size:0.84rem; font-family:monospace; color:var(--color-noir);">${order.order_number || order.id}</strong>
                            <span class="status-pill ${statusClass === 'delivered' ? 'live' : 'staging'}" style="font-size:0.65rem; padding:2px 8px;">
                              ● ${order.status || order.order_status || 'PENDING'}
                            </span>
                          </div>
                          <div style="font-size:0.75rem; color:var(--color-muted-earth); margin-top:4px;">
                            ${itemsText}
                          </div>
                          <div style="font-size:0.7rem; color:var(--color-warm-taupe); margin-top:2px;">
                            ${new Date(order.created_at || Date.now()).toLocaleDateString()} • ${order.sync_status === 'CLOUD_CONFIRMED' ? 'Cloud Verified' : 'Local Atelier Outbox'}
                          </div>
                        </div>

                        <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
                          <strong style="font-size:0.9rem; color:var(--color-noir);">${formatPKR(order.total_amount || order.total || 0)}</strong>
                          <button class="client-print-invoice-btn footer-admin-link" data-order-ref="${order.order_number || order.id}" style="padding:4px 10px; font-size:0.68rem;">
                            🖨️ Invoice
                          </button>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>

            <div class="account-nav-list" style="margin-top: 1.4rem;">
              <button class="account-nav-item" id="account-view-wishlist-btn">
                <span>❤️ Saved Wishlist Pieces</span>
                <strong>${this.wishlist ? this.wishlist.getCount() : 0} Pieces →</strong>
              </button>
              <button class="account-nav-item" id="account-view-bag-btn">
                <span>🛍️ Active Shopping Bag</span>
                <strong>${this.cart ? this.cart.getCount() : 0} Items →</strong>
              </button>
            </div>

            <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; margin-top: 1.2rem;">
              <button class="account-admin-switch-btn admin-open-trigger" id="account-launch-admin-btn">
                🔑 Switch to Staff Admin Console
              </button>
            </div>
          </div>
        `;
      }

      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      const close = () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        modal.innerHTML = '';
      };

      modal.querySelector('#account-backdrop').addEventListener('click', close);
      modal.querySelector('#close-account-modal-btn').addEventListener('click', close);

      // Tab switching
      const tabSignIn = modal.querySelector('#tab-client-signin');
      const tabRegister = modal.querySelector('#tab-client-register');
      const formSignIn = modal.querySelector('#form-client-signin');
      const formRegister = modal.querySelector('#form-client-register');
      const errorBanner = modal.querySelector('#account-auth-error');

      if (tabSignIn && tabRegister && formSignIn && formRegister) {
        tabSignIn.addEventListener('click', () => {
          tabSignIn.classList.add('active');
          tabRegister.classList.remove('active');
          formSignIn.style.display = 'block';
          formRegister.style.display = 'none';
          if (errorBanner) errorBanner.style.display = 'none';
        });

        tabRegister.addEventListener('click', () => {
          tabRegister.classList.add('active');
          tabSignIn.classList.remove('active');
          formRegister.style.display = 'block';
          formSignIn.style.display = 'none';
          if (errorBanner) errorBanner.style.display = 'none';
        });
      }

      // Handle Sign In submit
      if (formSignIn) {
        formSignIn.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = modal.querySelector('#signin-email').value.trim();
          const password = modal.querySelector('#signin-password').value;
          try {
            customerService.login(email, password);
            renderModalContent();
          } catch (err) {
            if (errorBanner) {
              errorBanner.textContent = err.message;
              errorBanner.style.display = 'block';
            }
          }
        });
      }

      // Handle Register submit
      if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = modal.querySelector('#reg-name').value.trim();
          const email = modal.querySelector('#reg-email').value.trim();
          const password = modal.querySelector('#reg-password').value;
          const phone = modal.querySelector('#reg-phone').value.trim();
          const city = modal.querySelector('#reg-city').value.trim();
          try {
            customerService.register({ name, email, password, phone, city });
            renderModalContent();
          } catch (err) {
            if (errorBanner) {
              errorBanner.textContent = err.message;
              errorBanner.style.display = 'block';
            }
          }
        });
      }

      // Handle Sign Out
      const signoutBtn = modal.querySelector('#client-signout-btn');
      if (signoutBtn) {
        signoutBtn.addEventListener('click', () => {
          customerService.logout();
          renderModalContent();
        });
      }

      // Print Invoice button handlers
      modal.querySelectorAll('.client-print-invoice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const orderRef = btn.dataset.orderRef;
          const clientOrders = customerService.getCustomerOrders(currentUser.email);
          const order = clientOrders.find(o => (o.order_number === orderRef || o.id === orderRef));
          if (order) {
            openPrintInvoice(order);
          }
        });
      });

      // Quick Nav Buttons
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

      const adminBtn = modal.querySelector('#account-launch-admin-btn');
      if (adminBtn) {
        adminBtn.addEventListener('click', () => {
          close();
          if (this.adminPortal) this.adminPortal.open();
        });
      }
    };

    renderModalContent();
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

  showHomepage() {
    if (this.bookNav) this.bookNav.close();
    if (this.closeMobileDrawer) this.closeMobileDrawer();

    const homeView = document.getElementById('home-view');
    const shopView = document.getElementById('shop-view');
    const ideasView = document.getElementById('ideas-view');
    const catPage = document.getElementById('category-page-view');
    const curatedView = document.getElementById('curated-subject-view');

    if (homeView) homeView.style.display = 'block';
    if (shopView) shopView.style.display = 'none';
    if (ideasView) ideasView.style.display = 'none';
    if (catPage) catPage.style.display = 'none';
    if (curatedView) curatedView.style.display = 'none';

    document.querySelectorAll('.nav-item-link').forEach(l => l.classList.remove('active'));
    const homeNav = document.getElementById('header-nav-home');
    if (homeNav) homeNav.classList.add('active');
    this.updateBottomNavActive('home');

    window.history.pushState(null, '', '#home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showShopView() {
    if (this.bookNav) this.bookNav.close();
    if (this.closeMobileDrawer) this.closeMobileDrawer();

    const homeView = document.getElementById('home-view');
    const shopView = document.getElementById('shop-view');
    const ideasView = document.getElementById('ideas-view');
    const catPage = document.getElementById('category-page-view');
    const curatedView = document.getElementById('curated-subject-view');

    if (homeView) homeView.style.display = 'none';
    if (shopView) shopView.style.display = 'block';
    if (ideasView) ideasView.style.display = 'none';
    if (catPage) catPage.style.display = 'none';
    if (curatedView) curatedView.style.display = 'none';

    document.querySelectorAll('.nav-item-link').forEach(l => l.classList.remove('active'));
    const shopNav = document.getElementById('header-nav-shop');
    if (shopNav) shopNav.classList.add('active');
    this.updateBottomNavActive('shop');

    if (this.catalogue) {
      this.catalogue.setCategory('all');
    }

    window.history.pushState(null, '', '#shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showIdeasView() {
    if (this.bookNav) this.bookNav.close();
    if (this.closeMobileDrawer) this.closeMobileDrawer();

    const homeView = document.getElementById('home-view');
    const shopView = document.getElementById('shop-view');
    const ideasView = document.getElementById('ideas-view');
    const catPage = document.getElementById('category-page-view');
    const curatedView = document.getElementById('curated-subject-view');

    if (homeView) homeView.style.display = 'none';
    if (shopView) shopView.style.display = 'none';
    if (ideasView) ideasView.style.display = 'block';
    if (catPage) catPage.style.display = 'none';
    if (curatedView) curatedView.style.display = 'none';

    document.querySelectorAll('.nav-item-link').forEach(l => l.classList.remove('active'));
    const ideasNav = document.getElementById('header-nav-ideas');
    if (ideasNav) ideasNav.classList.add('active');

    if (this.videoGallery) {
      this.videoGallery.setCategory('all');
    }

    window.history.pushState(null, '', '#ideas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showMagazinesView() {
    if (this.bookNav) this.bookNav.close();
    if (this.closeMobileDrawer) this.closeMobileDrawer();

    const homeView = document.getElementById('home-view');
    const shopView = document.getElementById('shop-view');
    const ideasView = document.getElementById('ideas-view');
    const catPage = document.getElementById('category-page-view');
    const curatedView = document.getElementById('curated-subject-view');

    if (homeView) homeView.style.display = 'block';
    if (shopView) shopView.style.display = 'none';
    if (ideasView) ideasView.style.display = 'none';
    if (catPage) catPage.style.display = 'none';
    if (curatedView) curatedView.style.display = 'none';

    document.querySelectorAll('.nav-item-link').forEach(l => l.classList.remove('active'));
    const magNav = document.getElementById('header-nav-magazines');
    if (magNav) magNav.classList.add('active');
    this.updateBottomNavActive('magazines');

    window.history.pushState(null, '', '#magazines');
    const magSection = document.getElementById('magazine-section');
    if (magSection) {
      magSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openCollection(collectionKey) {
    this.showCategoryView(collectionKey);
  }

  openCategory(categoryKey) {
    this.showCategoryView(categoryKey);
  }

  showCategoryView(categoryKey) {
    if (this.bookNav) this.bookNav.close();
    if (this.closeMobileDrawer) this.closeMobileDrawer();

    const homeView = document.getElementById('home-view');
    const shopView = document.getElementById('shop-view');
    const ideasView = document.getElementById('ideas-view');
    const catPage = document.getElementById('category-page-view');
    const curatedView = document.getElementById('curated-subject-view');
    const container = document.getElementById('category-page-container');

    if (homeView) homeView.style.display = 'none';
    if (shopView) shopView.style.display = 'none';
    if (ideasView) ideasView.style.display = 'none';
    if (catPage) catPage.style.display = 'block';
    if (curatedView) curatedView.style.display = 'none';

    if (!container) return;

    // Resolve category data from CATEGORY_INSPIRATION_DATA or fallback
    const catData = CATEGORY_INSPIRATION_DATA[categoryKey] || CATEGORY_INSPIRATION_DATA['furniture'];
    const items = this.products.filter(catData.productFilter || (() => true));

    container.innerHTML = `
      <div class="category-page-nav-bar">
        <div class="category-breadcrumb">
          <a href="#home" class="breadcrumb-home-link">HomeHub</a>
          <span class="breadcrumb-sep">/</span>
          <span>Categories</span>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">${catData.name}</span>
        </div>
        <div class="category-nav-actions">
          <button class="page-home-btn" id="cat-page-home-btn" aria-label="Return to Homepage">
            <span>🏠 HOME</span>
          </button>
          <button class="page-back-btn" id="cat-page-back-btn" aria-label="Go Back">
            <span>← Back</span>
          </button>
        </div>
      </div>

      <!-- Category Hero Banner with Genuine Interior Photography -->
      <section class="cat-hero-banner">
        <div class="cat-hero-media" style="background-image: url('${catData.heroImage}');">
          <div class="cat-hero-overlay">
            <span class="cat-hero-eyebrow">✦ HOMEHUB ATELIER • ${catData.name.toUpperCase()}</span>
            <h1 class="cat-hero-title">${catData.title}</h1>
            <p class="cat-hero-deck">${catData.deck}</p>
            <div class="cat-hero-meta-row">
              <span class="cat-hero-badge">${items.length} Curated In-Stock Pieces</span>
              <span>•</span>
              <span>White-Glove Staged Delivery in Pakistan</span>
              <span>•</span>
              <span>5-Year Structural Warranty</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Interior Design Inspiration & Room Styling Guides -->
      <section class="cat-editorial-section">
        <div class="cat-section-header">
          <span class="cat-section-kicker">INTERIOR DESIGN INSPIRATION & STYLING GUIDANCE</span>
          <h2 class="cat-section-title">Architectural Placement & Principles</h2>
          <p class="cat-section-subhead">
            Expert room styling strategies to balance proportions, optimize flow, and compose a tranquil atmosphere.
          </p>
        </div>

        <!-- 3 Principles Grid -->
        <div class="cat-principles-grid">
          ${catData.stylingPrinciples.map(sp => `
            <article class="cat-principle-card">
              <span class="cat-principle-tag">${sp.tag}</span>
              <h3 class="cat-principle-title">${sp.title}</h3>
              <p class="cat-principle-text">${sp.text}</p>
            </article>
          `).join('')}
        </div>

        <!-- Video Masterclass Card -->
        <div class="cat-video-showcase">
          <div class="cat-video-preview-col" data-video-id="${catData.makeoverVideo.id}">
            <video 
              class="cat-video-element" 
              muted 
              playsinline 
              loop 
              controls
              preload="metadata" 
              poster="${catData.makeoverVideo.thumbnail}"
              aria-label="${catData.makeoverVideo.title}"
            >
              <source src="${catData.makeoverVideo.videoUrl || catData.makeoverVideo.localVideoUrl}" type="video/mp4">
              ${catData.makeoverVideo.webmUrl ? `<source src="${catData.makeoverVideo.webmUrl}" type="video/webm">` : ''}
              Your browser does not support HTML5 video.
            </video>
            <div class="cat-video-play-overlay">
              <div class="cat-video-play-icon" aria-label="Toggle Play">▶</div>
            </div>
          </div>
          <div class="cat-video-info-col">
            <span class="cat-video-badge">ROOM MAKEOVER VIDEO • ${catData.makeoverVideo.duration}</span>
            <h3 class="cat-video-title">${catData.makeoverVideo.title}</h3>
            <p class="cat-video-desc">${catData.makeoverVideo.description}</p>
            <h4 class="cat-video-takeaways-title">Key Architectural Principles:</h4>
            <ul class="cat-video-takeaways-list">
              ${catData.makeoverVideo.takeaways.map(t => `<li>${t}</li>`).join('')}
            </ul>
            <button class="cat-watch-video-btn" data-video-id="${catData.makeoverVideo.id}">
              <span>Watch Masterclass</span>
              <span>▶</span>
            </button>
          </div>
        </div>

        <!-- Before & After Transformation Study -->
        <div class="cat-ba-card">
          <span class="cat-ba-tag">${catData.beforeAfter.tag}</span>
          <div class="cat-ba-item">
            <h5>Before Makeover</h5>
            <p>${catData.beforeAfter.before}</p>
          </div>
          <div class="cat-ba-item">
            <h5>After Architectural Styling</h5>
            <p>${catData.beforeAfter.after}</p>
          </div>
        </div>
      </section>

      <!-- Section: Product Listing & Shopping Grid -->
      <section class="cat-products-section">
        <div class="cat-section-header">
          <span class="cat-section-kicker">ATELIER CATALOGUE</span>
          <h2 class="cat-section-title">${catData.name} Furniture & Décor Collection</h2>
          <p class="cat-section-subhead">
            Handcrafted with solid FSC-certified hardwoods, honed travertine stone, and Italian textured bouclé.
          </p>
        </div>

        <div class="category-products-grid">
          ${items.map(p => `
            <article class="category-product-card" data-sku="${p.id}">
              <div class="cat-card-media" style="background-image: url('${p.images && p.images[0] ? (p.images[0].url || p.images[0]) : ''}');">
                <span class="cat-card-tag">${p.categoryLabel ? p.categoryLabel.toUpperCase() : p.category.toUpperCase()}</span>
              </div>
              <div class="cat-card-body">
                <div class="cat-card-meta">
                  <span class="cat-card-material">${p.material || 'Architectural Object'}</span>
                  <h3 class="cat-card-title">${p.name}</h3>
                  <p class="cat-card-desc">${p.shortDesc || p.description || ''}</p>
                </div>
                <div class="cat-card-footer">
                  <div class="cat-card-price-wrap">
                    <span class="cat-card-price-label">Price in PKR</span>
                    <span class="cat-card-price">${formatPKR ? formatPKR(p.price) : `₨ ${p.price.toLocaleString()}`}</span>
                  </div>
                  <button class="cat-card-add-btn" data-sku="${p.id}" aria-label="Add ${p.name} to Shopping Bag">
                    <span>Add to Bag</span>
                    <span>+</span>
                  </button>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;

    // Event listeners
    const homeBtn = container.querySelector('#cat-page-home-btn');
    if (homeBtn) homeBtn.addEventListener('click', (e) => { e.preventDefault(); this.showHomepage(); });

    const crumbHome = container.querySelector('.breadcrumb-home-link');
    if (crumbHome) crumbHome.addEventListener('click', (e) => { e.preventDefault(); this.showHomepage(); });

    const backBtn = container.querySelector('#cat-page-back-btn');
    if (backBtn) backBtn.addEventListener('click', (e) => { e.preventDefault(); window.history.back(); });

    // Video play triggers & smooth inline playback
    const videoPreviewCol = container.querySelector('.cat-video-preview-col');
    const catVideoEl = videoPreviewCol ? videoPreviewCol.querySelector('.cat-video-element') : null;
    const catPlayIcon = videoPreviewCol ? videoPreviewCol.querySelector('.cat-video-play-icon') : null;

    if (videoPreviewCol && catVideoEl) {
      // Hover behavior: preview video smoothly without audio lock
      videoPreviewCol.addEventListener('mouseenter', () => {
        catVideoEl.play().then(() => {
          videoPreviewCol.classList.add('is-playing');
          if (catPlayIcon) catPlayIcon.textContent = '❚❚';
        }).catch(() => {});
      });

      videoPreviewCol.addEventListener('mouseleave', () => {
        if (!catVideoEl.paused) {
          catVideoEl.pause();
          videoPreviewCol.classList.remove('is-playing');
          if (catPlayIcon) catPlayIcon.textContent = '▶';
        }
      });

      // Click behavior: toggle playback on desktop and mobile
      videoPreviewCol.addEventListener('click', () => {
        if (catVideoEl.paused) {
          catVideoEl.play().then(() => {
            videoPreviewCol.classList.add('is-playing');
            if (catPlayIcon) catPlayIcon.textContent = '❚❚';
          }).catch(() => {
            if (this.videoGallery) this.videoGallery.openVideoModal(catData.makeoverVideo.id);
          });
        } else {
          catVideoEl.pause();
          videoPreviewCol.classList.remove('is-playing');
          if (catPlayIcon) catPlayIcon.textContent = '▶';
        }
      });
    }

    const watchBtn = container.querySelector('.cat-watch-video-btn');
    if (watchBtn && this.videoGallery) {
      watchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.videoGallery.openVideoModal(catData.makeoverVideo.id);
      });
    }

    // Product card PDP triggers
    container.querySelectorAll('.category-product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.cat-card-add-btn')) return;
        const sku = card.dataset.sku;
        if (sku) this.openProduct(sku);
      });
    });

    // Add to cart buttons
    container.querySelectorAll('.cat-card-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sku = btn.dataset.sku;
        if (sku && this.cart) {
          this.cart.addItem(sku, 1);
          btn.classList.add('added');
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span>Added ✓</span>';
          setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = originalText;
          }, 1400);
        }
      });
    });

    window.history.pushState(null, '', `#category-${categoryKey}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showCuratedSubjectView(subjectKey = 'sofa') {
    if (this.bookNav) this.bookNav.close();
    if (this.closeMobileDrawer) this.closeMobileDrawer();

    const homeView = document.getElementById('home-view');
    const shopView = document.getElementById('shop-view');
    const ideasView = document.getElementById('ideas-view');
    const catPage = document.getElementById('category-page-view');
    const curatedView = document.getElementById('curated-subject-view');
    const container = document.getElementById('curated-subject-container');

    if (homeView) homeView.style.display = 'none';
    if (shopView) shopView.style.display = 'none';
    if (ideasView) ideasView.style.display = 'none';
    if (catPage) catPage.style.display = 'none';
    if (curatedView) curatedView.style.display = 'block';

    if (!container) return;

    const data = CURATED_SUBJECTS[subjectKey] || CURATED_SUBJECTS['sofa'];

    container.innerHTML = `
      <div class="subject-page-nav-bar">
        <div class="category-breadcrumb">
          <a href="#home" class="breadcrumb-home-link" id="subject-crumb-home">HomeHub</a>
          <span class="breadcrumb-sep">/</span>
          <span>Curated Subjects</span>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">${data.accentLabel}</span>
        </div>
        <div class="category-nav-actions">
          <button class="page-home-btn" id="subject-page-home-btn" aria-label="Return to Homepage">
            <span>🏠 Return to Atelier</span>
          </button>
          <button class="page-back-btn" id="subject-page-back-btn" aria-label="Go Back">
            <span>← Back</span>
          </button>
        </div>
      </div>

      <!-- Single-Subject Editorial Header -->
      <header class="subject-header-banner">
        <span class="subject-header-kicker">${data.kicker}</span>
        <h1 class="subject-header-title">${data.title}</h1>
        <div class="subject-header-tagline">${data.tagline}</div>
        <p class="subject-header-desc">${data.description}</p>
      </header>

      <!-- Strictly Single-Subject 4-Piece Grid -->
      <div class="subject-pieces-grid">
        ${data.items.map(item => `
          <article class="subject-piece-card" data-sku="${item.sku}" data-item-id="${item.id}">
            <div class="subject-piece-media">
              <img src="${item.image}" alt="${item.name}" class="piece-img" loading="eager" />
              <span class="piece-badge-corner">${item.badge}</span>
            </div>
            <div class="subject-piece-body">
              <div class="piece-cat">${item.category}</div>
              <h3 class="piece-title">${item.name}</h3>
              <p class="piece-desc">${item.desc}</p>
              <div class="subject-piece-specs">${item.specs}</div>
              <div class="piece-footer">
                <span class="piece-price">${formatPKR ? formatPKR(item.price) : `₨ ${item.price.toLocaleString()}`}</span>
                <button class="piece-add-cart-btn" data-sku="${item.sku}" data-item-id="${item.id}" aria-label="Add ${item.name} to cart">
                  <span>+ Add to Cart</span>
                </button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;

    // Bind Home & Back buttons
    const homeBtn = container.querySelector('#subject-page-home-btn');
    if (homeBtn) homeBtn.addEventListener('click', (e) => { e.preventDefault(); this.showHomepage(); });

    const crumbHome = container.querySelector('#subject-crumb-home');
    if (crumbHome) crumbHome.addEventListener('click', (e) => { e.preventDefault(); this.showHomepage(); });

    const backBtn = container.querySelector('#subject-page-back-btn');
    if (backBtn) backBtn.addEventListener('click', (e) => { e.preventDefault(); this.showHomepage(); });

    // Bind working Add to Cart buttons inside dedicated page
    container.querySelectorAll('.piece-add-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sku = btn.dataset.sku;
        const itemId = btn.dataset.itemId;
        const matchedItem = data.items.find(i => i.id === itemId) || { name: 'Curated Atelier Piece' };

        if (this.cart && typeof this.cart.addItem === 'function') {
          this.cart.addItem(sku, 1);
        }

        btn.classList.add('added');
        const origContent = btn.innerHTML;
        btn.innerHTML = '<span>Added ✓</span>';
        setTimeout(() => {
          btn.classList.remove('added');
          btn.innerHTML = origContent;
        }, 1800);

        showToast(`${matchedItem.name} added to your bag!`, 'success');
        this.updateHeaderBadges();
      });
    });

    window.history.pushState(null, '', `#curated-${subjectKey}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openSocialChannelModal(channelKey) {
    const modal = document.getElementById('social-modal-container');
    if (!modal) return;

    const channel = SOCIAL_CHANNELS[channelKey] || SOCIAL_CHANNELS['facebook'];

    modal.innerHTML = `
      <div class="social-modal-card" role="document">
        <div class="social-modal-banner">
          <img src="${channel.banner}" alt="${channel.name} Atelier Cover" />
          <button class="social-modal-close-btn" id="social-modal-close-x" aria-label="Close modal">✕</button>
        </div>

        <div class="social-modal-header">
          <div class="social-avatar-row">
            <div class="social-modal-avatar">
              <img src="${channel.avatar}" alt="${channel.name} Logo Mark" />
            </div>
            <button class="social-cta-btn" id="social-modal-cta-btn">${channel.ctaLabel}</button>
          </div>

          <div class="social-title-row">
            <h3 class="social-channel-name">${channel.name}</h3>
            ${channel.verified ? `<span class="social-verified-badge">✓ ${channel.badgeText}</span>` : ''}
          </div>

          <div class="social-channel-handle">${channel.handle} • ${channel.platform}</div>
          <div class="social-channel-metrics">${channel.metrics}</div>
          <p class="social-channel-bio">${channel.bio}</p>
        </div>

        <div class="social-feed-section">
          <div class="social-feed-title">Recent Atelier Updates & Editorial Posts</div>
          <div class="social-posts-list">
            ${channel.posts.map(p => `
              <article class="social-post-card">
                <div class="social-post-meta">
                  <span><strong>${channel.name}</strong> ${channel.handle}</span>
                  <span>${p.date}</span>
                </div>
                <p class="social-post-text">${p.text}</p>
                ${p.image ? `<img src="${p.image}" alt="Post image" class="social-post-img" loading="lazy" />` : ''}
                <div class="social-post-stats">
                  <span>♥ ${p.likes}</span>
                  <span>💬 ${p.comments}</span>
                  <span>↺ ${p.shares}</span>
                </div>
              </article>
            `).join('')}
          </div>
        </div>

        <div class="social-modal-footer">
          <button class="page-back-btn" id="social-modal-return-btn" style="padding: 8px 18px; border-radius: 9999px;">
            <span>← Return to HomeHub Storefront</span>
          </button>
          <span style="font-size: 0.76rem; color: #6B645B;">Official HomeHub Atelier Channel</span>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const close = () => this.closeSocialChannelModal();

    const closeBtn = modal.querySelector('#social-modal-close-x');
    if (closeBtn) closeBtn.addEventListener('click', close);

    const returnBtn = modal.querySelector('#social-modal-return-btn');
    if (returnBtn) returnBtn.addEventListener('click', close);

    const ctaBtn = modal.querySelector('#social-modal-cta-btn');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        ctaBtn.textContent = 'Following ✓';
        ctaBtn.style.backgroundColor = '#385E38';
        showToast(`You are now following ${channel.name} on ${channel.platform}!`, 'success');
      });
    }

    modal.onclick = (e) => {
      if (e.target === modal) close();
    };

    this._socialEscHandler = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', this._socialEscHandler);
  }

  closeSocialChannelModal() {
    const modal = document.getElementById('social-modal-container');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = '';
    }
    document.body.style.overflow = '';
    if (this._socialEscHandler) {
      window.removeEventListener('keydown', this._socialEscHandler);
      this._socialEscHandler = null;
    }
  }

  handleBookNavigationTarget(target) {
    if (!target) return;
    if (target.startsWith('magazine:')) {
      const bookId = target.replace('magazine:', '');
      this.showHomepage();
      this.openBook(bookId);
    } else if (target.startsWith('product:')) {
      const sku = target.replace('product:', '');
      this.openProduct(sku);
    } else if (target.startsWith('collection:')) {
      const col = target.replace('collection:', '');
      this.showCategoryView(col);
    } else if (target.startsWith('category:')) {
      const cat = target.replace('category:', '');
      this.showCategoryView(cat);
    }
  }

  handleInitialRouting() {
    const hash = window.location.hash;
    if (hash === '#home' || hash === '' || hash === '#') {
      this.showHomepage();
    } else if (hash === '#shop') {
      this.showShopView();
    } else if (hash === '#ideas' || hash === '#inspiration') {
      this.showIdeasView();
    } else if (hash === '#magazines') {
      this.showMagazinesView();
    } else if (hash.startsWith('#category-')) {
      const catKey = hash.replace('#category-', '');
      this.showCategoryView(catKey);
    } else if (hash.startsWith('#collection-')) {
      const colKey = hash.replace('#collection-', '');
      this.showCategoryView(colKey);
    } else if (hash.startsWith('#book-nav-')) {
      const bookKey = hash.replace('#book-nav-', '');
      if (this.bookNav) this.bookNav.open(bookKey);
    } else if (hash.startsWith('#book-')) {
      const match = hash.match(/^#book-(living-edit|objects-of-home|light-life|small-spaces)(?:-page-(\d+))?$/);
      if (match) {
        const bookId = match[1];
        const pageNum = match[2] ? Math.max(0, parseInt(match[2], 10) - 1) : 0;
        this.openBook(bookId, pageNum);
      }
    } else if (hash.startsWith('#product-')) {
      const sku = hash.replace('#product-', '');
      this.openProduct(sku);
    } else if (hash.startsWith('#curated-')) {
      const subKey = hash.replace('#curated-', '');
      this.showCuratedSubjectView(subKey);
    } else if (hash.startsWith('#social-')) {
      const chKey = hash.replace('#social-', '');
      this.openSocialChannelModal(chKey);
    } else if (hash === '#admin') {
      this.showHomepage();
      if (this.adminPortal) this.adminPortal.open();
    }
  }
}

export { HomeHubApp };

// Instantiate in browser environment
if (typeof document !== 'undefined') {
  const initApp = () => {
    if (!window.homehub) {
      window.homeHub = new HomeHubApp();
      window.homehub = window.homeHub;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
