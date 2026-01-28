(function(){
  // Load state
  const loaded = FlySimStore.load();
  window.flightData = loaded || JSON.parse(JSON.stringify(window.DEFAULT_GAME_STATE));
  window.gameState = window.flightData;

  // Make sure nested keys exist (forward-compat)
  window.flightData.company ||= { cash: 0, reputation01: 0.5, day: 1 };
  window.flightData.airports ||= [];
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
