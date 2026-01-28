// Offline-first map renderer (Part 3)
// - Default: lightweight offline image map (map_bg.png) + airports + routes.
// - Optional: "Mapa realista" using OSM tiles (online) with Service Worker caching.
//   After caching a region ("pacote de mapa"), it keeps working offline.

window.FlySimMapCanvas = (() => {
  const BG_SRC = 'assets/images/map_bg.png';

  // OSM tile template (public). For production, consider your own tile server.
  const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  const TILE_SIZE = 256;
  const MAX_LAT = 85.05112878;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ---------- Equirectangular helpers (background image mode) ----------
  function lonLatToWorldPxEquirect(lon, lat, w, h) {
    const x = (lon + 180) / 360 * w;
    const y = (90 - lat) / 180 * h;
    return { x, y };
  }

  // ---------- WebMercator helpers (tile mode) ----------
  function lonLatToWorldPxMercator(lon, lat, z) {
    lat = clamp(lat, -MAX_LAT, MAX_LAT);
    const s = Math.sin(lat * Math.PI / 180);
    const n = Math.pow(2, z) * TILE_SIZE;
    const x = (lon + 180) / 360 * n;
    const y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n;
    return { x, y, n };
  }

  function tileXYForLonLat(lon, lat, z) {
    lat = clamp(lat, -MAX_LAT, MAX_LAT);
    const x = Math.floor((lon + 180) / 360 * Math.pow(2, z));
    const rad = lat * Math.PI / 180;
    const y = Math.floor((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * Math.pow(2, z));
    return { x, y };
  }

  function urlForTile(z, x, y) {
    return TILE_URL.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));
  }

  class TileCache {
    constructor() {
      this.map = new Map(); // key => {img, ok}
    }
    key(z, x, y) { return `${z}/${x}/${y}`; }
    get(z, x, y) { return this.map.get(this.key(z, x, y)); }
    set(z, x, y, v) { this.map.set(this.key(z, x, y), v); }
  }

  class MapView {
    constructor(canvas, airportsByIata, getState) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.airportsByIata = airportsByIata;
      this.getState = getState;

      // background image
      this.bg = new Image();
      this.bgLoaded = false;
      this.bg.onload = () => { this.bgLoaded = true; this.fitToScreen(); this.render(); };
      this.bg.src = BG_SRC;

      // view state
      this.panX = 0; // used in image mode
      this.panY = 0;
      this.zoom = 1; // used in image mode

      // tile mode state (mercator)
      this.useTiles = false;
      this.tileZoom = 2.2; // fractional zoom
      this.center = { lon: 0, lat: 0 };

      this.minZoom = 0.6;
      this.maxZoom = 5.2;

      this._raf = null;
      this._pointer = { down: false, id: null, x: 0, y: 0 };
      this._tileCache = new TileCache();

      this._bindEvents();
      window.addEventListener('resize', () => this.resize());
      this.resize();
    }

    setUseTiles(v) {
      this.useTiles = !!v;
      // reset view to something reasonable
      if (this.useTiles) {
        this.center = { lon: 0, lat: 0 };
        this.tileZoom = 2.2;
      } else {
        this.fitToScreen();
      }
      this.render();
    }

    resize() {
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = Math.floor(rect.width * dpr);
      this.canvas.height = Math.floor(rect.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.render();
    }

    fitToScreen() {
      if (!this.bgLoaded) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = rect.width / this.bg.width;
      const scaleY = rect.height / this.bg.height;
      this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, Math.min(scaleX, scaleY)));
      this.panX = (rect.width - this.bg.width * this.zoom) / 2;
      this.panY = (rect.height - this.bg.height * this.zoom) / 2;
    }

    scheduleRender() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this.render();
      });
    }

    _bindEvents() {
      const c = this.canvas;

      // wheel zoom (PC)
      c.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = c.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const delta = Math.sign(e.deltaY);

        if (this.useTiles) {
          const prev = this.tileZoom;
          const next = clamp(prev + (delta > 0 ? -0.2 : 0.2), 1.2, this.maxZoom);
          // keep mouse world position stable
          const baseZ = Math.floor(prev);
          const prevScale = Math.pow(2, prev - baseZ);
          const cworldPrev = lonLatToWorldPxMercator(this.center.lon, this.center.lat, baseZ);
          const w = rect.width, h = rect.height;
          const topLeftPrev = { x: cworldPrev.x - (w / 2) / prevScale, y: cworldPrev.y - (h / 2) / prevScale };
          const mouseWorld = { x: topLeftPrev.x + mx / prevScale, y: topLeftPrev.y + my / prevScale };

          const baseZ2 = Math.floor(next);
          const nextScale = Math.pow(2, next - baseZ2);
          // estimate new center by shifting so mouseWorld stays under cursor (approx)
          // Convert mouseWorld from old baseZ to lon/lat then to new baseZ2
          const lonlat = this._worldPxToLonLat(mouseWorld.x, mouseWorld.y, baseZ);
          const cworldNew = lonLatToWorldPxMercator(lonlat.lon, lonlat.lat, baseZ2);
          // compute new center world px so that mouseWorld aligns
          const topLeftNew = { x: cworldNew.x - mx / nextScale, y: cworldNew.y - my / nextScale };
          const centerWorldNew = { x: topLeftNew.x + (w / 2) / nextScale, y: topLeftNew.y + (h / 2) / nextScale };
          const centerLonLat = this._worldPxToLonLat(centerWorldNew.x, centerWorldNew.y, baseZ2);

          this.center = centerLonLat;
          this.tileZoom = next;
          this.scheduleRender();
          return;
        }

        const prevZoom = this.zoom;
        const zoomFactor = delta > 0 ? 0.9 : 1.1;
        const nextZoom = clamp(prevZoom * zoomFactor, this.minZoom, this.maxZoom);
        const wx = (mx - this.panX) / prevZoom;
        const wy = (my - this.panY) / prevZoom;
        this.zoom = nextZoom;
        this.panX = mx - wx * nextZoom;
        this.panY = my - wy * nextZoom;
        this.scheduleRender();
      }, { passive: false });

      // pointer pan (mouse + touch)
      c.addEventListener('pointerdown', (e) => {
        c.setPointerCapture(e.pointerId);
        this._pointer = { down: true, id: e.pointerId, x: e.clientX, y: e.clientY };
      });

      c.addEventListener('pointermove', (e) => {
        if (!this._pointer.down || this._pointer.id !== e.pointerId) return;
        const dx = e.clientX - this._pointer.x;
        const dy = e.clientY - this._pointer.y;
        this._pointer.x = e.clientX;
        this._pointer.y = e.clientY;

        if (this.useTiles) {
          // pan changes center in mercator pixels
          const rect = c.getBoundingClientRect();
          const baseZ = Math.floor(this.tileZoom);
          const scale = Math.pow(2, this.tileZoom - baseZ);
          const cworld = lonLatToWorldPxMercator(this.center.lon, this.center.lat, baseZ);
          const newCenterWorld = { x: cworld.x - dx / scale, y: cworld.y - dy / scale };
          this.center = this._worldPxToLonLat(newCenterWorld.x, newCenterWorld.y, baseZ);
          this.scheduleRender();
          return;
        }

        this.panX += dx;
        this.panY += dy;
        this.scheduleRender();
      });

      c.addEventListener('pointerup', (e) => {
        this._pointer.down = false;
        try { c.releasePointerCapture(e.pointerId); } catch (_) {}
      });
      c.addEventListener('pointercancel', () => { this._pointer.down = false; });
    }

    _worldPxToLonLat(x, y, z) {
      const n = Math.pow(2, z) * TILE_SIZE;
      const lon = (x / n) * 360 - 180;
      const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
      const lat = latRad * 180 / Math.PI;
      return { lon, lat };
    }

    render() {
      const ctx = this.ctx;
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      if (this.useTiles) {
        this._renderTiles(w, h);
      } else {
        this._renderImage(w, h);
      }
    }

    _renderImage(w, h) {
      const ctx = this.ctx;

      // background
      if (this.bgLoaded) {
        ctx.drawImage(this.bg, this.panX, this.panY, this.bg.width * this.zoom, this.bg.height * this.zoom);
      } else {
        ctx.fillStyle = '#081028';
        ctx.fillRect(0, 0, w, h);
      }

      // routes + airports
      this._drawRoutesEquirect();
      this._drawAirportsEquirect();
      this._drawHint('Offline • mapa básico');
    }

    _drawRoutesEquirect() {
      const ctx = this.ctx;
      const st = this.getState();
      const routes = (st.routes && st.routes.items) ? st.routes.items : [];
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(56,189,248,0.9)';

      for (const r of routes) {
        const a = this.airportsByIata.get(r.from);
        const b = this.airportsByIata.get(r.to);
        if (!a || !b) continue;

        const pa = lonLatToWorldPxEquirect(a.lon, a.lat, this.bg.width, this.bg.height);
        const pb = lonLatToWorldPxEquirect(b.lon, b.lat, this.bg.width, this.bg.height);

        const ax = this.panX + pa.x * this.zoom;
        const ay = this.panY + pa.y * this.zoom;
        const bx = this.panX + pb.x * this.zoom;
        const by = this.panY + pb.y * this.zoom;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      ctx.restore();
    }

    _drawAirportsEquirect() {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';

      for (const [iata, a] of this.airportsByIata.entries()) {
        const p = lonLatToWorldPxEquirect(a.lon, a.lat, this.bg.width, this.bg.height);
        const x = this.panX + p.x * this.zoom;
        const y = this.panY + p.y * this.zoom;
        const r = 2.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    _renderTiles(w, h) {
      const ctx = this.ctx;

      // always paint fallback background first
      if (this.bgLoaded) {
        // center background roughly according to lon/lat
        const p = lonLatToWorldPxEquirect(this.center.lon, this.center.lat, this.bg.width, this.bg.height);
        const imgCenterX = p.x * this.zoom;
        const imgCenterY = p.y * this.zoom;
        const panX = (w/2) - imgCenterX;
        const panY = (h/2) - imgCenterY;
        ctx.globalAlpha = 0.55;
        ctx.drawImage(this.bg, panX, panY, this.bg.width * this.zoom, this.bg.height * this.zoom);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = '#081028';
        ctx.fillRect(0, 0, w, h);
      }

      const z = Math.floor(this.tileZoom);
      const scale = Math.pow(2, this.tileZoom - z);
      const world = lonLatToWorldPxMercator(this.center.lon, this.center.lat, z);

      const topLeftX = world.x - (w / 2) / scale;
      const topLeftY = world.y - (h / 2) / scale;

      const nTiles = Math.pow(2, z);

      const x0 = Math.floor(topLeftX / TILE_SIZE);
      const y0 = Math.floor(topLeftY / TILE_SIZE);
      const x1 = Math.floor((topLeftX + (w / scale)) / TILE_SIZE);
      const y1 = Math.floor((topLeftY + (h / scale)) / TILE_SIZE);

      for (let ty = y0; ty <= y1; ty++) {
        if (ty < 0 || ty >= nTiles) continue; // no wrap vertically
        for (let tx = x0; tx <= x1; tx++) {
          const wrappedX = ((tx % nTiles) + nTiles) % nTiles;
          const url = urlForTile(z, wrappedX, ty);
          const sx = (tx * TILE_SIZE - topLeftX) * scale;
          const sy = (ty * TILE_SIZE - topLeftY) * scale;
          const sw = TILE_SIZE * scale;
          const sh = TILE_SIZE * scale;

          const cached = this._tileCache.get(z, wrappedX, ty);
          if (cached && cached.ok && cached.img) {
            ctx.drawImage(cached.img, sx, sy, sw, sh);
            continue;
          }

          // draw placeholder (subtle)
          ctx.fillStyle = 'rgba(255,255,255,0.02)';
          ctx.fillRect(sx, sy, sw, sh);

          // request image (browser + SW will cache)
          if (!cached) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => { this._tileCache.set(z, wrappedX, ty, { ok: true, img }); this.scheduleRender(); };
            img.onerror = () => { this._tileCache.set(z, wrappedX, ty, { ok: false, img: null }); };
            img.src = url;
            this._tileCache.set(z, wrappedX, ty, { ok: false, img: null });
          }
        }
      }

      this._drawRoutesMercator(topLeftX, topLeftY, z, scale);
      this._drawAirportsMercator(topLeftX, topLeftY, z, scale);
      this._drawHint('Mapa realista • online/cached');
    }

    _drawAirportsMercator(topLeftX, topLeftY, z, scale) {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      for (const a of this.airportsByIata.values()) {
        const p = lonLatToWorldPxMercator(a.lon, a.lat, z);
        const x = (p.x - topLeftX) * scale;
        const y = (p.y - topLeftY) * scale;
        ctx.beginPath();
        ctx.arc(x, y, 2.3, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }

    _drawRoutesMercator(topLeftX, topLeftY, z, scale) {
      const ctx = this.ctx;
      const st = this.getState();
      const routes = (st.routes && st.routes.items) ? st.routes.items : [];
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(56,189,248,0.9)';

      for (const r of routes) {
        const a = this.airportsByIata.get(r.from);
        const b = this.airportsByIata.get(r.to);
        if (!a || !b) continue;

        const pa = lonLatToWorldPxMercator(a.lon, a.lat, z);
        const pb = lonLatToWorldPxMercator(b.lon, b.lat, z);
        const ax = (pa.x - topLeftX) * scale;
        const ay = (pa.y - topLeftY) * scale;
        const bx = (pb.x - topLeftX) * scale;
        const by = (pb.y - topLeftY) * scale;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      ctx.restore();
    }

    _drawHint(text) {
      const ctx = this.ctx;
      const rect = this.canvas.getBoundingClientRect();
      ctx.save();
      ctx.font = '12px system-ui';
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(10, rect.height - 30, 190, 20);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillText(text, 18, rect.height - 16);
      ctx.restore();
    }
  }

  // ---------- Map pack helper (tile list generation) ----------
  function tilesForBBox(bbox, zMin, zMax) {
    const { minLon, minLat, maxLon, maxLat } = bbox;
    const urls = [];
    for (let z = zMin; z <= zMax; z++) {
      const a = tileXYForLonLat(minLon, maxLat, z);
      const b = tileXYForLonLat(maxLon, minLat, z);
      const x0 = Math.min(a.x, b.x);
      const x1 = Math.max(a.x, b.x);
      const y0 = Math.min(a.y, b.y);
      const y1 = Math.max(a.y, b.y);
      const n = Math.pow(2, z);
      for (let x = x0; x <= x1; x++) {
        const wx = ((x % n) + n) % n;
        for (let y = y0; y <= y1; y++) {
          if (y < 0 || y >= n) continue;
          urls.push(urlForTile(z, wx, y));
        }
      }
    }
    return urls;
  }

  return { MapView, tilesForBBox };
})();
