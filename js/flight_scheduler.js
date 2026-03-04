(function(){
  function ensure(state){
    state.activeFlights ||= [];
  }

  function cruiseKmhForModel(model){
    if(!model) return 820;
    const n = String(model.name||"").toLowerCase();
    if(n.includes("atr")) return 510;
    if(n.includes("embraer") || n.includes("e195")) return 780;
    if(n.includes("a330")) return 860;
    if(n.includes("787") || n.includes("dreamliner")) return 890;
    return 820;
  }

  function flightDurationMinutes(distKm, cruiseKmh){
    const cruiseMin = (distKm / Math.max(200,cruiseKmh)) * 60;
    return Math.max(25, Math.round(cruiseMin + 18)); // taxi/subida/descida
  }

  function plannedDeparturesForRoute(route){
    const freq = Math.max(1, Number(route.freq)||1);
    const start = 6*60;
    const end   = 22*60;
    const span = Math.max(120, end - start);
    const step = Math.floor(span / freq);
    const out = [];
    for(let i=0;i<freq;i++){
      out.push(start + i*step);
    }
    return out;
  }

  function keyFor(state, depMinute){ return `${state.company.day}:${depMinute}`; }

  function alreadyDepartedToday(route, state, depMinute){
    route._departed ||= {};
    return !!route._departed[keyFor(state, depMinute)];
  }

  function markDeparted(route, state, depMinute){
    route._departed ||= {};
    route._departed[keyFor(state, depMinute)] = true;
  }

  function startFlight(state, route, depMinute){
    const ac = state.fleet.find(a=>a.id===route.aircraftId);
    if(!ac) return false;

    const model = state.aircraftCatalog.find(m=>m.modelId===ac.modelId);
    const dist = EconomyModule.distanceKm(state, route.from, route.to);
    if(!dist || dist<=0) return false;

    const dur = flightDurationMinutes(dist, cruiseKmhForModel(model));
    const arr = depMinute + dur;

    state.activeFlights.push({
      id: "F" + Math.random().toString(16).slice(2,8).toUpperCase(),
      routeId: route.id,
      aircraftId: ac.id,
      from: route.from,
      to: route.to,
      depMinute,
      arrMinute: arr,
      distKm: dist,
      status: "enroute"
    });

    try{ EconomyModule.runFlight?.(state, route.id); }catch(_){}
    return true;
  }

  function tick(state){
    ensure(state);
    TimeSim.ensureClock(state);
    const now = state.clock.minuteOfDay;

    for(const f of state.activeFlights){
      if(f.status==="enroute" && now >= (f.arrMinute % (24*60))){
        f.status="arrived";
      }
    }
    state.activeFlights = state.activeFlights.filter(f => f.status !== "arrived");

    for(const r of (state.routes||[]).filter(x=>x.active)){
      const deps = plannedDeparturesForRoute(r);
      for(const dep of deps){
        if(now === dep && !alreadyDepartedToday(r, state, dep)){
          const ok = startFlight(state, r, dep);
          markDeparted(r, state, dep);
          if(ok){
            try{ window.dispatchEvent(new Event("game-updated")); }catch(_){}
          }
        }
      }
    }

    try{ FlySimStore.save(state); }catch(_){}
  }

  window.addEventListener("time-tick", ()=>{
    try{ tick(window.gameState); }catch(e){ console.warn(e); }
    try{ MapModule?.render?.(); }catch(_){}
  });

  window.FlightScheduler = { tick };
})();