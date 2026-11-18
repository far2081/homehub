/**
 * HomeHub — Service Worker (PWA)
 * Caches core app shell for offline resilience and fast mobile load times.
 * Handles network-first strategy for dynamic data with cache fallback.
 */

const CACHE_NAME = 'homehub-cache-v1.0.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/responsive.css',
  '/css/components/navigation.css',
  '/css/components/magazine-3d.css',
  '/css/components/category-page.css',
  '/css/components/product-detail.css',
  '/css/components/cart-wishlist.css',
  '/css/components/video-section.css',
  '/css/components/book-navigation.css',
  '/css/components/catalogue.css',
  '/css/components/admin.css',
  '/css/components/footer.css',
  '/js/app.js',
  '/js/data/products.js',
  '/js/data/magazines.js',
  '/js/data/videos.js',
  '/js/data/categoryInspiration.js',
  '/js/components/flipbook.js',
  '/js/components/productDetail.js',
  '/js/components/cart.js',
  '/js/components/wishlist.js',
  '/js/components/catalogue.js',
  '/js/components/videoGallery.js',
  '/js/components/bookNavigation.js',
  '/js/components/admin.js',
  '/js/components/sound.js',
  '/js/services/supabaseClient.js',
  '/js/utils/helpers.js',
  '/js/utils/storage.js',
  '/assets/favicon.svg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// Install: Cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets failed to precache (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache generations
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

// Fetch: Network-first for APIs, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests (e.g. POST /api/upload) and Chrome extensions
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // API or Supabase requests: Network first, fall back to offline message
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        return new Response(
          JSON.stringify({ offline: true, message: 'You are currently offline. Local Atelier data will sync once reconnected.' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Static assets: Cache first, fallback to network and update cache
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to revalidate (Stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(async () => {
        // Fallback for navigation requests when completely offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
