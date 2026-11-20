/**
 * HomeHub — Service Worker (PWA)
 * Caches core app shell for offline resilience, fast mobile startup,
 * and reliable installable PWA experience.
 *
 * Strategies:
 * - Navigation requests: Network-first with cache fallback (ensures fresh deploys, seamless offline)
 * - APIs (/api/*, Supabase): Strictly network-only (never stale-cached)
 * - Static assets: Cache-first with background revalidation (stale-while-revalidate)
 */

const CACHE_NAME = 'homehub-cache-v1.2.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/responsive.css',
  '/css/components/navigation.css',
  '/css/components/homepage.css',
  '/css/components/magazine-3d.css',
  '/css/components/category-page.css',
  '/css/components/product-detail.css',
  '/css/components/cart-wishlist.css',
  '/css/components/video-section.css',
  '/css/components/book-navigation.css',
  '/css/components/catalogue.css',
  '/css/components/admin.css',
  '/css/components/tenant-saas.css',
  '/css/components/pwa-install.css',
  '/css/components/footer.css',
  '/js/app.js',
  '/js/data/products.js',
  '/js/data/magazines.js',
  '/js/data/videos.js',
  '/js/data/categoryInspiration.js',
  '/js/data/curatedSubjects.js',
  '/js/data/socialChannels.js',
  '/js/components/flipbook.js',
  '/js/components/productDetail.js',
  '/js/components/cart.js',
  '/js/components/wishlist.js',
  '/js/components/catalogue.js',
  '/js/components/videoGallery.js',
  '/js/components/bookNavigation.js',
  '/js/components/admin.js',
  '/js/components/sound.js',
  '/js/services/tenantService.js',
  '/js/services/couponService.js',
  '/js/services/customerService.js',
  '/js/services/pluginRegistry.js',
  '/js/services/supabaseClient.js',
  '/js/utils/helpers.js',
  '/js/utils/storage.js',
  '/js/utils/invoice.js',
  '/assets/favicon.svg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/vendor/supabase.js'
];

// Install: Pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets failed to precache (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache generations and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Dispatcher
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and non-http(s) schemes (e.g. chrome-extension://)
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Vercel API and Supabase endpoints: strictly Network-only, NEVER stale-cached
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(async () => {
        return new Response(
          JSON.stringify({
            offline: true,
            error: 'offline',
            message: 'You are currently offline. Local Atelier changes will sync once reconnected.'
          }),
          { headers: { 'Content-Type': 'application/json' }, status: 503 }
        );
      })
    );
    return;
  }

  // 2. Navigation requests (HTML page): Network-first with cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback: Serve cached HTML app shell
          const cached = await caches.match('/index.html') || await caches.match('/');
          if (cached) return cached;
          return new Response(
            '<!DOCTYPE html><html><head><title>HomeHub — Offline</title></head><body><h1>HomeHub Atelier</h1><p>You are offline. Please reconnect to browse our collection.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 3. Static assets: Cache-first with background revalidation (Stale-While-Revalidate)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise.then(res => res || new Response('', { status: 404, statusText: 'Not Found' }));
    })
  );
});
