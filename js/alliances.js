(function(){
  const ALLIANCES = [
    { id:"codeshare_global", name:"Codeshare Global", desc:"+3% ocupação em rotas internacionais.", cost: 110000000, effect:{ intlLoadBonus01: 0.03 } },
    { id:"airport_fee_deal", name:"Acordo de Taxas", desc:"-10% taxas em aeroportos HUB/MEGA.", cost: 95000000, effect:{ airportFeeMult: 0.90 } },
    { id:"cargo_partner", name:"Parceiro de Carga", desc:"+2% receita em rotas longas.", cost: 85000000, effect:{ longRevenueMult: 1.02 } }
  ];

  function ensure(state){
    state.alliances = state.alliances || { owned:{}, intlLoadBonus01:0, airportFeeMult:1, longRevenueMult:1 };
    return state;
  }
  function list(){ return ALLIANCES.slice(); }

  function buy(state, id){
    ensure(state);
    const a = ALLIANCES.find(x=>x.id===id);
    if(!a) throw new Error("Acordo inválido");
    if(state.alliances.owned[id]) throw new Error("Já adquirido");
    if(state.company.cash < a.cost) throw new Error("Caixa insuficiente");
    state.company.cash -= a.cost;
    state.alliances.owned[id] = true;
    const e = a.effect || {};
    if(e.intlLoadBonus01) state.alliances.intlLoadBonus01 += e.intlLoadBonus01;
    if(e.airportFeeMult) state.alliances.airportFeeMult *= e.airportFeeMult;
    if(e.longRevenueMult) state.alliances.longRevenueMult *= e.longRevenueMult;
    return a;
  }

  window.AlliancesModule = { ensure, list, buy };
})();
