// Estado inicial (offline) — Core Gameplay + Mercado/IA/Eventos (Etapa: Mercado Vivo)
window.DEFAULT_GAME_STATE = {
  company: {
    level: 1,
    xp: 0,

    name: "Vale Fly",
    cash: 250000000,
    reputation01: 0.55,
    day: 1
  },
  // Aeroportos globais (amostra). Você pode ampliar via pacotes/DLC.
  airports: [
    {"code": "GRU", "city": "São Paulo", "country": "Brasil", "name": "São Paulo", "lat": -23.4356, "lon": -46.4731, "runwayM": 3700, "tier": "mega"},
    {"code": "GIG", "city": "Rio de Janeiro", "country": "Brasil", "name": "Rio de Janeiro", "lat": -22.809, "lon": -43.2506, "runwayM": 4000, "tier": "mega"},
    {"code": "BSB", "city": "Brasília", "country": "Brasil", "name": "Brasília", "lat": -15.8692, "lon": -47.9208, "runwayM": 3300, "tier": "hub"},
    {"code": "SSA", "city": "Salvador", "country": "Brasil", "name": "Salvador", "lat": -12.9086, "lon": -38.3225, "runwayM": 3000, "tier": "hub"},
    {"code": "REC", "city": "Recife", "country": "Brasil", "name": "Recife", "lat": -8.1265, "lon": -34.9236, "runwayM": 3000, "tier": "hub"},
    {"code": "FOR", "city": "Fortaleza", "country": "Brasil", "name": "Fortaleza", "lat": -3.7763, "lon": -38.5326, "runwayM": 2755, "tier": "hub"},
    {"code": "POA", "city": "Porto Alegre", "country": "Brasil", "name": "Porto Alegre", "lat": -29.9935, "lon": -51.1714, "runwayM": 2280, "tier": "mid"},
    {"code": "CWB", "city": "Curitiba", "country": "Brasil", "name": "Curitiba", "lat": -25.5285, "lon": -49.1758, "runwayM": 2215, "tier": "mid"},
    {"code": "BEL", "city": "Belém", "country": "Brasil", "name": "Belém", "lat": -1.3793, "lon": -48.4763, "runwayM": 2800, "tier": "mid"},
    {"code": "MAO", "city": "Manaus", "country": "Brasil", "name": "Manaus", "lat": -3.0386, "lon": -60.0497, "runwayM": 2700, "tier": "mid"},
    {"code": "LIS", "city": "Lisboa", "country": "Portugal", "name": "Lisboa", "lat": 38.7742, "lon": -9.1342, "runwayM": 3805, "tier": "hub"},
    {"code": "MAD", "city": "Madri", "country": "Espanha", "name": "Madri", "lat": 40.4983, "lon": -3.5676, "runwayM": 3500, "tier": "mega"},
    {"code": "CDG", "city": "Paris", "country": "França", "name": "Paris", "lat": 49.0097, "lon": 2.5479, "runwayM": 4215, "tier": "mega"},
    {"code": "LHR", "city": "Londres", "country": "Reino Unido", "name": "Londres", "lat": 51.47, "lon": -0.4543, "runwayM": 3902, "tier": "mega"},
    {"code": "FRA", "city": "Frankfurt", "country": "Alemanha", "name": "Frankfurt", "lat": 50.0379, "lon": 8.5622, "runwayM": 4000, "tier": "mega"},
    {"code": "AMS", "city": "Amsterdã", "country": "Holanda", "name": "Amsterdã", "lat": 52.3105, "lon": 4.7683, "runwayM": 3500, "tier": "mega"},
    {"code": "MXP", "city": "Milão", "country": "Itália", "name": "Milão", "lat": 45.6301, "lon": 8.7231, "runwayM": 3920, "tier": "hub"},
    {"code": "JFK", "city": "New York", "country": "EUA", "name": "New York", "lat": 40.6413, "lon": -73.7781, "runwayM": 4441, "tier": "mega"},
    {"code": "LAX", "city": "Los Angeles", "country": "EUA", "name": "Los Angeles", "lat": 33.9416, "lon": -118.4085, "runwayM": 3682, "tier": "mega"},
    {"code": "ORD", "city": "Chicago", "country": "EUA", "name": "Chicago", "lat": 41.9742, "lon": -87.9073, "runwayM": 3962, "tier": "mega"},
    {"code": "MIA", "city": "Miami", "country": "EUA", "name": "Miami", "lat": 25.7959, "lon": -80.287, "runwayM": 3962, "tier": "hub"},
    {"code": "YYZ", "city": "Toronto", "country": "Canadá", "name": "Toronto", "lat": 43.6777, "lon": -79.6248, "runwayM": 3389, "tier": "hub"},
    {"code": "MEX", "city": "Cidade do México", "country": "México", "name": "Cidade do México", "lat": 19.4361, "lon": -99.0719, "runwayM": 3900, "tier": "mega"},
    {"code": "BOG", "city": "Bogotá", "country": "Colômbia", "name": "Bogotá", "lat": 4.7016, "lon": -74.1469, "runwayM": 3800, "tier": "hub"},
    {"code": "SCL", "city": "Santiago", "country": "Chile", "name": "Santiago", "lat": -33.3929, "lon": -70.7858, "runwayM": 3800, "tier": "hub"},
    {"code": "EZE", "city": "Buenos Aires", "country": "Argentina", "name": "Buenos Aires", "lat": -34.8222, "lon": -58.5358, "runwayM": 3300, "tier": "hub"},
    {"code": "LIM", "city": "Lima", "country": "Peru", "name": "Lima", "lat": -12.0219, "lon": -77.1143, "runwayM": 3507, "tier": "hub"},
    {"code": "PTY", "city": "Panamá", "country": "Panamá", "name": "Panamá", "lat": 9.0714, "lon": -79.3835, "runwayM": 3050, "tier": "hub"},
    {"code": "DXB", "city": "Dubai", "country": "EAU", "name": "Dubai", "lat": 25.2532, "lon": 55.3657, "runwayM": 4000, "tier": "mega"},
    {"code": "DOH", "city": "Doha", "country": "Catar", "name": "Doha", "lat": 25.2731, "lon": 51.608, "runwayM": 4850, "tier": "mega"},
    {"code": "IST", "city": "Istambul", "country": "Turquia", "name": "Istambul", "lat": 41.2753, "lon": 28.7519, "runwayM": 4100, "tier": "mega"},
    {"code": "CAI", "city": "Cairo", "country": "Egito", "name": "Cairo", "lat": 30.112, "lon": 31.4, "runwayM": 4000, "tier": "hub"},
    {"code": "JNB", "city": "Johannesburgo", "country": "África do Sul", "name": "Johannesburgo", "lat": -26.1337, "lon": 28.242, "runwayM": 4400, "tier": "hub"},
    {"code": "NBO", "city": "Nairobi", "country": "Quênia", "name": "Nairobi", "lat": -1.3192, "lon": 36.9278, "runwayM": 4117, "tier": "mid"},
    {"code": "DEL", "city": "Delhi", "country": "Índia", "name": "Delhi", "lat": 28.5562, "lon": 77.1, "runwayM": 4430, "tier": "mega"},
    {"code": "BOM", "city": "Mumbai", "country": "Índia", "name": "Mumbai", "lat": 19.0896, "lon": 72.8656, "runwayM": 3445, "tier": "mega"},
    {"code": "BKK", "city": "Bangkok", "country": "Tailândia", "name": "Bangkok", "lat": 13.69, "lon": 100.7501, "runwayM": 4000, "tier": "mega"},
    {"code": "SIN", "city": "Singapura", "country": "Singapura", "name": "Singapura", "lat": 1.3644, "lon": 103.9915, "runwayM": 4000, "tier": "mega"},
    {"code": "HND", "city": "Tóquio", "country": "Japão", "name": "Tóquio", "lat": 35.5494, "lon": 139.7798, "runwayM": 3000, "tier": "mega"},
    {"code": "ICN", "city": "Seul", "country": "Coreia do Sul", "name": "Seul", "lat": 37.4602, "lon": 126.4407, "runwayM": 4000, "tier": "mega"},
    {"code": "SYD", "city": "Sydney", "country": "Austrália", "name": "Sydney", "lat": -33.9399, "lon": 151.1753, "runwayM": 3962, "tier": "hub"}
  ],
  aircraftCatalog: [
    {"modelId": "A320", "name": "Airbus A320", "seats": 180, "rangeKm": 6100, "price": 98000000, "fuelBurnPerKm": 2.6},
    {"modelId": "A320NEO", "name": "Airbus A320neo", "seats": 186, "rangeKm": 6500, "price": 112000000, "fuelBurnPerKm": 2.3},
    {"modelId": "A321", "name": "Airbus A321", "seats": 220, "rangeKm": 7400, "price": 129000000, "fuelBurnPerKm": 2.9},
    {"modelId": "B738", "name": "Boeing 737-800", "seats": 174, "rangeKm": 5600, "price": 97000000, "fuelBurnPerKm": 2.7},
    {"modelId": "B737MAX", "name": "Boeing 737 MAX", "seats": 178, "rangeKm": 6700, "price": 121000000, "fuelBurnPerKm": 2.4},
    {"modelId": "E195E2", "name": "Embraer E195-E2", "seats": 132, "rangeKm": 4800, "price": 61000000, "fuelBurnPerKm": 1.9},
    {"modelId": "ATR72", "name": "ATR 72-600", "seats": 70, "rangeKm": 1500, "price": 28000000, "fuelBurnPerKm": 0.9},
    {"modelId": "A330", "name": "Airbus A330-300", "seats": 260, "rangeKm": 11750, "price": 238000000, "fuelBurnPerKm": 5.2},
    {"modelId": "B787", "name": "Boeing 787-8", "seats": 242, "rangeKm": 13620, "price": 248000000, "fuelBurnPerKm": 4.9},

    {"modelId": "TP-72", "name": "TurboProp 72", "seats": 72, "rangeKm": 1500, "price": 45000000, "fuelBurnPerKm": 1.2},
    {"modelId": "RJ-100", "name": "Regional Jet 100", "seats": 100, "rangeKm": 3200, "price": 85000000, "fuelBurnPerKm": 1.8},
    {"modelId": "NB-180", "name": "NarrowBody 180", "seats": 180, "rangeKm": 6000, "price": 220000000, "fuelBurnPerKm": 2.6},
    {"modelId": "WB-300", "name": "WideBody 300", "seats": 300, "rangeKm": 13500, "price": 620000000, "fuelBurnPerKm": 4.1},
    {"modelId": "JB-450", "name": "Jumbo 450", "seats": 450, "rangeKm": 12000, "price": 880000000, "fuelBurnPerKm": 5.2}
  ],
  fleet: [],
  routes: [],
  staff: {
    pilots: 4,
    crew: 8,
    mechanics: 3
  },
  progress: {
  level: 1,
  xp: 0,
  unlockedTiers: ["mid"],
  unlockedModels: []
},
hubs: {},
objectives: {
  activeId: "startup",
  completed: {}
},

  marketing: { dailyBudget: 0, active: {} },
  rd: { owned:{}, fuelMult:1, maintMult:1, loadBonus01:0, repBonus01:0 },
  alliances: { owned:{}, intlLoadBonus01:0, airportFeeMult:1, longRevenueMult:1 },

market: {
    // multipliers globais do dia (eventos mexem aqui)
    demandMult01: 1.0,
    fuelPricePerUnit: 4200, // escala compatível com economy.js atual
    competitors: [
      {
        id: "AEROX",
        name: "AeroX",
        reputation01: 0.60,
        cash: 999999999,
        routes: []
      },
      {
        id: "SKYWAVE",
        name: "SkyWave",
        reputation01: 0.52,
        cash: 999999999,
        routes: []
      }
    ],
    lastEvent: null
  },
  lastDay: {
    revenue: 0,
    costs: 0,
    profit: 0,
    notes: []
  }
};

window.flightData = null;
