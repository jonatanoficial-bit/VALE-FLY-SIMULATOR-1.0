// UI Module (Part 2)

window.FlySimUI = (() => {
  function fmtBRL(v) {
    return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function el(id) { return document.getElementById(id); }

  function setText(id, txt) {
    const e = el(id);
    if (e) e.textContent = txt;
  }

  function randomId() {
    const s = (typeof crypto !== 'undefined' && crypto.getRandomValues)
      ? crypto.getRandomValues(new Uint32Array(2))
      : [Math.floor(Math.random() * 2 ** 32), Math.floor(Math.random() * 2 ** 32)];
    return `${s[0].toString(16)}${s[1].toString(16)}`;
  }

  function planeLabel(state, planeId) {
    const p = (state.fleet.planes || []).find(x => x.id === planeId);
    if (!p) return '—';
    const m = window.FlySimAircraft.byId(p.modelId);
    const modelName = m ? m.name : p.modelId;
    return `${p.name} • ${modelName}`;
  }

  function routeRow(r, state, airportsByIata) {
    const a = airportsByIata.get(r.from);
    const b = airportsByIata.get(r.to);
    const label = `${r.from} → ${r.to}`;
    const sub = (a && b) ? `${a.city} • ${b.city}` : '';
    const last = r.lastResult && r.lastResult.ok ? r.lastResult : null;
    const profit = last ? last.profit : null;

    return `
      <div class="rowCard">
        <div class="rowMain">
          <div>
            <div class="rowTitle">${label}</div>
            <div class="rowSub">${sub}</div>
          </div>
          <div class="rowRight">
            <div class="badge ${r.active ? 'on' : 'off'}">${r.active ? 'Ativa' : 'Pausada'}</div>
            <div class="rowMoney ${profit === null ? '' : (profit >= 0 ? 'good' : 'bad')}">${profit === null ? '—' : fmtBRL(profit)}</div>
          </div>
        </div>
        <div class="rowMeta">
          <span>Aeronave: <b>${planeLabel(state, r.planeId)}</b></span>
          <span>Passagem: <b>${fmtBRL(r.ticket)}</b></span>
          <span>Voos/dia: <b>${r.flightsPerDay}</b></span>
          <span>Assentos: <b>${(last && last.seats) ? last.seats : '—'}</b></span>
        </div>
        <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" data-act="toggleRoute" data-id="${r.id}">${r.active ? 'Pausar' : 'Ativar'}</button>
          <button class="btn danger" data-act="deleteRoute" data-id="${r.id}">Excluir</button>
        </div>
        ${last && last.ok ? `<div class="hint" style="margin-top:8px;opacity:.85">Pax: <b>${Number(last.pax).toLocaleString('pt-BR')}</b> • Voos: <b>${last.flightsDone}</b>${last.canceled ? ' • <span style="color:#fca5a5;font-weight:800">Cancelamento</span>' : ''}</div>` : (r.lastResult && !r.lastResult.ok ? `<div class="hint" style="margin-top:8px;color:#fecaca">⚠ ${r.lastResult.error}</div>` : '')}
      </div>
    `;
  }

  function planeRow(p, state) {
    const m = window.FlySimAircraft.byId(p.modelId);
    const cond = Math.round((p.condition01 || 0) * 100);
    const status = (p.status === 'maintenance' && p.maintenanceDaysLeft > 0) ? `Manutenção (${p.maintenanceDaysLeft}d)` : 'Disponível';
    const condClass = cond >= 70 ? 'good' : (cond >= 40 ? '' : 'bad');
    const price = m ? m.price : 0;

    const canSell = (p.status !== 'maintenance' || p.maintenanceDaysLeft <= 0);
    const sellValue = Math.round(price * (0.35 + 0.55 * (p.condition01 || 0))); // 35..90% based on condition

    return `
      <div class="rowCard">
        <div class="rowMain">
          <div>
            <div class="rowTitle">${p.name}</div>
            <div class="rowSub">${m ? m.name : p.modelId} • Capacidade ${m ? m.capacity : '—'} • Alcance ${m ? m.rangeKm.toLocaleString('pt-BR') : '—'} km</div>
          </div>
          <div class="rowRight">
            <div class="badge ${status.startsWith('Manutenção') ? 'off' : 'on'}">${status}</div>
            <div class="rowMoney ${condClass}">${cond}%</div>
          </div>
        </div>
        <div class="rowMeta">
          <span>Ciclos: <b>${Math.round(p.cycles || 0)}</b></span>
          <span>Horas: <b>${Math.round(p.hours || 0)}</b></span>
          <span>Revenda: <b>${fmtBRL(sellValue)}</b></span>
        </div>
        <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" data-act="maintPlane" data-id="${p.id}">Enviar p/ manutenção (2 dias)</button>
          <button class="btn danger" data-act="sellPlane" data-id="${p.id}" ${canSell ? '' : 'disabled'}>Vender</button>
        </div>
        <div class="hint" style="margin-top:8px">Condição baixa aumenta custos e pode causar cancelamentos. Abaixo de 20% a aeronave fica indisponível.</div>
      </div>
    `;
  }

  function fillSelect(selectEl, items, getValue, getLabel, selectedValue) {
    selectEl.innerHTML = items.map(it => {
      const v = getValue(it);
      const sel = v === selectedValue ? 'selected' : '';
      return `<option value="${v}" ${sel}>${getLabel(it)}</option>`;
    }).join('');
  }

  class UI {
    constructor({ getState, setState, airportsByIata, onAdvanceDay, onRenderMap, onReset }) {
      this.getState = getState;
      this.setState = setState;
      this.airportsByIata = airportsByIata;
      this.onAdvanceDay = onAdvanceDay;
      this.onRenderMap = onRenderMap;
      this.onReset = onReset;

      this._bind();
      this.render();
    }

    _bind() {
      el('menuBtn').onclick = () => el('drawer').classList.toggle('show');
      el('closeDrawerBtn').onclick = () => el('drawer').classList.remove('show');

      document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.onclick = () => this._setTab(btn.getAttribute('data-tab'));
      });

      el('advanceDayBtn').onclick = () => {
        const res = this.onAdvanceDay();
        this.render();
        this.onRenderMap();
      };

      // Create route
      const fromSel = el('routeFrom');
      const toSel = el('routeTo');
      fillSelect(fromSel, window.FlySimAirports.AIRPORTS, a => a.iata, a => `${a.iata} • ${a.city} (${a.country})`, 'GRU');
      fillSelect(toSel, window.FlySimAirports.AIRPORTS, a => a.iata, a => `${a.iata} • ${a.city} (${a.country})`, 'GIG');

      el('createRouteBtn').onclick = () => this._createRoute();

      // Buy plane
      el('buyPlaneBtn').onclick = () => this._buyPlane();

      // Staff
      el('hirePilotsBtn').onclick = () => this._adjustStaff('pilots', +1);
      el('firePilotsBtn').onclick = () => this._adjustStaff('pilots', -1);
      el('hireCabinBtn').onclick = () => this._adjustStaff('cabin', +2);
      el('fireCabinBtn').onclick = () => this._adjustStaff('cabin', -2);
      el('hireMechBtn').onclick = () => this._adjustStaff('mechanics', +1);
      el('fireMechBtn').onclick = () => this._adjustStaff('mechanics', -1);

      // Save tools
      el('exportBtn').onclick = () => {
        const state = this.getState();
        const nameSafe = (state.company.name || 'flysim').replace(/[^a-z0-9_-]+/gi, '_');
        window.FlySimStore.downloadJson(`FlySim_Save_${nameSafe}_D${state.company.day}.json`, state);
      };

      el('importFile').addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const text = await window.FlySimStore.readFileAsText(file);
        const raw = (() => { try { return JSON.parse(text); } catch { return null; } })();
        const sane = window.FlySimState.sanitizeState(raw);
        if (!sane) {
          alert('Save inválido ou de outra versão.');
          e.target.value = '';
          return;
        }
        this.setState(sane);
        window.FlySimStore.save(sane);
        e.target.value = '';
        this.render();
        this.onRenderMap();
      });

      el('resetBtn').onclick = () => {
        if (!confirm('Resetar o jogo e começar do zero?')) return;
        this.onReset();
        this.render();
        this.onRenderMap();
      };

      el('companyName').addEventListener('change', (e) => {
        const state = this.getState();
        state.company.name = e.target.value.trim().slice(0, 32) || 'Sua Companhia';
        this.setState(state);
        window.FlySimStore.save(state);
        this.render();
      });

      // delegated actions
      el('drawerBody').addEventListener('click', (e) => {
        const t = e.target;
        if (!t || !t.getAttribute) return;
        const act = t.getAttribute('data-act');
        const id = t.getAttribute('data-id');
        if (!act || !id) return;
        if (act === 'toggleRoute') this._toggleRoute(id);
        if (act === 'deleteRoute') this._deleteRoute(id);
        if (act === 'maintPlane') this._maintPlane(id);
        if (act === 'sellPlane') this._sellPlane(id);
      });
    
      // Map (Part 3) - realistic tiles + offline packs
      const toggleBtn = el('toggleTilesBtn');
      const modePill = el('mapModePill');
      const dlBtn = el('downloadPackBtn');
      const cancelBtn = el('cancelPackBtn');
      const packSel = el('mapPackSelect');
      const qualSel = el('mapPackQuality');
      const progText = el('packProgressText');
      const progBar = el('packProgressBar');
      const progBadge = el('packProgressBadge');

      if (toggleBtn && modePill) {
        toggleBtn.onclick = () => {
          const map = window.__flysim_map;
          if (!map) return;
          map.setUseTiles(!map.useTiles);
          modePill.textContent = `Modo: ${map.useTiles ? 'Mapa realista' : 'Offline básico'}`;
          toggleBtn.textContent = map.useTiles ? 'Voltar ao mapa básico' : 'Ativar mapa realista';
          this.onRenderMap();
        };
      }

      const packDefs = {
        world_low: { bbox: { minLon: -180, minLat: -60, maxLon: 180, maxLat: 75 }, zMin: 1, zMax: 3 },
        south_america: { bbox: { minLon: -92, minLat: -58, maxLon: -30, maxLat: 15 }, zMin: 2, zMax: 6 },
        brazil: { bbox: { minLon: -74, minLat: -34, maxLon: -34, maxLat: 5 }, zMin: 3, zMax: 7 },
        europe: { bbox: { minLon: -11, minLat: 35, maxLon: 32, maxLat: 71 }, zMin: 3, zMax: 7 }
      };

      let downloading = false;

      function setProgress(done, total) {
        if (!progBar || !progText) return;
        const pct = total ? Math.floor((done / total) * 100) : 0;
        progBar.style.width = `${pct}%`;
        progText.textContent = total ? `Baixando tiles: ${done}/${total} (${pct}%)` : 'Nenhum download em andamento.';
      }

      function setDownloading(on) {
        downloading = on;
        if (dlBtn) dlBtn.disabled = on;
        if (cancelBtn) cancelBtn.disabled = !on;
        if (progBadge) progBadge.style.display = on ? 'inline-flex' : 'none';
      }

      if (dlBtn && packSel && qualSel) {
        dlBtn.onclick = async () => {
          if (downloading) return;

          const def = packDefs[packSel.value] || packDefs.world_low;
          let zMin = def.zMin;
          let zMax = def.zMax;

          const q = qualSel.value;
          if (q === 'lite') zMax = Math.max(zMin, zMax - 1);
          if (q === 'hq') zMax = zMax + 1;

          // Safety limit: avoid absurd downloads
          const urls = window.FlySimMapCanvas.tilesForBBox(def.bbox, zMin, zMax);
          if (urls.length > 3500) {
            alert(`Pacote muito grande (${urls.length} tiles). Escolha "Leve" ou uma região menor.`);
            return;
          }

          setDownloading(true);
          setProgress(0, urls.length);

          try {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage({ type: 'CACHE_TILES', urls });
            } else {
              alert('Service Worker não está ativo. Recarregue a página e tente novamente.');
              setDownloading(false);
            }
          } catch (e) {
            setDownloading(false);
          }
        };
      }

      if (cancelBtn) {
        cancelBtn.onclick = () => {
          if (!downloading) return;
          try {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage({ type: 'CANCEL_CACHE_TILES' });
            }
          } catch (_) {}
          setDownloading(false);
          setProgress(0, 0);
        };
      }

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (e) => {
          const msg = e.data || {};
          if (msg.type === 'CACHE_TILES_PROGRESS') {
            setDownloading(true);
            setProgress(msg.done || 0, msg.total || 0);
          }
          if (msg.type === 'CACHE_TILES_DONE') {
            setProgress(msg.done || 0, msg.total || 0);
            setTimeout(() => setDownloading(false), 400);
          }
          if (msg.type === 'CACHE_TILES_CANCELED') {
            setDownloading(false);
            setProgress(0, 0);
          }
        });
      }

}

    _setTab(tab) {
      document.querySelectorAll('.tabBtn').forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tab));
      document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.id === `tab_${tab}`));
    }

    _refreshPlaneSelect() {
      const state = this.getState();
      const planeSel = el('routePlane');
      const planes = (state.fleet.planes || []).slice();
      fillSelect(
        planeSel,
        planes,
        p => p.id,
        p => {
          const m = window.FlySimAircraft.byId(p.modelId);
          const cond = Math.round((p.condition01 || 0) * 100);
          const stat = (p.status === 'maintenance' && p.maintenanceDaysLeft > 0) ? `Manutenção ${p.maintenanceDaysLeft}d` : 'OK';
          return `${p.name} • ${(m ? m.name : p.modelId)} • ${cond}% • ${stat}`;
        },
        planes[0] ? planes[0].id : ''
      );
    }

    _createRoute() {
      const from = el('routeFrom').value;
      const to = el('routeTo').value;
      if (from === to) return alert('Escolha aeroportos diferentes.');

      const ticket = Number(el('routeTicket').value || 650);
      const flightsPerDay = Number(el('routeFreq').value || 1);
      const planeId = el('routePlane').value;

      const state = this.getState();
      const exists = state.routes.some(r => r.from === from && r.to === to);
      if (exists) return alert('Essa rota já existe.');
      if (!planeId) return alert('Você precisa ter uma aeronave para operar a rota.');

      state.routes.unshift({
        id: randomId(),
        from,
        to,
        ticket: Math.max(50, ticket),
        flightsPerDay: Math.max(1, Math.min(10, flightsPerDay)),
        planeId,
        active: true,
        createdDay: state.company.day,
        lastResult: null,
      });

      this.setState(state);
      window.FlySimStore.save(state);
      this.render();
      this.onRenderMap();
      alert('Rota criada! Avance o dia para ver os resultados.');
    }

    _toggleRoute(routeId) {
      const state = this.getState();
      const r = state.routes.find(x => x.id === routeId);
      if (!r) return;
      r.active = !r.active;
      window.FlySimStore.save(state);
      this.render();
      this.onRenderMap();
    }

    _deleteRoute(routeId) {
      if (!confirm('Excluir essa rota?')) return;
      const state = this.getState();
      state.routes = state.routes.filter(r => r.id !== routeId);
      window.FlySimStore.save(state);
      this.render();
      this.onRenderMap();
    }

    _buyPlane() {
      const state = this.getState();
      const modelId = el('buyModel').value;
      const model = window.FlySimAircraft.byId(modelId);
      if (!model) return alert('Modelo inválido.');
      if (state.company.cash < model.price) return alert('Caixa insuficiente.');

      const name = (el('buyName').value || '').trim().slice(0, 24) || `Frota ${String(state.fleet.planes.length + 1).padStart(2,'0')}`;

      state.company.cash -= model.price;
      state.fleet.planes.push({
        id: randomId(),
        modelId,
        name,
        condition01: 1.0,
        cycles: 0,
        hours: 0,
        status: 'available',
        maintenanceDaysLeft: 0,
      });

      el('buyName').value = '';
      window.FlySimStore.save(state);
      this.render();
      this.onRenderMap();
      alert('Aeronave comprada!');
    }

    _maintPlane(planeId) {
      const state = this.getState();
      const p = state.fleet.planes.find(x => x.id === planeId);
      if (!p) return;
      if (p.status === 'maintenance' && p.maintenanceDaysLeft > 0) return alert('Essa aeronave já está em manutenção.');
      p.status = 'maintenance';
      p.maintenanceDaysLeft = 2;
      window.FlySimStore.save(state);
      this.render();
      this.onRenderMap();
    }

    _sellPlane(planeId) {
      const state = this.getState();
      const p = state.fleet.planes.find(x => x.id === planeId);
      if (!p) return;
      if (p.status === 'maintenance' && p.maintenanceDaysLeft > 0) return alert('Espere terminar a manutenção para vender.');

      const m = window.FlySimAircraft.byId(p.modelId);
      const base = m ? m.price : 0;
      const sellValue = Math.round(base * (0.35 + 0.55 * (p.condition01 || 0)));

      // block selling if used by active route
      const used = state.routes.some(r => r.active && r.planeId === p.id);
      if (used) return alert('Essa aeronave está alocada em uma rota ativa. Pause a rota primeiro.');

      if (!confirm(`Vender "${p.name}" por ${fmtBRL(sellValue)}?`)) return;

      state.company.cash += sellValue;
      state.fleet.planes = state.fleet.planes.filter(x => x.id !== p.id);

      // clean routes assigned to this plane (keep but inactive)
      for (const r of state.routes) {
        if (r.planeId === p.id) { r.active = false; r.planeId = state.fleet.planes[0] ? state.fleet.planes[0].id : null; }
      }

      window.FlySimStore.save(state);
      this.render();
      this.onRenderMap();
    }

    _adjustStaff(key, delta) {
      const state = this.getState();
      state.staff[key] = Math.max(0, (Number(state.staff[key]) || 0) + delta);
      window.FlySimStore.save(state);
      this.render();
    }

    render() {
      const state = this.getState();

      setText('titleCompany', state.company.name);
      el('companyName').value = state.company.name;
      setText('clockText', `Dia ${state.company.day}`);
      setText('cashText', fmtBRL(state.company.cash));
      setText('repText', `${Math.round(state.company.reputation01 * 100)}%`);

      // Overview stats
      setText('statPax', state.stats.totalPax.toLocaleString('pt-BR'));
      setText('statFlights', state.stats.totalFlights.toLocaleString('pt-BR'));
      setText('statRev', fmtBRL(state.stats.totalRevenue));
      setText('statCost', fmtBRL(state.stats.totalCost));

      setText('statMaint', fmtBRL(state.stats.totalMaint || 0));
      setText('statWages', fmtBRL(state.stats.totalWages || 0));

      // Populate buy model select
      fillSelect(
        el('buyModel'),
        window.FlySimAircraft.list(),
        a => a.id,
        a => `${a.name} • Cap ${a.capacity} • Alc ${a.rangeKm.toLocaleString('pt-BR')}km • ${fmtBRL(a.price)}`,
        'narrow_n3'
      );

      // refresh plane select for route creation
      this._refreshPlaneSelect();

      // Routes list
      el('routesList').innerHTML = state.routes.map(r => routeRow(r, state, this.airportsByIata)).join('') || '<div class="hint">Nenhuma rota ainda.</div>';

      // Fleet list
      el('fleetList').innerHTML = (state.fleet.planes || []).map(p => planeRow(p, state)).join('') || '<div class="hint">Nenhuma aeronave.</div>';

      // Staff
      setText('staffPilots', String(state.staff.pilots || 0));
      setText('staffCabin', String(state.staff.cabin || 0));
      setText('staffMech', String(state.staff.mechanics || 0));

      // Finance (last 14 days)
      const last = state.ledger.slice(-14);
      el('financeList').innerHTML = last.length ? last.map(x => {
        const c = x.profit >= 0 ? 'good' : 'bad';
        return `
          <div class="rowCard">
            <div class="rowMain">
              <div class="rowTitle">Dia ${x.day}</div>
              <div class="rowRight">
                <div class="rowMoney ${c}">${fmtBRL(x.profit)}</div>
              </div>
            </div>
            <div class="rowMeta">
              <span>Receita: <b>${fmtBRL(x.revenue)}</b></span>
              <span>Custos: <b>${fmtBRL(x.cost)}</b></span>
              <span>Salários: <b>${fmtBRL(x.wages || 0)}</b></span>
              <span>Manutenção: <b>${fmtBRL(x.maint || 0)}</b></span>
            </div>
          </div>
        `;
      }).join('') : '<div class="hint">Avance alguns dias para ver o fluxo de caixa.</div>';
    }
  }

  return { UI };
})();
