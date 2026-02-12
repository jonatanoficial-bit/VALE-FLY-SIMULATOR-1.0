window.UIModule = (() => {
  let deferredPrompt = null;

  function money(n){
    return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
  }


function aircraftImgTag(modelId){
  // Use PNG or WEBP if available. onerror hides it, keeping UI clean.
  return `<img class="aircraftImg" src="assets/aircraft/models/${modelId}.png" onerror="this.style.display='none'"/>`;
}

  function init(){
    const panel = document.getElementById("panel");
    const menuBtn = document.getElementById("menuBtn");
    const btnInstall = document.getElementById("btnInstall");

    menuBtn.onclick = () => {
      panel.classList.toggle("show");
      panel.setAttribute("aria-hidden", panel.classList.contains("show") ? "false" : "true");
    };

    // Tabs
    document.querySelectorAll(".tab[data-tab]").forEach(btn => {
      btn.onclick = () => setTab(btn.getAttribute("data-tab"));
    });

    // Day advance
    document.getElementById("advanceDayBtn").onclick = () => {
      const res = EconomyModule.advanceDay(window.gameState);
      FlySimStore.save(window.gameState);
      render();
      MapModule.render();
      // feedback rápido
      if(res?.notes?.length){
        console.log("Notas do dia:", res.notes);
      }
    };

    document.getElementById("resetBtn").onclick = () => {
      if(!confirm("Resetar o progresso?")) return;
      window.gameState = structuredClone(window.DEFAULT_GAME_STATE);
      window.flightData = window.gameState;
      FlySimStore.save(window.gameState);
      render();
      MapModule.render();
    };

    // Rotas
    document.getElementById("addRouteBtn").onclick = () => {
      const from = document.getElementById("routeFrom").value;
      const to = document.getElementById("routeTo").value;
      const price = Number(document.getElementById("routePrice").value || 0);
      const freq = Number(document.getElementById("routeFreq").value || 1);
      const aircraftId = document.getElementById("routeAircraft").value;
      if(!from || !to || from===to) return alert("Escolha origem e destino diferentes.");
      if(!aircraftId) return alert("Escolha uma aeronave.");
      if(price < 50) return alert("Preço muito baixo.");

      const ac = window.gameState.fleet.find(a=>a.id===aircraftId);
      const model = window.gameState.aircraftCatalog.find(m=>m.modelId===ac?.modelId);
      if(!ac || !model) return alert("Aeronave inválida.");
      const dist = EconomyModule.distanceKm(window.gameState, from, to);
      if(dist <= 0) return alert("Distância inválida.");
      if(dist > model.rangeKm){
        return alert(`Essa rota tem ~${Math.round(dist)} km e excede o alcance do ${model.name} (${model.rangeKm} km).`);
      }

      // valida se aeronave já está alocada em outra rota ativa
      const busy = window.gameState.routes.some(r => r.active && r.aircraftId === aircraftId);
      if(busy) return alert("Essa aeronave já está alocada em outra rota ativa.");

      const id = "R" + Math.random().toString(16).slice(2,8).toUpperCase();
      window.gameState.routes.push({ id, from, to, price, freq, aircraftId, active: true });
      FlySimStore.save(window.gameState);
      render();
      MapModule.render();
      setTab("routes");
    };

    // Frota comprar
    document.getElementById("buyBtn").onclick = () => {
      const modelId = document.getElementById("buyModel").value;
      const nickname = document.getElementById("buyName").value.trim() || null;
      const model = window.gameState.aircraftCatalog.find(m => m.modelId === modelId);
      if(!model) return alert("Selecione um modelo.");
      if(window.gameState.company.cash < model.price) return alert("Caixa insuficiente.");

      window.gameState.company.cash -= model.price;
      const id = "A" + Math.random().toString(16).slice(2,8).toUpperCase();
      window.gameState.fleet.push({ id, modelId, nickname: nickname || id, condition01: 1, inMaintenanceDays: 0 });
      FlySimStore.save(window.gameState);
      document.getElementById("buyName").value = "";
      render();
      MapModule.render();
      setTab("fleet");
    };

// HUBs
const createHubBtn = document.getElementById("createHubBtn");
if(createHubBtn){
  createHubBtn.onclick = () => {
    const code = document.getElementById("hubAirport").value;
    try{
      window.HubsModule.createHub(window.gameState, code);
      FlySimStore.save(window.gameState);
      render();
      MapModule.render();
      alert(`HUB criado em ${code}!`);
    }catch(err){
      alert(err.message);
    }
  };
}

    // P&D / Marketing / Alianças
const buyTechBtn = document.getElementById("buyTechBtn");
if(buyTechBtn){
  buyTechBtn.onclick = () => {
    const id = document.getElementById("techSelect").value;
    try{
      window.RnDModule.buyTech(window.gameState, id);
      FlySimStore.save(window.gameState);
      render();
      alert("Tecnologia pesquisada!");
    }catch(err){ alert(err.message); }
  };
}

const setMarketingBtn = document.getElementById("setMarketingBtn");
if(setMarketingBtn){
  setMarketingBtn.onclick = () => {
    const v = Number(document.getElementById("marketingBudget").value || 0);
    try{
      window.MarketingModule.setDailyBudget(window.gameState, v);
      FlySimStore.save(window.gameState);
      render();
      alert("Orçamento diário atualizado.");
    }catch(err){ alert(err.message); }
  };
}

const activateCampaignBtn = document.getElementById("activateCampaignBtn");
if(activateCampaignBtn){
  activateCampaignBtn.onclick = () => {
    const id = document.getElementById("campaignSelect").value;
    try{
      window.MarketingModule.activate(window.gameState, id);
      FlySimStore.save(window.gameState);
      render();
      alert("Campanha ativada!");
    }catch(err){ alert(err.message); }
  };
}

const buyAllianceBtn = document.getElementById("buyAllianceBtn");
if(buyAllianceBtn){
  buyAllianceBtn.onclick = () => {
    const id = document.getElementById("allianceSelect").value;
    try{
      window.AlliancesModule.buy(window.gameState, id);
      FlySimStore.save(window.gameState);
      render();
      alert("Acordo adquirido!");
    }catch(err){ alert(err.message); }
  };
}

// Export/Import

    document.getElementById("exportBtn").onclick = () => {
      const blob = new Blob([JSON.stringify(window.gameState, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flysim_save_day${window.gameState.company.day}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    document.getElementById("importFile").addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if(!file) return;
      try{
        const text = await file.text();
        const data = JSON.parse(text);
        if(!data?.company || !data?.airports) throw new Error("Formato inválido");
        window.gameState = data;
        FlySimStore.save(window.gameState);
        render();
        MapModule.render();
        alert("Save importado com sucesso.");
      }catch(err){
        alert("Falha ao importar: " + err.message);
      }finally{
        e.target.value = "";
      }
    });

    // PWA install
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      btnInstall.style.display = "inline-flex";
    });

    btnInstall.onclick = async () => {
      if(!deferredPrompt) return alert("Instalação não disponível agora.");
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      btnInstall.style.display = "none";
    };

    render();
  }

  function setTab(tab){
    document.querySelectorAll(".tab[data-tab]").forEach(b => b.classList.toggle("active", b.getAttribute("data-tab")===tab));
    document.getElementById("tab_overview").classList.toggle("hidden", tab!=="overview");
    document.getElementById("tab_routes").classList.toggle("hidden", tab!=="routes");
    document.getElementById("tab_fleet").classList.toggle("hidden", tab!=="fleet");
    document.getElementById("tab_saves").classList.toggle("hidden", tab!=="saves");
    document.getElementById("tab_hubs").classList.toggle("hidden", tab!=="hubs");
    document.getElementById("tab_career").classList.toggle("hidden", tab!=="career");
    document.getElementById("tab_rnd").classList.toggle("hidden", tab!=="rnd");
    document.getElementById("tab_marketing").classList.toggle("hidden", tab!=="marketing");
    document.getElementById("tab_alliances").classList.toggle("hidden", tab!=="alliances");
  }

  function render(){
    const s = window.gameState;
    document.getElementById("clockText").textContent = s.company.day;
    document.getElementById("cashText").textContent = money(s.company.cash);
    document.getElementById("repText").textContent = Math.round(s.company.reputation01*100) + "%";
    if(document.getElementById("lvlText")){
      const lv = s.progress?.level ?? 1;
      const xp = s.progress?.xp ?? 0;
      document.getElementById("lvlText").textContent = lv;
      document.getElementById("xpText").textContent = xp;
    }

    const ld = s.lastDay || {revenue:0,costs:0,profit:0,canceled:0,notes:[]};
    const notes = (ld.notes && ld.notes.length) ? (ld.notes.map(n=>`\u2022 ${n}`).join("\n")) : "";
    const lastDayText =
      "Ultimo dia:\n" +
      `Receita: ${money(ld.revenue)}\n` +
      `Custos:  ${money(ld.costs)}\n` +
      `Lucro:   ${money(ld.profit)}\n` +
      (ld.canceled ? `Cancelamentos: ${ld.canceled}\n` : "") +
      notes;
    const lastDayEl = document.getElementById("lastDayLog");
    if(lastDayEl) lastDayEl.textContent = lastDayText; 

    // selects
    const airports = (window.ProgressionModule?.getAvailableAirports?.(s) || s.airports).slice().sort((a,b)=>a.code.localeCompare(b.code));
    const setOptions = (sel, opts, valFn, labelFn) => {
      const cur = sel.value;
      sel.innerHTML = opts.map(o => `<option value="${valFn(o)}">${labelFn(o)}</option>`).join("");
      if(cur) sel.value = cur;
    };

    setOptions(document.getElementById("routeFrom"), airports, a=>a.code, a=>`${a.code} — ${a.city} (${a.country||""})`);
    setOptions(document.getElementById("routeTo"), airports, a=>a.code, a=>`${a.code} — ${a.city} (${a.country||""})`);

    // fleet select for routes: only aircraft not in maintenance and not already assigned
    const freeFleet = s.fleet.filter(a => a.inMaintenanceDays<=0);
    const routeAircraft = document.getElementById("routeAircraft");
    routeAircraft.innerHTML = freeFleet.map(a => {
      const model = s.aircraftCatalog.find(m=>m.modelId===a.modelId);
      return `<option value="${a.id}">${a.nickname} (${model?.name || a.modelId})</option>`;
    }).join("");

    // buy select
    const buyModel = document.getElementById("buyModel");
    const availModels = (window.ProgressionModule?.getAvailableModels?.(s) || s.aircraftCatalog);
    buyModel.innerHTML = availModels.map(m => `<option value="${m.modelId}">${m.name} — ${money(m.price)}</option>`).join("");

    // lists
    renderRoutes();
    renderFleet();
    renderHubs();
    renderCareer();
    renderRnD();
    renderMarketing();
    renderAlliances();
  }

  function renderRoutes(){
    const s = window.gameState;
    const el = document.getElementById("routesList");
    if(s.routes.length===0){ el.textContent = "Nenhuma rota."; el.classList.add("muted"); return; }
    el.classList.remove("muted");
    el.innerHTML = s.routes.map(r => {
      const ac = s.fleet.find(a=>a.id===r.aircraftId);
      const model = ac ? s.aircraftCatalog.find(m=>m.modelId===ac.modelId) : null;
      return `
        <div class="item">
          <div>
            <div><b>${r.from} → ${r.to}</b> ${r.active?"":"<span class='muted'>(pausada)</span>"}</div>
            <div class="meta">${r.freq} voos/dia • R$ ${r.price} • Avião: ${ac?.nickname || "—"} (${model?.seats || "?"} assentos)</div>
          </div>
          <div class="row">
            <button class="btn ghost" data-toggle="${r.id}">${r.active?"Pausar":"Ativar"}</button>
            <button class="btn danger" data-del="${r.id}">Excluir</button>
          </div>
        </div>
      `;
    }).join("");

    el.querySelectorAll("[data-toggle]").forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-toggle");
        const r = window.gameState.routes.find(x=>x.id===id);
        r.active = !r.active;
        FlySimStore.save(window.gameState);
        render();
        MapModule.render();
      };
    });
    el.querySelectorAll("[data-del]").forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-del");
        if(!confirm("Excluir rota?")) return;
        window.gameState.routes = window.gameState.routes.filter(x=>x.id!==id);
        FlySimStore.save(window.gameState);
        render();
        MapModule.render();
      };
    });
  }

  function renderFleet(){
    const s = window.gameState;
    const el = document.getElementById("fleetList");
    if(s.fleet.length===0){ el.textContent = "Sem aeronaves."; el.classList.add("muted"); return; }
    el.classList.remove("muted");
    el.innerHTML = s.fleet.map(a => {
      const m = s.aircraftCatalog.find(x=>x.modelId===a.modelId);
      const cond = Math.round(a.condition01*100);
      const maint = a.inMaintenanceDays>0 ? ` • <span class='muted'>Manut.: ${a.inMaintenanceDays}d</span>` : "";
      const resale = Math.round((m.price * 0.6) * (0.4 + 0.6*a.condition01));
      return `
        <div class="item">
          <div>
            <div><b>${a.nickname}</b> <span class="muted">(${m?.name || a.modelId})</span></div>
            <div class="meta">Condição: ${cond}%${maint} • Revenda: ${money(resale)}</div>
          </div>
          <div class="row">
            <button class="btn" data-maint="${a.id}">Manutenção</button>
            <button class="btn danger" data-sell="${a.id}">Vender</button>
          </div>
        </div>
      `;
    }).join("");

    el.querySelectorAll("[data-maint]").forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-maint");
        const a = window.gameState.fleet.find(x=>x.id===id);
        if(a.inMaintenanceDays>0) return alert("Já está em manutenção.");
        a.inMaintenanceDays = 2;
        FlySimStore.save(window.gameState);
        render();
      };
    });

    el.querySelectorAll("[data-sell]").forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-sell");
        const a = window.gameState.fleet.find(x=>x.id===id);
        // não vender se está alocada numa rota ativa
        const used = window.gameState.routes.some(r => r.active && r.aircraftId === id);
        if(used) return alert("Remova/pausa a rota antes de vender esta aeronave.");
        const m = window.gameState.aircraftCatalog.find(x=>x.modelId===a.modelId);
        const resale = Math.round((m.price * 0.6) * (0.4 + 0.6*a.condition01));
        if(!confirm(`Vender ${a.nickname} por ${money(resale)}?`)) return;
        window.gameState.company.cash += resale;
        window.gameState.fleet = window.gameState.fleet.filter(x=>x.id!==id);
        FlySimStore.save(window.gameState);
        render();
        MapModule.render();
      };
    });
  }


