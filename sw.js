// DioBook Service Worker
const CACHE_VERSION = 'diobook-v26';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-1-violet-soundbook.svg',
  './icon-2-golden-classic.svg',
  './icon-3-neon-playwave.svg',
  './icon-4-minimal-ivory.svg',
  './icon-5-cosmic-moon.svg',
  './icon-6-emerald-studio.svg',
  './icon-7-continuous-line.svg',
  './icon-8-vinyl-pages.svg',
  './icon-9-split-duality.svg',
  './icon-10-white-acoustic-pages.svg',
  './icon-11-zen-halo-book.svg',
  './icon-12-fanned-wave-pages.svg',
  'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return Promise.all(
        APP_SHELL.map((url) => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache TTS, AI, or translation requests
  if (url.pathname.startsWith('/tts') || url.pathname.startsWith('/say') || url.pathname.startsWith('/voices') || url.pathname.startsWith('/gradio_api')) return;
  if (url.hostname.endsWith('.workers.dev') || url.hostname.endsWith('.deno.net') || url.hostname.endsWith('.hf.space') || url.hostname.includes('googleapis.com') || url.hostname.includes('dictionaryapi.dev') || url.hostname.includes('pollinations.ai') || url.hostname.includes('openlibrary.org') || url.hostname.includes('wikisource.org')) return;

  // Stale-while-revalidate for app shell
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((resp) => {
          if (resp && resp.status === 200 && resp.type !== 'opaque') {
            const copy = resp.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return resp;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
