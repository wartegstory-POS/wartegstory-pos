const CACHE_NAME = 'warteg-story-pos-v1.0.0';
const CORE = ['./', './index.html', './version.json'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('warteg-story-pos-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (new URL(req.url).pathname.endsWith('/version.json')) {
    event.respondWith(fetch(req).then(response => {
      if (response && response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)); }
      return response;
    }).catch(() => caches.match(req)));
    return;
  }
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(fetch(req).then(response => {
      if (response && response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy)); }
      return response;
    }).catch(() => caches.match('./index.html').then(cached => cached || caches.match('./'))));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(response => {
    if (response && response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)); }
    return response;
  })));
});
