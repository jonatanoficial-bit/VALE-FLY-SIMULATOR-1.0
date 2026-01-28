// Airports dataset (offline, lightweight)
// NOTE: This is a curated list of major airports + Brazil focus.
// You can expand this later by importing a full dataset.

window.FlySimAirports = (() => {
  /**
   * demand: 0.5..1.8 (higher = more passengers potential)
   */
  const AIRPORTS = [
    // Brazil
    { iata: 'GRU', name: 'São Paulo/Guarulhos', city: 'São Paulo', country: 'BR', lat: -23.4356, lon: -46.4731, demand: 1.8 },
    { iata: 'CGH', name: 'São Paulo/Congonhas', city: 'São Paulo', country: 'BR', lat: -23.6261, lon: -46.6566, demand: 1.4 },
    { iata: 'GIG', name: 'Rio de Janeiro/Galeão', city: 'Rio de Janeiro', country: 'BR', lat: -22.8099, lon: -43.2506, demand: 1.4 },
    { iata: 'SDU', name: 'Rio de Janeiro/Santos Dumont', city: 'Rio de Janeiro', country: 'BR', lat: -22.9105, lon: -43.1631, demand: 1.1 },
    { iata: 'BSB', name: 'Brasília', city: 'Brasília', country: 'BR', lat: -15.8692, lon: -47.9208, demand: 1.1 },
    { iata: 'CNF', name: 'Belo Horizonte/Confins', city: 'Belo Horizonte', country: 'BR', lat: -19.6244, lon: -43.9719, demand: 1.0 },
    { iata: 'SSA', name: 'Salvador', city: 'Salvador', country: 'BR', lat: -12.9086, lon: -38.3225, demand: 0.9 },
    { iata: 'REC', name: 'Recife', city: 'Recife', country: 'BR', lat: -8.1265, lon: -34.9236, demand: 0.9 },
    { iata: 'FOR', name: 'Fortaleza', city: 'Fortaleza', country: 'BR', lat: -3.7763, lon: -38.5326, demand: 0.85 },
    { iata: 'POA', name: 'Porto Alegre', city: 'Porto Alegre', country: 'BR', lat: -29.9934, lon: -51.1714, demand: 0.8 },
    { iata: 'CWB', name: 'Curitiba', city: 'Curitiba', country: 'BR', lat: -25.5285, lon: -49.1758, demand: 0.75 },
    { iata: 'FLN', name: 'Florianópolis', city: 'Florianópolis', country: 'BR', lat: -27.6705, lon: -48.5525, demand: 0.7 },
    { iata: 'MAO', name: 'Manaus', city: 'Manaus', country: 'BR', lat: -3.0386, lon: -60.0497, demand: 0.7 },
    { iata: 'BEL', name: 'Belém', city: 'Belém', country: 'BR', lat: -1.3793, lon: -48.4763, demand: 0.65 },
    // Americas
    { iata: 'MIA', name: 'Miami', city: 'Miami', country: 'US', lat: 25.7959, lon: -80.2870, demand: 1.3 },
    { iata: 'JFK', name: 'New York/JFK', city: 'New York', country: 'US', lat: 40.6413, lon: -73.7781, demand: 1.8 },
    { iata: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'US', lat: 33.9416, lon: -118.4085, demand: 1.7 },
    { iata: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'CA', lat: 43.6777, lon: -79.6248, demand: 1.2 },
    { iata: 'MEX', name: 'Mexico City', city: 'Mexico City', country: 'MX', lat: 19.4361, lon: -99.0719, demand: 1.3 },
    { iata: 'BOG', name: 'Bogotá', city: 'Bogotá', country: 'CO', lat: 4.7016, lon: -74.1469, demand: 1.0 },
    { iata: 'EZE', name: 'Buenos Aires/Ezeiza', city: 'Buenos Aires', country: 'AR', lat: -34.8222, lon: -58.5358, demand: 1.0 },
    { iata: 'SCL', name: 'Santiago', city: 'Santiago', country: 'CL', lat: -33.3929, lon: -70.7858, demand: 0.95 },
    // Europe
    { iata: 'LHR', name: 'London Heathrow', city: 'London', country: 'GB', lat: 51.4700, lon: -0.4543, demand: 1.8 },
    { iata: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'FR', lat: 49.0097, lon: 2.5479, demand: 1.7 },
    { iata: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'NL', lat: 52.3105, lon: 4.7683, demand: 1.4 },
    { iata: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'DE', lat: 50.0379, lon: 8.5622, demand: 1.5 },
    { iata: 'MAD', name: 'Madrid', city: 'Madrid', country: 'ES', lat: 40.4983, lon: -3.5676, demand: 1.2 },
    { iata: 'LIS', name: 'Lisbon', city: 'Lisbon', country: 'PT', lat: 38.7742, lon: -9.1342, demand: 1.0 },
    { iata: 'FCO', name: 'Rome Fiumicino', city: 'Rome', country: 'IT', lat: 41.8003, lon: 12.2389, demand: 1.2 },
    { iata: 'ZRH', name: 'Zurich', city: 'Zurich', country: 'CH', lat: 47.4647, lon: 8.5492, demand: 1.0 },
    // Middle East / Africa
    { iata: 'DXB', name: 'Dubai', city: 'Dubai', country: 'AE', lat: 25.2532, lon: 55.3657, demand: 1.6 },
    { iata: 'DOH', name: 'Doha', city: 'Doha', country: 'QA', lat: 25.2736, lon: 51.6081, demand: 1.2 },
    { iata: 'CAI', name: 'Cairo', city: 'Cairo', country: 'EG', lat: 30.1219, lon: 31.4056, demand: 1.0 },
    { iata: 'JNB', name: 'Johannesburg', city: 'Johannesburg', country: 'ZA', lat: -26.1367, lon: 28.2410, demand: 1.0 },
    // Asia / Oceania
    { iata: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'JP', lat: 35.5494, lon: 139.7798, demand: 1.7 },
    { iata: 'ICN', name: 'Seoul Incheon', city: 'Seoul', country: 'KR', lat: 37.4602, lon: 126.4407, demand: 1.4 },
    { iata: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'SG', lat: 1.3644, lon: 103.9915, demand: 1.6 },
    { iata: 'HKG', name: 'Hong Kong', city: 'Hong Kong', country: 'HK', lat: 22.3080, lon: 113.9185, demand: 1.5 },
    { iata: 'BKK', name: 'Bangkok', city: 'Bangkok', country: 'TH', lat: 13.6900, lon: 100.7501, demand: 1.2 },
    { iata: 'DEL', name: 'Delhi', city: 'Delhi', country: 'IN', lat: 28.5562, lon: 77.1000, demand: 1.3 },
    { iata: 'SYD', name: 'Sydney', city: 'Sydney', country: 'AU', lat: -33.9399, lon: 151.1753, demand: 1.2 },
  ];

  const byIata = new Map(AIRPORTS.map(a => [a.iata, a]));

  function search(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return AIRPORTS.slice(0, 20);
    return AIRPORTS
      .filter(a =>
        a.iata.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }

  function label(a) {
    return `${a.iata} • ${a.city} (${a.country})`;
  }

  return { AIRPORTS, byIata, search, label };
})();
