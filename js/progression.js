// Progressão (Carreira): níveis, XP, desbloqueios e objetivos simples.
(function(){
  const LEVEL_XP = [0, 250, 700, 1400, 2400, 3800, 5600, 7800, 10400, 13400, 17000];

  function ensure(state){
    state.progress = state.progress || { level: 1, xp: 0, unlockedTiers: ["mid"], unlockedModels: [] };
    if(!state.progress.unlockedTiers?.length) state.progress.unlockedTiers = ["mid"];
    if(state.progress.level < 1) state.progress.level = 1;
    state.hubs = state.hubs || {}; // code -> { level, slotsBonus, demandBonus01 }
    state.objectives = state.objectives || { activeId: "startup", completed: {} };
    return state;
  }

  function xpForLevel(lv){
    if(lv < LEVEL_XP.length) return LEVEL_XP[lv];
    // depois do lvl 10, cresce suavemente
    return LEVEL_XP[LEVEL_XP.length-1] + (lv-10)*4500;
  }

  function applyDayRewards(state, day){
    ensure(state);
    const s = state;
    const p = s.progress;

    // XP por operação e desempenho
    const flights = (day.successFlights || 0);
    const canceled = (day.canceled || 0);
    let xpGain = flights*8 + Math.max(0, Math.round(day.profit/2_000_000));
    xpGain -= canceled*4;
    xpGain = Math.max(0, xpGain);

    p.xp += xpGain;

    // nível
    let leveled = false;
    while(p.xp >= xpForLevel(p.level+1)){
      p.level += 1;
      leveled = true;
    }

    // desbloqueios por nível
    if(p.level >= 2 && !p.unlockedTiers.includes("hub")) p.unlockedTiers.push("hub");
    if(p.level >= 4 && !p.unlockedTiers.includes("mega")) p.unlockedTiers.push("mega");

    // desbloqueios de modelos (por nível)
    // modelIds existentes no catálogo base: TP1, R1, N1, W1, J1 (pode variar)
    if(p.level >= 2) unlockModel(p, "N1");
    if(p.level >= 4) unlockModel(p, "W1");
    if(p.level >= 6) unlockModel(p, "J1");

    // objetivos (modo carreira) – simples e claros
    const obj = evaluateObjectives(s);
    if(obj?.completedNow){
      s.company.cash += obj.rewardCash;
      p.xp += obj.rewardXp;
      s.objectives.completed[obj.id] = true;
      s.lastDay?.notes?.push?.(`Objetivo concluído: ${obj.title} (+${fmtCash(obj.rewardCash)} | +${obj.rewardXp} XP)`);
    }

    if(leveled){
      s.lastDay?.notes?.push?.(`Subiu de nível! Agora você é Nível ${p.level}.`);
    }

    return { xpGain, leveled };
  }

  function unlockModel(progress, modelId){
    progress.unlockedModels = progress.unlockedModels || [];
    if(!progress.unlockedModels.includes(modelId)) progress.unlockedModels.push(modelId);
  }

  function isTierUnlocked(state, tier){
    ensure(state);
    return state.progress.unlockedTiers.includes(tier);
  }

  function isAirportUnlocked(state, airport){
    ensure(state);
    if(state.progress.unlockAllAirports) return true;
    const code = airport.code;
    // Always keep company's hub airports unlocked
    if(state.hubs?.some(h=>h.code===code)) return true;
    return state.progress.unlockedAirports?.includes(code) || false;
  }

  function getAvailableAirports(state){
    ensure(state);
    return state.airports.filter(a => isAirportUnlocked(state, a));
  }

  function isModelUnlocked(state, model){
    ensure(state);
    // turboprop e regional sempre liberados no começo (assumindo TP1/R1)
    const id = model.modelId;
    if(["TP1","R1"].includes(id)) return true;
    return state.progress.unlockedModels?.includes(id) || false;
  }

  function getAvailableModels(state){
    ensure(state);
    return state.aircraftCatalog.filter(m => isModelUnlocked(state, m));
  }

  function evaluateObjectives(state){
    // objetivos simples (pode virar um sistema robusto depois)
    const id = state.objectives?.activeId || "startup";
    if(state.objectives?.completed?.[id]) return null;

    const cash = state.company.cash || 0;
    const rep = state.company.reputation01 || 0;
    const routes = state.routes?.filter(r=>r.active).length || 0;
    const fleet = state.fleet?.length || 0;

    if(id === "startup"){
      const ok = routes >= 3 && fleet >= 2 && rep >= 0.60;
      if(ok) return { id, title:"Primeiro Crescimento", completedNow:true, rewardCash: 25_000_000, rewardXp: 250 };
    }
    if(id === "hub"){
      const hubs = Object.keys(state.hubs||{}).length;
      const ok = hubs >= 1 && routes >= 6 && rep >= 0.65;
      if(ok) return { id, title:"Abrir o Primeiro HUB", completedNow:true, rewardCash: 60_000_000, rewardXp: 600 };
    }
    if(id === "global"){
      const ok = (state.progress?.level||1) >= 6 && routes >= 12 && rep >= 0.72 && cash >= 400_000_000;
      if(ok) return { id, title:"Companhia Global", completedNow:true, rewardCash: 120_000_000, rewardXp: 1200 };
    }
    return null;
  }

  function fmtCash(n){
    try { return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n); }
    catch { return "R$ "+Math.round(n); }
  }

  window.ProgressionModule = {
    ensure,
    xpForLevel,
    applyDayRewards,
    isAirportUnlocked,
    getAvailableAirports,
    getAvailableModels
  };
})();
