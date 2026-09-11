const CACHE = "health-care-shell-v2";
const OFFLINE_URL = "/";

// App shell files to pre-cache
const APP_SHELL = [
  "/",
  "/install",
  "/dashboard",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(APP_SHELL).catch(() => {
        // Some routes may not be available during build
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean old caches
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      ),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Cache Google Fonts
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const network = await fetch(request);
          if (network && network.status === 200) {
            cache.put(request, network.clone());
          }
          return network;
        } catch {
          return Response.error();
        }
      })
    );
    return;
  }

  // Skip non-same-origin requests
  if (url.origin !== self.location.origin) return;

  // Document requests: network-first with offline fallback
  if (request.destination === "document") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        return caches.match(OFFLINE_URL) || Response.error();
      })
    );
    return;
  }

  // Assets: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const fetchPromise = fetch(request).then((network) => {
        if (network && network.status === 200) {
          cache.put(request, network.clone());
        }
        return network;
      }).catch(() => null);

      return cached || (await fetchPromise) || Response.error();
    })
  );
});
