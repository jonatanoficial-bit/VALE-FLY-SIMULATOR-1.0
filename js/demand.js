// Demand & Pricing Engine (Stage 6.1)
// BUILD_2026-02-21_STAGE6_01
// Generated: 2026-02-21 13:17:10
// Goal: realistic-but-light demand model for mobile-first tycoon.

(function(){
  function clamp01(x){ return Math.max(0, Math.min(1, x)); }
  function lerp(a,b,t){ return a+(b-a)*t; }

  function baselineFare(distKm){
    // BRL baseline (tunable): base + per-km with diminishing returns for long-haul
    const d = Math.max(80, distKm||0);
    const perKm = d < 1200 ? 1.05 : (d < 5000 ? 0.92 : 0.80);
    return Math.round(120 + d*perKm);
  }

  function airportDemandScore(a){
    // 0..1 (uses tier/runway/heuristics)
    if(!a) return 0.35;
    const tier = a.tier || "major";
    const runway = a.runwayM || 2200;
    const tierScore = tier==="mega" ? 1.0 : (tier==="major" ? 0.72 : (tier==="regional" ? 0.48 : 0.38));
    const runwayScore = clamp01((runway-1200)/3200); // 0..1
    return clamp01(0.55*tierScore + 0.45*runwayScore);
  }

  function priceEffect(price, base){
    // price vs baseline influences demand (elasticity)
    const p = Math.max(1, price||base||1);
    const b = Math.max(1, base||p);
    const ratio = p/b; // 1 = baseline
    // ratio 1.0 => 1.0; 1.5 => ~0.55; 0.7 => ~1.18
    const eff = 1 / (1 + Math.pow(ratio, 2.2));
    return clamp01(lerp(1.25, 0.35, 1-eff));
  }

  function competitionFactor(state, from, to){
    try{ return window.MarketModule?.competitionFactor?.(state, from, to) ?? 1.0; }catch(_){}
    return 1.0;
  }

  function routeDemandMultiplier(state, from, to){
    const a = state.airports?.find(x=>x.code===from);
    const b = state.airports?.find(x=>x.code===to);
    const score = (airportDemandScore(a)+airportDemandScore(b))/2;
    const mkt = (state.company?.marketing01 ?? 0.35);
    const season = (state.market?.season01 ?? 0.5);
    return clamp01(0.35 + score*0.55 + mkt*0.20 + (season-0.5)*0.10);
  }

  function loadFactor(state, distKm, price, from, to){
    const rep = state.company?.reputation01 ?? 0.5;
    const repFactor = 0.55 + rep*0.60; // 0.55..1.15
    const base = baselineFare(distKm);
    const pe = priceEffect(price, base);
    const dm = routeDemandMultiplier(state, from, to);
    const comp = competitionFactor(state, from, to);

    const distPenalty = Math.min(0.20, (distKm||0)/17000);
    const lf = (0.60 * repFactor) * dm * pe * comp;
    return clamp01(lf - distPenalty);
  }

  window.DemandModule = {
    baselineFare,
    airportDemandScore,
    routeDemandMultiplier,
    priceEffect,
    loadFactor
  };
})();
