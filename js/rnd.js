(function(){
  const TECHS = [
    { id:"fuel_opt", name:"Otimização de Combustível", desc:"Reduz custo de combustível em 6%.", cost: 80000000, effect:{ fuelMult: 0.94 } },
    { id:"maint_proc", name:"Processo de Manutenção", desc:"Reduz custo de manutenção em 8%.", cost: 60000000, effect:{ maintMult: 0.92 } },
    { id:"ops_analytics", name:"Analytics Operacional", desc:"Aumenta ocupação em +3% em todas as rotas.", cost: 90000000, effect:{ loadBonus01: 0.03 } },
    { id:"green_ops", name:"Operação Verde", desc:"+2% reputação e -3% combustível.", cost: 120000000, effect:{ repBonus01: 0.02, fuelMult: 0.97 } },
    { id:"wide_cert", name:"Certificação Widebody", desc:"Desbloqueia widebodies antes.", cost: 140000000, effect:{ unlockModel:"W1" } }
  ];

  function ensure(state){
    state.rd = state.rd || { owned:{}, fuelMult:1, maintMult:1, loadBonus01:0, repBonus01:0 };
    return state;
  }
  function listTechs(){ return TECHS.slice(); }

  function buyTech(state, techId){
    ensure(state);
    const t = TECHS.find(x=>x.id===techId);
    if(!t) throw new Error("Tecnologia inválida");
    if(state.rd.owned[techId]) throw new Error("Já pesquisada");
    if(state.company.cash < t.cost) throw new Error("Caixa insuficiente");
    state.company.cash -= t.cost;
    state.rd.owned[techId] = true;

    const e = t.effect || {};
    if(e.fuelMult) state.rd.fuelMult *= e.fuelMult;
    if(e.maintMult) state.rd.maintMult *= e.maintMult;
    if(e.loadBonus01) state.rd.loadBonus01 += e.loadBonus01;
    if(e.repBonus01) state.rd.repBonus01 += e.repBonus01;

    if(e.unlockModel){
      state.progress = state.progress || { unlockedModels:[], unlockedTiers:["mid"], level:1, xp:0 };
      state.progress.unlockedModels = state.progress.unlockedModels || [];
      if(!state.progress.unlockedModels.includes(e.unlockModel)) state.progress.unlockedModels.push(e.unlockModel);
    }
    return t;
  }

  window.RnDModule = { ensure, listTechs, buyTech };
})();
