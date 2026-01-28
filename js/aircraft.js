// Aircraft catalog (Part 2)
// Generic (non-branded) aircraft inspired by real-world categories.

window.FlySimAircraft = (() => {
  const CATALOG = [
    {
      id: 'turboprop_r1',
      name: 'Turboprop Regional R1',
      type: 'turboprop',
      capacity: 78,
      rangeKm: 2200,
      cruiseKmh: 520,
      fuelBurnPerKm: 18, // BRL per km (abstract)
      fixedPerFlight: 18000,
      maintenanceWearPerLeg: 0.007,
      maintenanceWearPerKm: 0.00000035,
      maintenanceCostPerDay: 220_000,
      price: 48_000_000,
    },
    {
      id: 'regional_j2',
      name: 'Jato Regional J2',
      type: 'regional_jet',
      capacity: 110,
      rangeKm: 3200,
      cruiseKmh: 780,
      fuelBurnPerKm: 28,
      fixedPerFlight: 24000,
      maintenanceWearPerLeg: 0.008,
      maintenanceWearPerKm: 0.00000045,
      maintenanceCostPerDay: 320_000,
      price: 78_000_000,
    },
    {
      id: 'narrow_n3',
      name: 'Narrow-body N3',
      type: 'narrow_body',
      capacity: 180,
      rangeKm: 5600,
      cruiseKmh: 830,
      fuelBurnPerKm: 36,
      fixedPerFlight: 32000,
      maintenanceWearPerLeg: 0.009,
      maintenanceWearPerKm: 0.00000055,
      maintenanceCostPerDay: 480_000,
      price: 130_000_000,
    },
    {
      id: 'narrow_long_n4',
      name: 'Narrow-body Long Range N4',
      type: 'narrow_body',
      capacity: 210,
      rangeKm: 7200,
      cruiseKmh: 850,
      fuelBurnPerKm: 40,
      fixedPerFlight: 36000,
      maintenanceWearPerLeg: 0.0095,
      maintenanceWearPerKm: 0.00000060,
      maintenanceCostPerDay: 560_000,
      price: 168_000_000,
    },
    {
      id: 'wide_w1',
      name: 'Wide-body W1',
      type: 'wide_body',
      capacity: 320,
      rangeKm: 14000,
      cruiseKmh: 900,
      fuelBurnPerKm: 62,
      fixedPerFlight: 52000,
      maintenanceWearPerLeg: 0.012,
      maintenanceWearPerKm: 0.00000075,
      maintenanceCostPerDay: 920_000,
      price: 420_000_000,
    },
  ];

  function byId(id) {
    return CATALOG.find(a => a.id === id) || null;
  }

  function list() {
    return CATALOG.slice();
  }

  return { CATALOG, byId, list };
})();