function renderHubs(){
  const s = window.gameState;
  const list = document.getElementById("hubsList");
  const sel = document.getElementById("hubAirport");
  if(!list || !sel) return;

  // dropdown: apenas aeroportos desbloqueados
  const airports = (window.ProgressionModule?.getAvailableAirports?.(s) || s.airports).slice().sort((a,b)=>a.code.localeCompare(b.code));
  sel.innerHTML = airports.map(a=>`<option value="${a.code}">${a.code} — ${a.city} (${a.country||""})</option>`).join("");

  const hubs = s.hubs || {};
  const hubCodes = Object.keys(hubs);
  if(hubCodes.length===0){
    list.textContent = "Nenhum HUB.";
    list.classList.add("muted");
    return;
  }
  list.classList.remove("muted");
  list.innerHTML = hubCodes.map(code=>{
    const h = hubs[code];
    const slots = window.HubsModule?.getSlotsForAirport?.(s, code) ?? "?";
    const bonus = Math.round((h.demandBonus01||0)*100);
    return `
      <div class="item">
        <div>
          <div><b>${code}</b> <span class="muted">Nível ${h.level}</span></div>
          <div class="meta">Slots/dia: ${slots} • Bônus demanda: +${bonus}%</div>
        </div>
        <div class="row">
          <button class="btn" data-hub-up="${code}">Upgrade</button>
        </div>
      </div>
    `;
  }).join("");

  list.querySelectorAll("[data-hub-up]").forEach(btn=>{
    btn.onclick = () => {
      const code = btn.getAttribute("data-hub-up");
      try{
        const res = window.HubsModule.upgradeHub(window.gameState, code);
        FlySimStore.save(window.gameState);
        render();
        MapModule.render();
        alert(`HUB ${code} melhorado! Custo: ${money(res.cost)}`);
      }catch(err){
        alert(err.message);
      }
    };
  });
}

