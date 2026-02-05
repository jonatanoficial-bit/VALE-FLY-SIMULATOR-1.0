window.AICompaniesModule = (() => {
  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function clamp01(x){ return Math.max(0, Math.min(1, x)); }

  function init(state){
    state.market ||= {};
    state.market.competitors ||= [];
    // seed inicial de rotas rivais (só uma vez)
    if(state.market._seeded) return;
    const airports = state.airports || [];
    const hubs = airports.filter(a => (a.tier==="mega" || a.tier==="hub"));
    for(const c of state.market.competitors){
      c.routes ||= [];
      for(let i=0;i<2;i++){
        const A = rand(hubs); const B = rand(hubs.filter(x=>x.code!==A.code));
        c.routes.push({ id: c.id+"_"+Math.random().toString(16).slice(2,6).toUpperCase(), from:A.code, to:B.code, active:true });
      }
    }
    state.market._seeded = true;
  }

  function step(state){
    const comps = state.market?.competitors || [];
    const airports = state.airports || [];
    const hubs = airports.filter(a => (a.tier==="mega" || a.tier==="hub"));
    for(const c of comps){
      c.routes ||= [];
      // chance de abrir rota nova a cada dia (controlada)
      const pOpen = 0.07;
      if(Math.random() < pOpen && hubs.length>=2){
        const A = rand(hubs); const B = rand(hubs.filter(x=>x.code!==A.code));
        const exists = c.routes.some(r => (r.from===A.code && r.to===B.code) || (r.from===B.code && r.to===A.code));
        if(!exists){
          c.routes.push({ id: c.id+"_"+Math.random().toString(16).slice(2,6).toUpperCase(), from:A.code, to:B.code, active:true });
        }
      }
      // pequena variação de reputação do rival
      c.reputation01 = clamp01((c.reputation01 ?? 0.5) + (Math.random()-0.5)*0.01);
    }
  }

  return { init, step };
})();