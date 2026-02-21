(function(){
  // Load state
  const loaded = FlySimStore.load();
  window.flightData = loaded || JSON.parse(JSON.stringify(window.DEFAULT_GAME_STATE));
  window.gameState = window.flightData;

  // Make sure nested keys exist (forward-compat)
  window.flightData.company ||= { cash: 0, reputation01: 0.5, day: 1 };
  window.flightData.airports ||= [];

  // Stage 5 — load extra airports dataset (offline bundled)
  (async ()=>{
    try{
      const resp = await fetch("./assets/data/airports_extra.json", { cache: "no-store" });
      if(!resp.ok) return;
      const j = await resp.json();
      const extra = Array.isArray(j.airports) ? j.airports : [];
      if(!extra.length) return;

      const s = window.gameState || window.flightData;
      s.airports ||= [];
      const existing = new Set(s.airports.map(a=>a.code));
      for(const a of extra){
        if(!a || !a.code) continue;
        if(!existing.has(a.code)){
          s.airports.push(a);
          existing.add(a.code);
        }
      }
      // persist merge once
      FlySimStore.save(s);
      window.dispatchEvent(new Event("game-updated"));
    }catch(e){
      console.warn("extra airports load failed", e);
    }
  })();

  window.flightData.aircraftCatalog ||= [];
  window.flightData.fleet ||= [];
  window.flightData.routes ||= [];
  window.flightData.staff ||= { pilots: 0, crew: 0, mechanics: 0 };
  window.flightData.lastDay ||= { revenue: 0, costs: 0, profit: 0, cancelledFlights: 0 };

  // Init modules
  MapModule.init();
  UIModule.init();
  GameModule.init();

  // Service Worker (offline)
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }

  // Initial render
  window.dispatchEvent(new Event('game-updated'));
})();

try{ window.ProgressionModule?.ensure?.(window.gameState); window.HubsModule?.ensure?.(window.gameState);}catch(_){}

try{ window.RnDModule?.ensure?.(window.gameState); window.MarketingModule?.ensure?.(window.gameState); window.AlliancesModule?.ensure?.(window.gameState);}catch(e){}
