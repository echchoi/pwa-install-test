/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

// Cache name
const CACHE_NAME = 'pwa-test-v1';

// Install event
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service Worker installing...');
  event.waitUntil(self.skipWaiting());
});

// Activate event
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    (async () => {
      // Clear old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      // Claim all clients immediately
      await self.clients.claim();
    })()
  );
});

// Fetch event - Cache First strategy for assets, Network First for others
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Cache first strategy for static assets
  if (
    request.url.includes('.js') ||
    request.url.includes('.css') ||
    request.url.includes('.png') ||
    request.url.includes('.svg') ||
    request.url.includes('.ico') ||
    request.url.includes('.woff') ||
    request.url.includes('.woff2')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            // Clone the response
            const responseToCache = response.clone();
            // Cache the new response
            cache.put(request, responseToCache);
            return response;
          });
        });
      })
    );
  } else {
    // Network first for other requests
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            // Return offline page or default response
            return new Response('Offline - content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            });
          });
        })
    );
  }
});

// Message event for cache clearing
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('Cache cleared');
      event.ports[0]?.postMessage({ success: true });
    });
  }
});

export {};
