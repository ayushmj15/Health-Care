const CACHE = "health-care-shell-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([self.clients.claim(), caches.delete(CACHE).catch(() => {})]),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || request.destination === "document") return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      try {
        const network = await fetch(request);
        if (network && network.status === 200 && new URL(request.url).origin === self.location.origin) {
          cache.put(request, network.clone());
        }
        return network;
      } catch {
        const cached = await cache.match(request);
        return cached || Response.error();
      }
    }),
  );
});
