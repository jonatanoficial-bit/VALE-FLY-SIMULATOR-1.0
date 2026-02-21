// Vale Fly Simulator 1.0 — Service Worker (Offline Cache)
// BUILD_2026-02-12_STAGE3_02
// Generated: 2026-02-12 15:48:33

const CACHE = "flysim-cache-v14";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/app.css",

  "./js/store.js",
  "./js/data.js",
  "./js/economy.js",
  "./js/market.js",
  "./js/demand.js",
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
  "./js/build_info.js",
    "./js/picker.js",
"./js/ux.js",

  "./assets/images/logo.png",
  "./assets/images/map_bg.png",
  "./assets/images/cover.png",
  "./assets/avatars/player.svg",
  "./assets/aircraft/models/README.txt",
  "./assets/aircraft/models/placeholder.png",

  "./favicon.ico",
  "./manifest.webmanifest",
  "./manifest.json",
  "./BUILD.txt"  "./assets/aircraft/models/placeholder.svg",  "./assets/aircraft/models/A320.png",  "./assets/aircraft/models/A320NEO.png",  "./assets/aircraft/models/A321.png",  "./assets/aircraft/models/B738.png",  "./assets/aircraft/models/B737MAX.png",  "./assets/aircraft/models/E195E2.png",  "./assets/aircraft/models/ATR72.png",  "./assets/aircraft/models/A330.png",  "./assets/aircraft/models/B787.png",










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
          if (req.headers.get("accept")?.includes("text/html")) {
            return caches.match("./index.html");
          }
        });
    })
  );
});
