window.EventsModule = (() => {
  const EVENTS = [
    { id:"FUEL_SPIKE",   name:"Alta do Combustível", kind:"fuel",   weight: 0.20, effect:(s)=>{ s.market.fuelPricePerUnit *= 1.18; return "Combustível +18%"; } },
    { id:"FUEL_DROP",    name:"Queda do Combustível",kind:"fuel",   weight: 0.14, effect:(s)=>{ s.market.fuelPricePerUnit *= 0.90; return "Combustível -10%"; } },
    { id:"TOURISM_BOOM", name:"Alta Temporada",      kind:"demand", weight: 0.18, effect:(s)=>{ s.market.demandMult01 *= 1.12; return "Demanda +12%"; } },
    { id:"LOW_SEASON",   name:"Baixa Temporada",     kind:"demand", weight: 0.16, effect:(s)=>{ s.market.demandMult01 *= 0.90; return "Demanda -10%"; } },
    { id:"NONE",         name:"Dia Normal",          kind:"none",   weight: 0.32, effect:(s)=>{ return "Sem eventos relevantes"; } },
  ];

  function pick(){
    const total = EVENTS.reduce((a,e)=>a+e.weight,0);
    let r = Math.random()*total;
    for(const e of EVENTS){
      r -= e.weight;
      if(r<=0) return e;
    }
    return EVENTS[EVENTS.length-1];
  }

  function applyDaily(state){
    state.market ||= { demandMult01:1, fuelPricePerUnit:4200, competitors:[] };
    // reset leve (evita drift infinito)
    state.market.demandMult01 = Math.max(0.75, Math.min(1.25, state.market.demandMult01));
    state.market.fuelPricePerUnit = Math.max(2800, Math.min(6500, state.market.fuelPricePerUnit));

    const ev = pick();
    const note = ev.effect(state);
    state.market.lastEvent = { id: ev.id, name: ev.name, note };
    return state.market.lastEvent;
  }

  return { applyDaily };
})();