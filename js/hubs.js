// HUBs & Slots: capacidade de aeroportos por dia e upgrades.
(function(){
  const BASE_SLOTS = { mid: 8, hub: 16, mega: 28 }; // slots/dia (por aeroporto, para a cia do jogador)

  function ensure(state){
    state.hubs = state.hubs || {};
    return state;
  }

  function airportSlotsBase(airport){
    const t = airport.tier || "mid";
    return BASE_SLOTS[t] ?? 8;
  }

  function getHub(state, code){
    ensure(state);
    return state.hubs[code] || null;
  }

  function getSlotsForAirport(state, code){
    ensure(state);
    const ap = state.airports.find(a=>a.code===code);
    if(!ap) return 0;
    const base = airportSlotsBase(ap);
    const hub = getHub(state, code);
    const bonus = hub ? hub.slotsBonus : 0;
    return base + bonus;
  }

  function getDemandBonus01(state, code){
    const hub = getHub(state, code);
    return hub ? hub.demandBonus01 : 0;
  }

  function hubCost(ap){
    const t = ap.tier || "mid";
    if(t==="mid") return 60_000_000;
    if(t==="hub") return 120_000_000;
    return 200_000_000;
  }

  function createHub(state, code){
    ensure(state);
    const ap = state.airports.find(a=>a.code===code);
    if(!ap) throw new Error("Aeroporto inválido");
    if(state.hubs[code]) throw new Error("Já é HUB");
    const cost = hubCost(ap);
    if(state.company.cash < cost) throw new Error("Caixa insuficiente");
    state.company.cash -= cost;
    state.hubs[code] = { level: 1, slotsBonus: 6, demandBonus01: 0.06 };
    return state.hubs[code];
  }

  function upgradeHub(state, code){
    ensure(state);
    const hub = state.hubs[code];
    if(!hub) throw new Error("Não é HUB");
    const lv = hub.level || 1;
    if(lv >= 5) throw new Error("HUB no nível máximo");
    const cost = Math.round(45_000_000 * (1.6 ** (lv-1)));
    if(state.company.cash < cost) throw new Error("Caixa insuficiente");
    state.company.cash -= cost;
    hub.level = lv + 1;
    hub.slotsBonus += 4;
    hub.demandBonus01 = Math.min(0.20, (hub.demandBonus01||0.06) + 0.03);
    return { hub, cost };
  }

  window.HubsModule = {
    ensure,
    getSlotsForAirport,
    getDemandBonus01,
    createHub,
    upgradeHub
  };
})();
