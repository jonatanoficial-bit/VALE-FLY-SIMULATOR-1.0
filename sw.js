const CACHE = 'flysim-cache-part3-v1';
const TILE_CACHE = 'flysim-tiles-v1';
const cancelFlags = new Map(); // clientId => boolean


const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './manifest.webmanifest',
  './sw.js',
  './admin.html',

  // JS
  './js/store.js',
  './js/airports.js',
  './js/aircraft.js',
  './js/state.js',
  './js/economy.js',
  './js/map_canvas.js',
  './js/ui.js',
  './js/app.js',

  // Images
  './assets/images/map_bg.png',
  './assets/images/plane.png',
  './assets/images/logo.png',
  './assets/images/cover.png',
  './assets/images/aircraft_biz.png',
  './assets/images/aircraft_jumbo.png',
  './assets/images/aircraft_narrow.png',
  './assets/images/aircraft_regional.png',
  './assets/images/aircraft_turboprop.png',
  './assets/images/aircraft_wide.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => ((k !== CACHE) && (k !== TILE_CACHE)) ? caches.delete(k) : null)))
      .then(() => self.clients.claim())
  );
});

// Helper: cache-first for map tiles (works offline if previously cached)
async function tileCacheFirst(req) {
  const cache = await caches.open(TILE_CACHE);
  const hit = await cache.match(req, { ignoreSearch: false });
  if (hit) return hit;
  try {
    const res = await fetch(req, { mode: 'cors', credentials: 'omit' });
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    return hit || Response.error();
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // Same-origin assets: cache-first
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  // OSM/tiles: cache-first (so offline works after caching)
  const isTile = (
    url.hostname === 'tile.openstreetmap.org' ||
    url.hostname.endsWith('.tile.openstreetmap.org')
  ) && (url.pathname.match(/\/(\d+)\/(\d+)\/(\d+)\.png$/));
  if (isTile) {
    e.respondWith(tileCacheFirst(req));
    return;
  }

  // External: network-first fallback cache
  e.respondWith(fetch(req).catch(() => caches.match(req)));
});

async function postToTargets(clientId, payload){
  if (clientId){
    try{ const cl = await self.clients.get(clientId); if(cl) cl.postMessage(payload);}catch(_){ }
    return;
  }
  const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const cl of all) { try{ cl.postMessage(payload);}catch(_){ } }
}

// Messages from app: pre-cache tiles for offline packs
self.addEventListener('message', (e) => {
  const msg = e.data || {};
  if (msg.type === 'CANCEL_CACHE_TILES') {
    if (msg.clientId) cancelFlags.set(msg.clientId, true);
    else {
      // cancel for all clients
      for (const k of cancelFlags.keys()) cancelFlags.set(k, true);
    }
    return;
  }
  if (msg.type !== 'CACHE_TILES' || !Array.isArray(msg.urls)) return;

  const clientId = msg.clientId || null;

  e.waitUntil((async () => {
    const cache = await caches.open(TILE_CACHE);
    let done = 0;
    const total = msg.urls.length;

    cancelFlags.set(clientId, false);

    for (const u of msg.urls) {
      if (clientId && cancelFlags.get(clientId)) break;
      try {
        const req = new Request(u, { mode: 'cors', credentials: 'omit' });
        const hit = await cache.match(req);
        if (!hit) {
          const res = await fetch(req);
          if (res && res.ok) await cache.put(req, res.clone());
        }
      } catch (_) {}
      done++;
      await postToTargets(clientId, { type: 'CACHE_TILES_PROGRESS', done, total });
    }

    await postToTargets(clientId, { type: (cancelFlags.get(clientId) ? 'CACHE_TILES_CANCELED' : 'CACHE_TILES_DONE'), done, total });
  })());
});
