// Game state, versioned (Part 2)
// v2 adds: fleet, staff, route assignment to aircraft

window.FlySimState = (() => {
  const VERSION = 2;

  function cryptoRandomId() {
    const s = (typeof crypto !== 'undefined' && crypto.getRandomValues)
      ? crypto.getRandomValues(new Uint32Array(2))
      : [Math.floor(Math.random() * 2 ** 32), Math.floor(Math.random() * 2 ** 32)];
    return `${s[0].toString(16)}${s[1].toString(16)}`;
  }

  function newGame() {
    const starterPlaneId = cryptoRandomId();
    return {
      version: VERSION,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      company: {
        name: 'Sua Companhia',
        cash: 250_000_000,
        reputation01: 0.55,
        day: 1,
      },
      settings: {
        mapMode: 'offline', // 'offline' | 'online'
      },

      // Fleet owned by the player
      fleet: {
        planes: [
          {
            id: starterPlaneId,
            modelId: 'narrow_n3',
            name: 'Frota 01',
            condition01: 0.92,
            cycles: 0, // takeoffs/landings
            hours: 0,
            status: 'available', // 'available' | 'maintenance'
            maintenanceDaysLeft: 0,
          }
        ]
      },

      // Staff (aggregate; later parts may add individuals)
      staff: {
        pilots: 6,
        cabin: 14,
        mechanics: 10,
        // daily wage per employee (BRL)
        wagePilot: 1_250,
        wageCabin: 520,
        wageMechanic: 640,
      },

      routes: [
        // seed route assigned to starter plane
        { id: cryptoRandomId(), from: 'GRU', to: 'GIG', ticket: 650, flightsPerDay: 2, planeId: starterPlaneId, active: true, createdDay: 1, lastResult: null },
      ],

      stats: {
        totalPax: 0,
        totalFlights: 0,
        totalRevenue: 0,
        totalCost: 0,
        totalMaint: 0,
        totalWages: 0,
      },

      ledger: [
        // {day, revenue, cost, profit, wages, maint}
      ],
    };
  }

  function _ensureDefaultsV2(s) {
    if (!s.settings) s.settings = { mapMode: 'offline' };
    if (!s.fleet || !Array.isArray(s.fleet.planes)) s.fleet = { planes: [] };
    if (!s.staff) {
      s.staff = { pilots: 0, cabin: 0, mechanics: 0, wagePilot: 1250, wageCabin: 520, wageMechanic: 640 };
    } else {
      if (typeof s.staff.wagePilot !== 'number') s.staff.wagePilot = 1250;
      if (typeof s.staff.wageCabin !== 'number') s.staff.wageCabin = 520;
      if (typeof s.staff.wageMechanic !== 'number') s.staff.wageMechanic = 640;
    }
    if (!Array.isArray(s.routes)) s.routes = [];
    if (!s.stats) s.stats = { totalPax: 0, totalFlights: 0, totalRevenue: 0, totalCost: 0, totalMaint: 0, totalWages: 0 };
    if (!Array.isArray(s.ledger)) s.ledger = [];
  }

  function migrateFromV1(v1) {
    // Convert simple routes into fleet-based routes with one starter plane
    const starterPlaneId = cryptoRandomId();
    const v2 = {
      version: VERSION,
      createdAt: v1.createdAt || Date.now(),
      updatedAt: Date.now(),
      company: v1.company || { name: 'Sua Companhia', cash: 250_000_000, reputation01: 0.55, day: 1 },
      settings: v1.settings || { mapMode: 'offline' },
      fleet: {
        planes: [
          {
            id: starterPlaneId,
            modelId: 'narrow_n3',
            name: 'Frota 01',
            condition01: 0.9,
            cycles: 0,
            hours: 0,
            status: 'available',
            maintenanceDaysLeft: 0,
          }
        ]
      },
      staff: {
        pilots: 6,
        cabin: 14,
        mechanics: 10,
        wagePilot: 1250,
        wageCabin: 520,
        wageMechanic: 640,
      },
      routes: Array.isArray(v1.routes) ? v1.routes.map((r, idx) => ({
        id: r.id || cryptoRandomId(),
        from: r.from,
        to: r.to,
        ticket: r.ticket || 650,
        flightsPerDay: r.flightsPerDay || 1,
        planeId: starterPlaneId,
        active: r.active !== false,
        createdDay: r.createdDay || 1,
        lastResult: r.lastResult || null,
      })) : [],
      stats: Object.assign({ totalMaint: 0, totalWages: 0 }, v1.stats || {}),
      ledger: Array.isArray(v1.ledger) ? v1.ledger.map(x => Object.assign({ wages: 0, maint: 0 }, x)) : [],
    };
    return v2;
  }

  function sanitizeState(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const v = raw.version || 0;

    // v1 -> v2 migration
    if (v === 1) {
      raw = migrateFromV1(raw);
    }

    if (raw.version !== VERSION) return null;

    if (!raw.company || typeof raw.company.cash !== 'number') return null;

    _ensureDefaultsV2(raw);

    // validate fleet planes
    raw.fleet.planes = raw.fleet.planes.filter(p => p && typeof p.id === 'string' && typeof p.modelId === 'string');
    for (const p of raw.fleet.planes) {
      if (typeof p.condition01 !== 'number') p.condition01 = 0.9;
      p.condition01 = Math.max(0, Math.min(1, p.condition01));
      if (!p.status) p.status = 'available';
      if (typeof p.maintenanceDaysLeft !== 'number') p.maintenanceDaysLeft = 0;
      if (typeof p.cycles !== 'number') p.cycles = 0;
      if (typeof p.hours !== 'number') p.hours = 0;
      if (!p.name) p.name = 'Aeronave';
    }

    // validate routes
    raw.routes = raw.routes.map(r => ({
      id: r.id || cryptoRandomId(),
      from: r.from,
      to: r.to,
      ticket: Math.max(50, Number(r.ticket) || 650),
      flightsPerDay: Math.max(1, Math.min(10, Number(r.flightsPerDay) || 1)),
      planeId: r.planeId || (raw.fleet.planes[0] ? raw.fleet.planes[0].id : null),
      active: r.active !== false,
      createdDay: r.createdDay || raw.company.day || 1,
      lastResult: r.lastResult || null,
    })).filter(r => r.from && r.to);

    raw.updatedAt = Date.now();
    return raw;
  }

  return { VERSION, newGame, sanitizeState };
})();
