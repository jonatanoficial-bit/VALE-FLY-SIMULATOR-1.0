const CACHE = "flysim-cache-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/store.js",
  "./js/data.js",
  "./js/economy.js",
  "./js/map.js",
  "./js/ui.build_2026-02-05_hotfix2.js','js/hubs.js','js/progression.js','js/alliances.js','js/marketing.js','js/rnd.js",
  "./js/game.js",
  "./js/bootstrap.js",
  "./assets/images/logo.png",
  "./assets/images/map_bg.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Somente GET
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        // Cache somente mesma origem
        try {
          const url = new URL(req.url);
          if (url.origin === self.location.origin) {
            const copy = resp.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
        } catch (_) {}
        return resp;
      }).catch(() => {
        // fallback: se pedir uma página, devolve index
        if (req.headers.get("accept")?.includes("text/html")) {
          return caches.match("./index.html");
        }
      });
    })
  );
});
