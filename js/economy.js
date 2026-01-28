// Economy & simulation loop (Part 2)
// Adds: aircraft-specific costs, fleet availability, maintenance & staff wages.

window.FlySimEconomy = (() => {
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function pseudoNoise(day, seedStr) {
    let h = 2166136261;
    const s = `${seedStr}|${day}`;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 10_000) / 10_000;
  }

  function _planeById(state, id) {
    return (state.fleet && state.fleet.planes || []).find(p => p.id === id) || null;
  }

  function _wagesPerDay(staff) {
    const pilots = Math.max(0, Number(staff.pilots) || 0);
    const cabin = Math.max(0, Number(staff.cabin) || 0);
    const mechanics = Math.max(0, Number(staff.mechanics) || 0);
    const wP = Number(staff.wagePilot) || 1250;
    const wC = Number(staff.wageCabin) || 520;
    const wM = Number(staff.wageMechanic) || 640;
    return (pilots * wP) + (cabin * wC) + (mechanics * wM);
  }

  function _requiredStaffForActiveRoutes(state) {
    // Simple staffing model:
    // - Each active aircraft doing flights requires 2 pilots
    // - Cabin crew scales with capacity: 4 for up to 120 seats, 6 up to 220, 10 above
    const activePlaneIds = new Set();
    for (const r of state.routes) {
      if (r.active && r.planeId) activePlaneIds.add(r.planeId);
    }
    let reqPilots = 0;
    let reqCabin = 0;
    for (const pid of activePlaneIds) {
      const p = _planeById(state, pid);
      if (!p) continue;
      const model = window.FlySimAircraft.byId(p.modelId);
      if (!model) continue;
      reqPilots += 2;
      if (model.capacity <= 120) reqCabin += 4;
      else if (model.capacity <= 220) reqCabin += 6;
      else reqCabin += 10;
    }
    // mechanics requirement is light in Part 2: 2 per aircraft
    const reqMechanics = Math.max(2, activePlaneIds.size * 2);
    return { reqPilots, reqCabin, reqMechanics };
  }

  function estimateDailyForRoute(route, state, airportsByIata) {
    const from = airportsByIata.get(route.from);
    const to = airportsByIata.get(route.to);
    if (!from || !to) {
      return { ok: false, error: 'Aeroporto inválido', distanceKm: 0, pax: 0, revenue: 0, cost: 0, profit: 0, repDelta: 0, flightsDone: 0 };
    }

    const plane = _planeById(state, route.planeId);
    if (!plane) {
      return { ok: false, error: 'Sem aeronave', distanceKm: 0, pax: 0, revenue: 0, cost: 0, profit: 0, repDelta: -0.002, flightsDone: 0 };
    }

    const model = window.FlySimAircraft.byId(plane.modelId);
    if (!model) {
      return { ok: false, error: 'Modelo inválido', distanceKm: 0, pax: 0, revenue: 0, cost: 0, profit: 0, repDelta: -0.002, flightsDone: 0 };
    }

    if (plane.status === 'maintenance' && plane.maintenanceDaysLeft > 0) {
      return { ok: false, error: 'Aeronave em manutenção', distanceKm: 0, pax: 0, revenue: 0, cost: 0, profit: 0, repDelta: -0.001, flightsDone: 0 };
    }

    // grounded if too damaged
    if (plane.condition01 < 0.20) {
      return { ok: false, error: 'Aeronave indisponível (danificada)', distanceKm: 0, pax: 0, revenue: 0, cost: 0, profit: 0, repDelta: -0.004, flightsDone: 0 };
    }

    const distanceKm = haversineKm(from.lat, from.lon, to.lat, to.lon);
    const flightsPerDay = Math.max(1, Math.min(10, Number(route.flightsPerDay) || 1));
    const ticket = Math.max(50, Number(route.ticket) || 650);

    // capacity is model capacity (routes no longer set seats)
    const seats = model.capacity;

    // Demand: airports demand + reputation + distance penalty + price elasticity + plane comfort proxy
    const baseDemand = (from.demand + to.demand) / 2; // 0..1
    const rep01 = clamp01(state.company.reputation01);
    const repBoost = 0.65 + 0.75 * rep01; // 0.65..1.40
    const distPenalty = 1 - clamp01(distanceKm / 18000) * 0.33; // up to -33%
    const refTicket = 650; // BRL
    const priceFactor = clamp01(1.35 - (ticket / refTicket) * 0.55);
    const season = 0.9 + 0.2 * pseudoNoise(state.company.day, route.id);

    // Condition impacts punctuality and cancellations (simple): below 0.6 reduces occupancy
    const reliability = clamp01(0.55 + plane.condition01 * 0.55); // ~0.55..1.10 but clamped later
    const occ01 = clamp01(0.28 + 0.45 * baseDemand + 0.20 * (repBoost/1.40)) * distPenalty * priceFactor * season * clamp01(reliability);

    // flights done can be reduced by low condition (simulate cancellations)
    let cancelChance = 0;
    if (plane.condition01 < 0.60) cancelChance = (0.60 - plane.condition01) * 0.35; // up to ~14%
    const noise = pseudoNoise(state.company.day + 17, plane.id + route.id);
    const canceled = noise < cancelChance ? 1 : 0;
    const flightsDone = Math.max(0, flightsPerDay - canceled);

    const pax = Math.round(seats * flightsDone * occ01);

    const revenue = pax * ticket;

    // Costs: aircraft-specific
    const fuel = distanceKm * model.fuelBurnPerKm * flightsDone;
    const fixed = model.fixedPerFlight * flightsDone;
    const paxVar = pax * 35; // catering/handling
    // Airport fee proxy: higher for high-demand airports
    const airportFees = flightsDone * (22_000 + 55_000 * baseDemand);

    // Condition increases cost slightly (inefficiency)
    const ineff = 1 + (1 - plane.condition01) * 0.18;
    const cost = (fuel + fixed + paxVar + airportFees) * ineff;

    const profit = revenue - cost;

    // Reputation drift
    const occTarget = 0.74;
    const repFromOcc = (occ01 - occTarget) * 0.028;
    const repFromPrice = (refTicket - ticket) / refTicket * 0.01;
    const repFromCancels = canceled ? -0.004 : 0;
    let repDelta = repFromOcc + repFromPrice + repFromCancels;
    repDelta = Math.max(-0.02, Math.min(0.02, repDelta));

    return { ok: true, distanceKm, pax, revenue, cost, profit, repDelta, flightsDone, canceled, seats };
  }

  function advanceOneDay(state, airportsByIata) {
    // 1) update maintenance countdown and pay maintenance costs
    let maintCost = 0;
    for (const p of state.fleet.planes) {
      if (p.status === 'maintenance' && p.maintenanceDaysLeft > 0) {
        const model = window.FlySimAircraft.byId(p.modelId);
        const daily = model ? model.maintenanceCostPerDay : 350_000;
        maintCost += daily;
        p.maintenanceDaysLeft -= 1;
        // repair progress
        p.condition01 = Math.min(1, p.condition01 + 0.22);
        if (p.maintenanceDaysLeft <= 0) {
          p.status = 'available';
          p.maintenanceDaysLeft = 0;
        }
      }
    }

    // 2) staffing check
    const req = _requiredStaffForActiveRoutes(state);
    const havePilots = Number(state.staff.pilots) || 0;
    const haveCabin = Number(state.staff.cabin) || 0;
    const haveMech = Number(state.staff.mechanics) || 0;

    // shortage penalty impacts reputation & effective flights
    const shortage01 =
      (Math.max(0, req.reqPilots - havePilots) / Math.max(1, req.reqPilots)) * 0.5 +
      (Math.max(0, req.reqCabin - haveCabin) / Math.max(1, req.reqCabin)) * 0.35 +
      (Math.max(0, req.reqMechanics - haveMech) / Math.max(1, req.reqMechanics)) * 0.15;

    // 3) simulate routes
    let dayRevenue = 0;
    let dayCost = 0;
    let dayPax = 0;
    let dayFlights = 0;
    let repDeltaTotal = 0;

    for (const r of state.routes) {
      if (!r.active) continue;

      const result = estimateDailyForRoute(r, state, airportsByIata);
      r.lastResult = result;

      if (!result.ok) {
        repDeltaTotal += (result.repDelta || 0);
        continue;
      }

      // Apply staffing shortage effect: fewer flights actually operate
      let effFlightsDone = result.flightsDone;
      if (shortage01 > 0.001 && effFlightsDone > 0) {
        const drop = Math.min(effFlightsDone, Math.ceil(effFlightsDone * shortage01 * 0.65));
        effFlightsDone = Math.max(0, effFlightsDone - drop);
      }

      if (effFlightsDone !== result.flightsDone) {
        // recompute approximate scaling
        const scale = effFlightsDone / Math.max(1, result.flightsDone);
        result.flightsDone = effFlightsDone;
        result.pax = Math.round(result.pax * scale);
        result.revenue = Math.round(result.revenue * scale);
        result.cost = Math.round(result.cost * scale);
        result.profit = result.revenue - result.cost;
      }

      dayRevenue += result.revenue;
      dayCost += result.cost;
      dayPax += result.pax;
      dayFlights += result.flightsDone;

      repDeltaTotal += result.repDelta;

      // wear aircraft (per operated leg)
      const plane = _planeById(state, r.planeId);
      if (plane) {
        const model = window.FlySimAircraft.byId(plane.modelId);
        const wear = (model ? model.maintenanceWearPerLeg : 0.01) * result.flightsDone
          + (model ? model.maintenanceWearPerKm : 0.0000005) * (result.distanceKm * result.flightsDone);
        plane.condition01 = Math.max(0, plane.condition01 - wear);
        plane.cycles += result.flightsDone;
        // hours approximation
        const cruise = model ? model.cruiseKmh : 800;
        plane.hours += (result.distanceKm / Math.max(200, cruise)) * result.flightsDone;
      }
    }

    // 4) wages
    const wages = _wagesPerDay(state.staff);

    // 5) totals
    dayCost += wages + maintCost;

    const profit = dayRevenue - dayCost;
    state.company.cash += profit;

    // staffing shortage impacts reputation directly
    const repShort = -Math.min(0.02, shortage01 * 0.018);
    state.company.reputation01 = clamp01(state.company.reputation01 + repDeltaTotal + repShort);
    state.company.day += 1;

    state.stats.totalPax += dayPax;
    state.stats.totalFlights += dayFlights;
    state.stats.totalRevenue += dayRevenue;
    state.stats.totalCost += dayCost;
    state.stats.totalMaint += maintCost;
    state.stats.totalWages += wages;

    state.ledger.push({ day: state.company.day - 1, revenue: dayRevenue, cost: dayCost, profit, wages, maint: maintCost });
    if (state.ledger.length > 180) state.ledger.shift();

    state.updatedAt = Date.now();
    return { dayRevenue, dayCost, profit, dayPax, dayFlights, wages, maintCost, shortage01, req };
  }

  return { haversineKm, estimateDailyForRoute, advanceOneDay };
})();
