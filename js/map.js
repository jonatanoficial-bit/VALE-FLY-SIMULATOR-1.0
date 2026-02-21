window.MapModule = (() => {
  let map;
  let airportLayer;
  let routeLayer;
  let planeLayer;
  let anims = [];
  let raf = null;

  function init(){
    map = L.map("map", { zoomControl: true }).setView([-14,-51],4);

    // Tile layer online (OSM). Se offline, o Leaflet ainda carrega, mas tiles podem falhar.
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
      maxZoom: 18,
      attribution: "© OpenStreetMap"
    });
    tiles.addTo(map);

    // Fallback offline: imagem base (baixa resolução) para nunca ficar tela vazia.
    const img = "assets/images/map_bg.png";
    const bounds = [[-60,-180],[85,180]];
    L.imageOverlay(img, bounds, { opacity: 0.35, interactive: false }).addTo(map);

    airportLayer = L.layerGroup().addTo(map);
    routeLayer = L.layerGroup().addTo(map);
    planeLayer = L.layerGroup().addTo(map);

    render();

    window.addEventListener("game-updated", render);
  }

  
  function createPlaneMarker(latlng){
    const html = `<div class="plane3d"><div class="planeBody"></div></div>`;
    const icon = L.divIcon({ className:"planeIcon", html, iconSize:[28,28], iconAnchor:[14,14] });
    return L.marker(latlng, { icon, interactive:false });
  }

  function bearing(a,b){
    const toRad = d=>d*Math.PI/180;
    const toDeg = r=>r*180/Math.PI;
    const lat1=toRad(a[0]), lon1=toRad(a[1]);
    const lat2=toRad(b[0]), lon2=toRad(b[1]);
    const y=Math.sin(lon2-lon1)*Math.cos(lat2);
    const x=Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
    return (toDeg(Math.atan2(y,x))+360)%360;
  }

  function lerp(a,b,t){ return a + (b-a)*t; }
  function lerpLatLng(A,B,t){ return [lerp(A[0],B[0],t), lerp(A[1],B[1],t)]; }

  function startAnimations(){
    stopAnimations();
    const step = (ts)=>{
      for(const anim of anims){
        const dur = anim.durationMs;
        const t = ((ts - anim.startTs) % dur) / dur;
        // ping-pong for back&forth
        const u = t<0.5 ? (t*2) : (1-(t-0.5)*2);
        const p = lerpLatLng(anim.A, anim.B, u);
        anim.marker.setLatLng(p);

        // rotate icon to bearing
        const brg = bearing(anim.A, anim.B);
        const el = anim.marker.getElement();
        if(el){
          const plane = el.querySelector(".plane3d");
          if(plane) plane.style.transform = `rotate(${brg}deg)`;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  function stopAnimations(){
    if(raf) cancelAnimationFrame(raf);
    raf = null;
    anims = [];
  }

function render(){
    if(!window.flightData || !map) return;
    const d = window.flightData;

    airportLayer.clearLayers();
    routeLayer.clearLayers();
    planeLayer.clearLayers();
    stopAnimations();

    // Airports (scale by zoom to keep performance)
    const z = map.getZoom();
    const showAll = z >= 6;
    const showMajor = z >= 4;

    for (const a of d.airports){
      if(!a || !a.lat || !a.lon) continue;
      const tier = a.tier || "major";
      if(!showAll){
        if(!(tier==="mega" || (showMajor && tier==="major"))) continue;
      }
      const m = L.circleMarker([a.lat,a.lon],{radius:6, weight:1, color:"#ffffff", fillColor:"#2563eb", fillOpacity:0.9});
      m.bindTooltip(`<b>${a.code}</b> — ${a.city}`, { direction: "top" });
      m.addTo(airportLayer);
    }

    // Routes
    for (const r of d.routes){
      const A = d.airports.find(x=>x.code===r.from);
      const B = d.airports.find(x=>x.code===r.to);
      if(!A||!B) continue;
      const line = L.polyline([[A.lat,A.lon],[B.lat,B.lon]],{weight:4, opacity: r.active?0.85:0.3});
      line.bindTooltip(`${r.from} → ${r.to} • ${r.freq}x/dia`, { sticky:true });
      line.addTo(routeLayer);

      if(r.active && (d.flags?.flightsInProgress || r.flying)){
        const marker = createPlaneMarker([A.lat,A.lon]);
        marker.addTo(planeLayer);
        // duration scales with distance but stays within limits
        const dist = Math.max(200, (r.distanceKm || 0));
        const durationMs = Math.max(4500, Math.min(18000, dist * 8));
        anims.push({ marker, A:[A.lat,A.lon], B:[B.lat,B.lon], startTs: performance.now()+Math.random()*1000, durationMs });
      }
    }

    if(anims.length) startAnimations();
  }

  return { init, render };
})();
