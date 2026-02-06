// Vale Fly Simulator 1.0 — Service Worker (Offline Cache)
// BUILD_2026-02-06_HF1
// Fix crítico: lista de CORE_ASSETS quebrada estava impedindo o cache do UI e módulos,
// causando falhas offline (e, em alguns aparelhos, o "menu" não abrir por falta de UI carregado).

const CACHE = "flysim-cache-v2"; // bump para invalidar caches antigos (v1)
const CORE_ASSETS = [
  "./",
  "./index.html",

  "./css/app.css",

  "./js/store.js",
  "./js/data.js",
  "./js/economy.js",
  "./js/market.js",
  "./js/events.js",
  "./js/ai_companies.js",
  "./js/map.js",
  "./js/hubs.js",
  "./js/progression.js",
  "./js/rnd.js",
  "./js/marketing.js",
  "./js/alliances.js",
  "./js/ui.build_2026-02-05_hotfix2.js",
  "./js/game.js",
  "./js/bootstrap.js",
  "./js/sound.js",
  "./js/reports.js",

  "./assets/images/logo.png",
  "./assets/images/map_bg.png",
  "./assets/images/cover.png",
  "./favicon.ico",
  "./manifest.webmanifest",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : Promise.resolve(true))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((resp) => {
          // Cache somente mesma origem
          try {
            const url = new URL(req.url);
            if (url.origin === self.location.origin) {
              const copy = resp.clone();
              caches.open(CACHE).then((cache) => cache.put(req, copy));
            }
          } catch (_) {}
          return resp;
        })
        .catch(() => {
          // fallback: se pedir uma página, devolve index
          if (req.headers.get("accept")?.includes("text/html")) {
            return caches.match("./index.html");
          }
        });
    })
  );
});
