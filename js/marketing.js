(function(){
  const CAMPAIGNS = [
    { id:"brand_awareness", name:"Reconhecimento de Marca", desc:"Aumenta reputação lentamente.", repPerDay01: 0.002, durationDays: null },
    { id:"route_promo", name:"Promoção de Rotas", desc:"Aumenta ocupação por 7 dias.", loadBonus01: 0.05, durationDays: 7 },
    { id:"loyalty", name:"Programa de Milhas", desc:"Aumenta ocupação geral contínua.", loadBonus01: 0.02, durationDays: null }
  ];

  function ensure(state){
    state.marketing = state.marketing || { dailyBudget: 0, active: {} };
    return state;
  }
  function list(){ return CAMPAIGNS.slice(); }

  function setDailyBudget(state, amount){
    ensure(state);
    state.marketing.dailyBudget = Math.max(0, Math.round(Number(amount||0)));
  }

  function activate(state, id){
    ensure(state);
    const c = CAMPAIGNS.find(x=>x.id===id);
    if(!c) throw new Error("Campanha inválida");
    state.marketing.active[id] = state.marketing.active[id] || { remainingDays: c.durationDays };
    return c;
  }

  function tickDay(state, notes){
    ensure(state);
    notes = notes || [];
    const b = state.marketing.dailyBudget || 0;
    if(b > 0){
      if(state.company.cash >= b){
        state.company.cash -= b;
        notes.push(`Marketing: -${fmtCash(b)} (orçamento diário)`);
      } else {
        notes.push("Marketing: orçamento não executado (caixa insuficiente).");
        state.marketing.dailyBudget = 0;
      }
    }
    for(const [id, obj] of Object.entries(state.marketing.active||{})){
      if(obj.remainingDays===null || obj.remainingDays===undefined) continue;
      obj.remainingDays -= 1;
      if(obj.remainingDays <= 0) delete state.marketing.active[id];
    }
  }

  function getLoadBonus01(state){
    ensure(state);
    let bonus = 0;
    for(const id of Object.keys(state.marketing.active||{})){
      const c = CAMPAIGNS.find(x=>x.id===id);
      if(c?.loadBonus01) bonus += c.loadBonus01;
    }
    return bonus;
  }

  function getRepPerDay01(state){
    ensure(state);
    let rep = 0;
    for(const id of Object.keys(state.marketing.active||{})){
      const c = CAMPAIGNS.find(x=>x.id===id);
      if(c?.repPerDay01) rep += c.repPerDay01;
    }
    return rep;
  }

  function fmtCash(n){
    try { return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n); }
    catch { return "R$ "+Math.round(n); }
  }

  window.MarketingModule = { ensure, list, setDailyBudget, activate, tickDay, getLoadBonus01, getRepPerDay01 };
})();
