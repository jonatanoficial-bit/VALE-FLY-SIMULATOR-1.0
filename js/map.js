window.MapModule = (() => {
  let map;
  let airportLayer;
  let routeLayer;

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

    render();

    window.addEventListener("game-updated", render);
  }

  function render(){
    if(!window.flightData || !map) return;
    const d = window.flightData;

    airportLayer.clearLayers();
    routeLayer.clearLayers();

    // Airports
    for (const a of d.airports){
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
    }
  }

  return { init, render };
})();
