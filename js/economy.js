// Economia simples (Parte 1/2): lucro por rota baseado em distância, preço e eficiência.
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

  window.Economy = {
    distanceKm(fromCode, toCode){
      const a = flightData.airports.find(x=>x.code===fromCode);
      const b = flightData.airports.find(x=>x.code===toCode);
      if(!a||!b) return 0;
      return haversineKm(a.lat,a.lon,b.lat,b.lon);
    },

    advanceDay(){
      // salários
      const salary = (flightData.staff.pilots*1800) + (flightData.staff.crew*900) + (flightData.staff.mechanics*1200);

      // manutenção em andamento
      let maintCost = 0;
      for(const ac of flightData.fleet){
        if(ac.inMaintenanceDays>0){
          maintCost += 7500000; // custo/dia
          ac.inMaintenanceDays -= 1;
          ac.condition01 = clamp01(ac.condition01 + 0.2);
        }
      }

      // receita por rotas
      let revenue = 0;
      let opCost = 0;
      let canceled = 0;

      for(const r of flightData.routes){
        if(!r.active) continue;

        const ac = flightData.fleet.find(x=>x.id===r.aircraftId);
        if(!ac) continue;
        if(ac.inMaintenanceDays>0) { canceled += r.freq; continue; }

        // risco de cancelamento por condição baixa
        const risk = Math.max(0, (0.35 - ac.condition01)); // abaixo de 35% começa risco
        const cancelProb = clamp01(risk * 2.2);

        const dist = Economy.distanceKm(r.from, r.to);
        const model = flightData.aircraftCatalog.find(m=>m.modelId===ac.modelId);
        if(!model || dist<=0) continue;

        // demanda simplificada: baseada em reputação e distância (curtas e médias tem mais giro)
        const baseDemand = 0.55 + (flightData.company.reputation01*0.5);
        const distPenalty = Math.min(0.35, dist/12000); // longas reduzem ocupação
        const loadFactor = clamp01(baseDemand - distPenalty);

        const seats = model.seats;
        const paxPerFlight = Math.round(seats * loadFactor);

        for(let i=0;i<r.freq;i++){
          if(Math.random() < cancelProb){
            canceled += 1;
            // penaliza reputação
            flightData.company.reputation01 = clamp01(flightData.company.reputation01 - 0.01);
            continue;
          }

          revenue += paxPerFlight * r.price;

          // custos (combustível + taxas)
          const fuel = dist * model.fuelBurnPerKm * 4200; // R$ por "unidade" de combustível
          const fees = 1200000 + dist*120; // taxas
          opCost += fuel + fees;

          // desgaste
          ac.condition01 = clamp01(ac.condition01 - (0.010 + dist/250000));

          // reputação sobe com operação estável
          flightData.company.reputation01 = clamp01(flightData.company.reputation01 + 0.0005);
        }
      }

      const costs = salary + maintCost + opCost;
      const profit = revenue - costs;
      flightData.company.cash += profit;
      flightData.company.day += 1;

      flightData.lastDay = {
        revenue: Math.round(revenue),
        costs: Math.round(costs),
        profit: Math.round(profit),
        salary: Math.round(salary),
        maintCost: Math.round(maintCost),
        opCost: Math.round(opCost),
        canceled
      };

      return flightData.lastDay;
    }
  };
})();
