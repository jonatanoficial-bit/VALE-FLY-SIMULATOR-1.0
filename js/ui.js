window.UIModule = (() => {
  let deferredPrompt = null;

  function money(n){
    return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
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
      window.gameState.company.day++;
      window.gameState.company.cash += res.profit;
      // Reputação simples: sobe com lucro, desce com prejuízo
      const deltaRep = Math.max(-0.02, Math.min(0.02, res.profit / 3000000000));
      window.gameState.company.reputation01 = Math.max(0.05, Math.min(0.95, window.gameState.company.reputation01 + deltaRep));
      window.gameState.lastDay = res;
      FlySimStore.save(window.gameState);
      render();
      MapModule.render();
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
  }

  function render(){
    const s = window.gameState;
    document.getElementById("clockText").textContent = s.company.day;
    document.getElementById("cashText").textContent = money(s.company.cash);
    document.getElementById("repText").textContent = Math.round(s.company.reputation01*100) + "%";

    const ld = s.lastDay;
    document.getElementById("lastDayLog").textContent =
      `Último dia:\n` +
      `Receita: ${money(ld.revenue)}\n` +
      `Custos:  ${money(ld.costs)}\n` +
      `Lucro:  ${money(ld.profit)}\n` +
      (ld.cancelledFlights ? `Cancelamentos: ${ld.cancelledFlights}\n` : "");

    // selects
    const airports = s.airports.slice().sort((a,b)=>a.code.localeCompare(b.code));
    const setOptions = (sel, opts, valFn, labelFn) => {
      const cur = sel.value;
      sel.innerHTML = opts.map(o => `<option value="${valFn(o)}">${labelFn(o)}</option>`).join("");
      if(cur) sel.value = cur;
    };

    setOptions(document.getElementById("routeFrom"), airports, a=>a.code, a=>`${a.code} — ${a.city}`);
    setOptions(document.getElementById("routeTo"), airports, a=>a.code, a=>`${a.code} — ${a.city}`);

    // fleet select for routes: only aircraft not in maintenance and not already assigned
    const freeFleet = s.fleet.filter(a => a.inMaintenanceDays<=0);
    const routeAircraft = document.getElementById("routeAircraft");
    routeAircraft.innerHTML = freeFleet.map(a => {
      const model = s.aircraftCatalog.find(m=>m.modelId===a.modelId);
      return `<option value="${a.id}">${a.nickname} (${model?.name || a.modelId})</option>`;
    }).join("");

    // buy select
    const buyModel = document.getElementById("buyModel");
    buyModel.innerHTML = s.aircraftCatalog.map(m => `<option value="${m.modelId}">${m.name} — ${money(m.price)}</option>`).join("");

    // lists
    renderRoutes();
    renderFleet();
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

  return { init, render };
})();
