const CACHE = 'ndc-link-v2';
const SHELL = ['./1_index.html', './2_manifest.json', './4_icon-192.png', './5_icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Only cache-serve requests for this same HTTPS origin (the NDC LINK shell).
// Anything to a unit's IP (http://192.168.x.x/...) is NEVER intercepted here —
// the browser handles that as a normal top-level navigation.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