function renderCareer(){
  const s = window.gameState;
  const el = document.getElementById("careerBox");
  if(!el) return;
  const lv = s.progress?.level ?? 1;
  const xp = s.progress?.xp ?? 0;
  const tiers = (s.progress?.unlockedTiers || []).join(", ");
  const hubs = Object.keys(s.hubs||{}).length;
  const act = s.objectives?.activeId || "startup";
  const done = s.objectives?.completed || {};
  const status = done[act] ? "Concluído" : "Em andamento";

  el.innerHTML = `
    <div class="cards">
      <div class="card"><div class="label">Nível</div><div class="value">${lv}</div></div>
      <div class="card"><div class="label">XP</div><div class="value">${xp}</div></div>
      <div class="card"><div class="label">HUBs</div><div class="value">${hubs}</div></div>
    </div>
    <p class="muted">Tiers desbloqueados: <b>${tiers || "mid"}</b></p>
    <div class="card">
      <h3>Objetivo atual</h3>
      <p><b>${act}</b> — <span class="muted">${status}</span></p>
      <p class="muted">Objetivos avançam automaticamente quando você cumpre as condições (rotas, frota, reputação, etc.).</p>
      <div class="row">
        <button id="setObjStartup" class="btn ghost">Startup</button>
        <button id="setObjHub" class="btn ghost">HUB</button>
        <button id="setObjGlobal" class="btn ghost">Global</button>
      </div>
    </div>
  `;

  el.querySelector("#setObjStartup").onclick = ()=>setObjective("startup");
  el.querySelector("#setObjHub").onclick = ()=>setObjective("hub");
  el.querySelector("#setObjGlobal").onclick = ()=>setObjective("global");
}

