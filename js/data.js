// Estado inicial (offline, leve). Você pode expandir com bases maiores via DLC.
window.DEFAULT_GAME_STATE = {
  company: {
    name: "VALE Air",
    cash: 250000000,
    reputation01: 0.55,
    day: 1
  },
  airports: [
    { code: "GRU", city: "São Paulo", lat: -23.4356, lon: -46.4731 },
    { code: "GIG", city: "Rio de Janeiro", lat: -22.809, lon: -43.2506 },
    { code: "BSB", city: "Brasília", lat: -15.8692, lon: -47.9208 },
    { code: "CNF", city: "Belo Horizonte", lat: -19.6244, lon: -43.9719 },
    { code: "SSA", city: "Salvador", lat: -12.9086, lon: -38.3225 },
    { code: "REC", city: "Recife", lat: -8.1265, lon: -34.9236 },
    { code: "FOR", city: "Fortaleza", lat: -3.7763, lon: -38.5326 },
    { code: "POA", city: "Porto Alegre", lat: -29.9944, lon: -51.1714 }
  ],
  aircraftCatalog: [
    { modelId: "TP-72", name: "Turboprop 72", seats: 72, rangeKm: 1400, cruiseKts: 275, price: 110000000, fuelBurnPerKm: 1.1 },
    { modelId: "RJ-100", name: "Regional Jet 100", seats: 100, rangeKm: 2900, cruiseKts: 420, price: 180000000, fuelBurnPerKm: 1.6 },
    { modelId: "NB-180", name: "Narrowbody 180", seats: 180, rangeKm: 5600, cruiseKts: 450, price: 360000000, fuelBurnPerKm: 2.4 },
    { modelId: "WB-300", name: "Widebody 300", seats: 300, rangeKm: 12000, cruiseKts: 480, price: 900000000, fuelBurnPerKm: 4.6 }
  ],
  fleet: [
    // exemplo inicial
    { id: "A1", modelId: "RJ-100", nickname: "VALE-01", condition01: 0.95, inMaintenanceDays: 0 }
  ],
  routes: [
    // { id, from, to, price, freq, aircraftId, active }
  ],
  staff: {
    pilots: 6,
    crew: 10,
    mechanics: 4
  },
  lastDay: {
    revenue: 0,
    costs: 0,
    profit: 0,
    notes: []
  }
};

// Estado em uso (carregado no bootstrap)
window.flightData = null;
