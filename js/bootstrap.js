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
      if(!resp.ok) throw new Error("airports_extra.json não encontrado");
      const j = await resp.json();
      const extra = Array.isArray(j.airports) ? j.airports : [];
      if(!extra.length) return;

      // ✅ Merge no estado principal do jogo (save)
      const state = window.gameState || window.DEFAULT_GAME_STATE;
      if(state){
        state.airports = Array.isArray(state.airports) ? state.airports : [];
        const map = new Map(state.airports.map(a => [a.code, a]));
        for(const ap of extra){
          if(ap && ap.code && !map.has(ap.code)){
            map.set(ap.code, ap);
          }
        }
        state.airports = Array.from(map.values());
        try{ FlySimStore.save(state); }catch(_){}
      }

      // ✅ Mantém também em flightData (usado por módulos de mapa/UI)
      window.flightData.airports = Array.isArray(window.flightData.airports) ? window.flightData.airports : [];
      const map2 = new Map(window.flightData.airports.map(a => [a.code, a]));
      for(const ap of extra){
        if(ap && ap.code && !map2.has(ap.code)){
          map2.set(ap.code, ap);
        }
      }
      window.flightData.airports = Array.from(map2.values());

      try{ window.dispatchEvent(new Event("game-updated")); }catch(_){}
      try{ window.MapModule?.render?.(); }catch(_){}
    }catch(e){
      console.warn("Falha ao carregar/mesclar airports_extra:", e);
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