function setObjective(id){
  window.gameState.objectives = window.gameState.objectives || {activeId:"startup", completed:{}};
  window.gameState.objectives.activeId = id;
  FlySimStore.save(window.gameState);
  render();
}

function renderRnD(){
  const s = window.gameState;
  const box = document.getElementById("rndBox");
  const sel = document.getElementById("techSelect");
  if(!box || !sel) return;
  try{ window.RnDModule.ensure(s); }catch(e){}
  const techs = window.RnDModule?.listTechs?.() || [];
  sel.innerHTML = techs.map(t=>`<option value="${t.id}">${t.name} — ${money(t.cost)}</option>`).join("");
  const owned = Object.keys(s.rd?.owned||{}).length;
  box.innerHTML = `Fuel ${(s.rd?.fuelMult||1).toFixed(2)}x • Manut ${(s.rd?.maintMult||1).toFixed(2)}x • Load +${Math.round((s.rd?.loadBonus01||0)*100)}% • Techs: <b>${owned}</b>`;
}

function renderMarketing(){
  const s = window.gameState;
  const box = document.getElementById("marketingBox");
  const sel = document.getElementById("campaignSelect");
  const budget = document.getElementById("marketingBudget");
  if(!box || !sel || !budget) return;
  try{ window.MarketingModule.ensure(s); }catch(e){}
  const camps = window.MarketingModule?.list?.() || [];
  sel.innerHTML = camps.map(c=>`<option value="${c.id}">${c.name}</option>`).join("");
  budget.value = s.marketing?.dailyBudget || 0;
  const active = Object.keys(s.marketing?.active||{}).length;
  box.innerHTML = `Ativas: <b>${active}</b> • Bônus ocupação: +${Math.round((window.MarketingModule.getLoadBonus01(s)||0)*100)}%`;
}

function renderAlliances(){
  const s = window.gameState;
  const box = document.getElementById("alliancesBox");
  const sel = document.getElementById("allianceSelect");
  if(!box || !sel) return;
  try{ window.AlliancesModule.ensure(s); }catch(e){}
  const all = window.AlliancesModule?.list?.() || [];
  sel.innerHTML = all.map(a=>`<option value="${a.id}">${a.name} — ${money(a.cost)}</option>`).join("");
  const owned = Object.keys(s.alliances?.owned||{}).length;
  box.innerHTML = `Intl +${Math.round((s.alliances?.intlLoadBonus01||0)*100)}% • Taxas ${(s.alliances?.airportFeeMult||1).toFixed(2)}x • Long ${(s.alliances?.longRevenueMult||1).toFixed(2)}x • Acordos: <b>${owned}</b>`;
}

return { init, render };

})();

// Aircraft preview (shop)
(function(){
  const sel = document.getElementById("buyModel");
  const img = document.getElementById("buyModelPreview");
  if(!sel || !img) return;
  function upd(){
    const id = sel.value || "";
    img.src = `assets/aircraft/models/${id}.png`;
  }
  sel.addEventListener("change", upd);
  setTimeout(upd, 50);
})();
