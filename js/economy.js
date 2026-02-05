// Economia (Core Gameplay): simula receitas/custos por rota com demanda, manutenção e salários.
// Regras: EconomyModule.advanceDay(state) MUTATE o state e retorna resumo do dia.
(function(){
  function haversineKm(lat1, lon1, lat2, lon2){
    const R=6371;
    const toRad = d => d*Math.PI/180;
    const dLat = toRad(lat2-lat1);
    const dLon = toRad(lon2-lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    return 2*R*Math.asin(Math.sqrt(a));
  }
  function clamp01(x){ return Math.max(0, Math.min(1, x)); }

  function getAirport(state, code){ return state.airports.find(a=>a.code===code); }
  function getModel(state, modelId){ return state.aircraftCatalog.find(m=>m.modelId===modelId); }
  function getAircraft(state, id){ return state.fleet.find(a=>a.id===id); }

  function distanceKm(state, fromCode, toCode){
    const a = getAirport(state, fromCode);
    const b = getAirport(state, toCode);
    if(!a||!b) return 0;
    return haversineKm(a.lat,a.lon,b.lat,b.lon);
  }

    function demandLoadFactor(state, distKm, price, from, to){
    // Ocupação = reputação + demanda (aeroportos) + preço + concorrência + eventos
    const rep = state.company.reputation01 ?? 0.5;
    const repFactor = 0.55 + rep*0.55; // 0.55..1.10

    const demandMult = (window.MarketModule?.routeDemandMultiplier?.(state, from, to)) ?? 0.75;
    const baseline = (window.MarketModule?.baselineFare?.(distKm)) ?? Math.max(120, Math.round(distKm*0.9));
    const priceEff = (window.MarketModule?.priceEffect?.(price, baseline)) ?? 1.0;
    const compEff  = (window.MarketModule?.competitionFactor?.(state, from, to)) ?? 1.0;

    // Penalidade leve em rotas muito longas
    const distPenalty = Math.min(0.22, distKm/16000);

    const lf = (0.58 * repFactor) * demandMult * priceEff * compEff;
    return clamp01(lf - distPenalty);
  }


  function staffCapacityFactor(state){
    const needPilots = Math.max(0, state.routes.filter(r=>r.active).length*2);
    const needCrew = Math.max(0, state.routes.filter(r=>r.active).length*4);
    const needMech = Math.max(0, Math.ceil(state.fleet.length/2));
    const s = state.staff || { pilots:0, crew:0, mechanics:0 };
    const f1 = needPilots ? Math.min(1, s.pilots/needPilots) : 1;
    const f2 = needCrew ? Math.min(1, s.crew/needCrew) : 1;
    const f3 = needMech ? Math.min(1, s.mechanics/needMech) : 1;
    return clamp01(Math.min(f1, f2, f3));
  }

  function salaryCost(state){
    const s = state.staff || { pilots:0, crew:0, mechanics:0 };
    // valores simples (R$/dia) – ajustável
    return (s.pilots*1800) + (s.crew*900) + (s.mechanics*1200);
  }

  window.EconomyModule = {
    distanceKm,
    advanceDay(state){
      if(!state) return { revenue:0, costs:0, profit:0, notes:["Estado inválido"] };

      const notes = [];
      try{ window.MarketingModule?.tickDay?.(state, notes); }catch(e){}

      // Mercado vivo: eventos do dia + IA rival
      try{
        const ev = window.EventsModule?.applyDaily?.(state);
        if(ev?.name) notes.push(`Evento: ${ev.name} (${ev.note})`);
      }catch(_){ }
      try{ window.AICompaniesModule?.init?.(state); window.AICompaniesModule?.step?.(state); }catch(_){ }


      // salários
      const salary = Math.round(salaryCost(state));

      // capacidade de equipe (se falta equipe, reduz voos)
      const staffFactor = staffCapacityFactor(state);
      if(staffFactor < 1){
        notes.push(`Equipe insuficiente: eficiência ${(staffFactor*100).toFixed(0)}%`);
        state.company.reputation01 = clamp01((state.company.reputation01||0.5) - 0.01);
      }

      // manutenção em andamento
      let maintCost = 0;
      for(const ac of state.fleet){
        if(ac.inMaintenanceDays>0){
          maintCost += 7500000;
          ac.inMaintenanceDays -= 1;
          ac.condition01 = clamp01((ac.condition01||0.7) + 0.25);
        }
      }

      let revenue = 0;
      let opCost = 0;
      let canceled = 0;
let successFlights = 0;

// Slots por aeroporto (limite de operações por dia para sua cia)
const airportUse = {}; // code -> used departures+arrivals (contabiliza 1 slot por operação)
const slotsFor = (code) => (window.HubsModule?.getSlotsForAirport?.(state, code) ?? 0);


      for(const r of state.routes){
        if(!r.active) continue;

        const ac = getAircraft(state, r.aircraftId);
        if(!ac) { notes.push(`Rota ${r.id} sem aeronave.`); continue; }
        const model = getModel(state, ac.modelId);
        if(!model) continue;

        const dist = distanceKm(state, r.from, r.to);
        if(dist <= 0) continue;

        // valida alcance (se passar do alcance, cancela tudo)
        if(dist > model.rangeKm){
          canceled += r.freq;
          notes.push(`Rota ${r.from}→${r.to}: fora do alcance do ${model.modelId}.`);
          state.company.reputation01 = clamp01((state.company.reputation01||0.5) - 0.015);
          continue;
        }

        if(ac.inMaintenanceDays>0){ canceled += r.freq; continue; }

        const risk = Math.max(0, (0.35 - (ac.condition01 ?? 0.7)));
        const cancelProb = clamp01(risk * 2.2);

        const load = demandLoadFactor(state, dist);
        // bônus de HUB aumenta demanda nas rotas que partem/chegam em hubs do jogador
const hubBonus = (window.HubsModule?.getDemandBonus01?.(state, r.from) || 0) + (window.HubsModule?.getDemandBonus01?.(state, r.to) || 0);
const paxPerFlight = Math.round(model.seats * Math.min(1, load + hubBonus));

// efetivo de voos/dia reduzido por staffFactor
const effFreq = Math.max(0, Math.round(r.freq * staffFactor));

for(let i=0;i<effFreq;i++){
  // Slots: 1 slot em origem + 1 slot em destino (simplificado)
  const need = 2;
  const usedFrom = (airportUse[r.from]||0);
  const usedTo = (airportUse[r.to]||0);
  if(usedFrom + 1 > slotsFor(r.from) || usedTo + 1 > slotsFor(r.to)){
    canceled += 1;
    notes.push(`Slots insuficientes em ${r.from} ou ${r.to}. Voo cancelado.`);
    state.company.reputation01 = clamp01((state.company.reputation01||0.5) - 0.005);
    continue;
  }
  airportUse[r.from] = usedFrom + 1;
  airportUse[r.to] = usedTo + 1;

          if(Math.random() < cancelProb){
            canceled += 1;
            state.company.reputation01 = clamp01((state.company.reputation01||0.5) - 0.01);
            continue;
          }

          revenue += paxPerFlight * r.price;
          successFlights += 1;

          // custos (combustível + taxas)
          const fuelPrice = (state.market?.fuelPricePerUnit ?? 4200);
          const fuel = dist * model.fuelBurnPerKm * fuelPrice;
          const fees = 1200000 + dist*120;
          opCost += fuel + fees;

          // desgaste proporcional à distância
          ac.condition01 = clamp01((ac.condition01 ?? 0.9) - (0.010 + dist/250000));

          // reputação sobe levemente por operação estável
          state.company.reputation01 = clamp01((state.company.reputation01||0.5) + 0.0005);
        }
      }

      const costs = salary + maintCost + opCost;
      const profit = revenue - costs;

      state.company.cash += profit;
      state.company.day += 1;

      state.lastDay = {
        successFlights,
        revenue: Math.round(revenue),
        costs: Math.round(costs),
        profit: Math.round(profit),
        salary,
        maintCost: Math.round(maintCost),
        opCost: Math.round(opCost),
        canceled,
        notes
      };

      try{ window.ProgressionModule?.applyDayRewards?.(state, state.lastDay); }catch(_){}
return state.lastDay;

    }
  };
})();
