window.MarketModule = (() => {
  function clamp01(x){ return Math.max(0, Math.min(1, x)); }

  function airportDemandIndex(airport){
    // tier -> demanda (mega > hub > mid)
    const t = airport.tier || "mid";
    if(t==="mega") return 1.00;
    if(t==="hub") return 0.80;
    return 0.55;
  }

  function baselineFare(distKm){
    // tarifa "justa" para ocupação neutra (escala BRL)
    // curta mais cara por km, longa mais barata por km
    const perKm = distKm < 800 ? 1.4 : distKm < 3000 ? 0.9 : 0.65;
    return Math.max(120, Math.round(distKm * perKm));
  }

  function priceEffect(price, baseline){
    // acima do baseline reduz ocupação; abaixo aumenta um pouco
    const delta = (price - baseline) / Math.max(1, baseline);
    const sens = 0.55;
    // delta 0.2 => -11%; delta -0.2 => +7%
    return clamp01(1 - sens*delta);
  }

  function competitionFactor(state, from, to){
    const comps = state.market?.competitors || [];
    let n = 0;
    for(const c of comps){
      n += c.routes.filter(r => r.active && ((r.from===from && r.to===to) || (r.from===to && r.to===from))).length;
    }
    // cada concorrente na rota reduz ocupação em ~12% (com piso)
    return clamp01(1 - 0.12*n);
  }

  function routeDemandMultiplier(state, from, to){
    const A = state.airports.find(a=>a.code===from);
    const B = state.airports.find(a=>a.code===to);
    if(!A||!B) return 0.6;
    const base = (airportDemandIndex(A) + airportDemandIndex(B)) / 2;
    const global = state.market?.demandMult01 ?? 1;
    return clamp01(base * global);
  }

  return {
    baselineFare,
    priceEffect,
    competitionFactor,
    routeDemandMultiplier,
    airportDemandIndex
  };
})();