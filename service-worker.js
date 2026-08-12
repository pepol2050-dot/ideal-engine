const CACHE_NAME = 'motafawqeen-v1';
const CORE_ASSETS = [
  'index.html',
  'login.html',
  'content.html',
  'teacher-panel.html',
  'assets/design-system.css',
  'assets/site-config.js',
  'assets/logo.svg',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for content data, cache-first for static shell
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if(url.includes('docs.google.com')){
    // دايمًا نجيب أحدث نسخة من محتوى الشيت، من غير تخزين مؤقت
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
