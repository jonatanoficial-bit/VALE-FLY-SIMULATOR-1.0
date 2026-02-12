// data/cities.js
// NUNCA renomeie para Cities.js (GitHub Pages diferencia maiúsculas).
window.CITIES = [
  {
    id: "br_sp",
    country: "BR",
    name: "São Paulo (Simulação)",
    greetingPolice: "190, Polícia Militar. Qual sua emergência?",
    greetingFire: "193, Bombeiros. Qual sua emergência?",
    units: {
      police: [
        { id: "sp_pm_area", name: "PM Área (VTR)", role: "patrol" },
        { id: "sp_rota", name: "ROTA", role: "tactical" },
        { id: "sp_choque", name: "Choque", role: "riot" },
        { id: "sp_gate", name: "GATE (Antibomba)", role: "bomb" },
        { id: "sp_aguia", name: "Águia (Helicóptero)", role: "air" },
        { id: "sp_civil", name: "Polícia Civil (Investigação)", role: "investigation" }
      ],
      fire: [
        { id: "sp_ab", name: "Auto Bomba (AB)", role: "fire" },
        { id: "sp_ae", name: "Auto Escada (AE)", role: "fire_support" },
        { id: "sp_ar", name: "Auto Resgate (AR)", role: "rescue" },
        { id: "sp_usa", name: "USA (Ambulância)", role: "ems" },
        { id: "sp_salv", name: "Salvamento", role: "special_rescue" },
        { id: "sp_haz", name: "Produtos Perigosos", role: "hazmat" }
      ]
    }
  },

  {
    id: "br_rio",
    country: "BR",
    name: "Rio de Janeiro (190/193)",
    greetingPolice: "190, Polícia Militar do Rio. Qual sua emergência?",
    greetingFire: "193, Bombeiros do Rio. Qual sua emergência?",
    units: {
      police: [
        { id: "rio_pmerj", name: "PMERJ Área (VTR)", role: "patrol" },
        { id: "rio_bope", name: "BOPE", role: "tactical" },
        { id: "rio_choque", name: "BPChq (Choque)", role: "riot" },
        { id: "rio_antibomba", name: "Esquadrão Antibomba", role: "bomb" },
        { id: "rio_gam", name: "GAM (Helicóptero)", role: "air" },
        { id: "rio_civil", name: "Polícia Civil (Investigação)", role: "investigation" }
      ],
      fire: [
        { id: "rio_ab", name: "CBMERJ Auto Bomba (AB)", role: "fire" },
        { id: "rio_ae", name: "Auto Escada (AE)", role: "fire_support" },
        { id: "rio_ar", name: "Auto Resgate (AR)", role: "rescue" },
        { id: "rio_ems", name: "Ambulância (SAMU/CBMERJ)", role: "ems" },
        { id: "rio_salv", name: "Salvamento", role: "special_rescue" },
        { id: "rio_haz", name: "Produtos Perigosos", role: "hazmat" }
      ]
    }
  },

  {
    id: "br_df",
    country: "BR",
    name: "Brasília (DF)",
    greetingPolice: "190, Polícia Militar do DF. Qual sua emergência?",
    greetingFire: "193, Corpo de Bombeiros do DF. Qual sua emergência?",
    units: {
      police: [
        { id: "df_pm_area", name: "PMDF Área (VTR)", role: "patrol" },
        { id: "df_bopec", name: "BOPE (Operações Especiais)", role: "tactical" },
        { id: "df_aereo", name: "Apoio Aéreo", role: "air" }
      ],
      fire: [
        { id: "df_ab", name: "AB (Auto Bomba)", role: "fire" },
        { id: "df_ae", name: "Auto Escada (AE)", role: "fire_support" },
        { id: "df_resg", name: "Resgate", role: "rescue" },
        { id: "df_amb", name: "Ambulância", role: "ems" }
      ]
    }
  },

  {
    id: "us_nyc",
    country: "US",
    name: "New York (911)",
    greetingPolice: "911, what's your emergency?",
    greetingFire: "911, fire/EMS. What's the address of the emergency?",
    units: {
      police: [
        { id: "ny_patrol", name: "NYPD Patrol", role: "patrol" },
        { id: "ny_esu", name: "NYPD ESU", role: "tactical" },
        { id: "ny_k9", name: "NYPD K9", role: "k9" },
        { id: "ny_bomb", name: "Bomb Squad", role: "bomb" },
        { id: "ny_heli", name: "Aviation Unit", role: "air" },
        { id: "ny_fbi", name: "FBI Liaison", role: "federal" }
      ],
      fire: [
        { id: "fd_engine", name: "FDNY Engine", role: "fire" },
        { id: "fd_ladder", name: "FDNY Ladder", role: "fire_support" },
        { id: "fd_rescue", name: "FDNY Rescue", role: "special_rescue" },
        { id: "fd_haz", name: "FDNY HazMat", role: "hazmat" },
        { id: "fd_ems", name: "FDNY EMS Ambulance", role: "ems" }
      ]
    }
  },

  {
    id: "us_lax",
    country: "US",
    name: "Los Angeles (911)",
    greetingPolice: "911, what's your emergency?",
    greetingFire: "911, fire/EMS. What's the address of the emergency?",
    units: {
      police: [
        { id: "la_patrol", name: "LAPD Patrol", role: "patrol" },
        { id: "la_swat", name: "LAPD SWAT", role: "tactical" },
        { id: "la_air", name: "LAPD Air Support", role: "air" },
        { id: "la_bomb", name: "LAPD Bomb Squad", role: "bomb" },
        { id: "la_k9", name: "LAPD K9", role: "k9" },
        { id: "la_fbi", name: "FBI Liaison", role: "federal" }
      ],
      fire: [
        { id: "la_engine", name: "LAFD Engine", role: "fire" },
        { id: "la_truck", name: "LAFD Truck (Ladder)", role: "fire_support" },
        { id: "la_rescue", name: "LAFD Rescue", role: "special_rescue" },
        { id: "la_haz", name: "LAFD HazMat", role: "hazmat" },
        { id: "la_ems", name: "Paramedic Ambulance", role: "ems" }
      ]
    }
  },

  {
    id: "eu_ldn",
    country: "GB",
    name: "London (999/112)",
    greetingPolice: "999, police. What's your emergency?",
    greetingFire: "999, fire and rescue. What's the address?",
    units: {
      police: [
        { id: "ldn_patrol", name: "Met Police Response", role: "patrol" },
        { id: "ldn_armed", name: "ARV (Armed Response)", role: "tactical" },
        { id: "ldn_ct", name: "Counter Terror", role: "federal" },
        { id: "ldn_public", name: "Public Order Unit", role: "riot" },
        { id: "ldn_eod", name: "Explosive Ordnance Disposal (EOD)", role: "bomb" }
      ],
      fire: [
        { id: "ldn_pump", name: "Fire Engine (Pump)", role: "fire" },
        { id: "ldn_aerial", name: "Aerial Ladder Platform", role: "fire_support" },
        { id: "ldn_rescue", name: "Urban Search & Rescue", role: "special_rescue" },
        { id: "ldn_ems", name: "Ambulance", role: "ems" }
      ]
    }
  },

  {
    id: "fr_paris",
    country: "FR",
    name: "Paris (17/18/112)",
    greetingPolice: "17, Police secours. Quelle est votre urgence?",
    greetingFire: "18, Sapeurs-pompiers. Quelle est l'adresse de l'urgence?",
    units: {
      police: [
        { id: "par_patrol", name: "Police Nationale - Patrouille", role: "patrol" },
        { id: "par_bri", name: "BRI", role: "tactical" },
        { id: "par_raid", name: "RAID (Unité d'intervention)", role: "federal" },
        { id: "par_crs", name: "CRS (Maintien de l'ordre)", role: "riot" },
        { id: "par_k9", name: "Unité canine", role: "k9" },
        { id: "par_bomb", name: "Démineurs (Antibombe)", role: "bomb" },
        { id: "par_air", name: "Appui aérien", role: "air" },
        { id: "par_pj", name: "Police Judiciaire (PJ)", role: "investigation" }
      ],
      fire: [
        { id: "par_bspp", name: "BSPP - Fourgon", role: "fire" },
        { id: "par_ladder", name: "BSPP - Échelle", role: "fire_support" },
        { id: "par_vsav", name: "BSPP - Secours à victimes (VSAV)", role: "ems" },
        { id: "par_usar", name: "BSPP - USAR", role: "special_rescue" },
        { id: "par_haz", name: "BSPP - HazMat", role: "hazmat" }
      ]
    }
  },

  {
    id: "de_berlin",
    country: "DE",
    name: "Berlin (110/112)",
    greetingPolice: "110, Polizei. Was ist Ihr Notfall?",
    greetingFire: "112, Feuerwehr. Wo ist der Notfall?",
    units: {
      police: [
        { id: "ber_patrol", name: "Polizei Berlin - Streife", role: "patrol" },
        { id: "ber_sek", name: "SEK", role: "tactical" },
        { id: "ber_bpol", name: "Bundespolizei", role: "federal" },
        { id: "ber_bepo", name: "Bereitschaftspolizei", role: "riot" },
        { id: "ber_k9", name: "Hundeführer (K9)", role: "k9" },
        { id: "ber_bomb", name: "Entschärfer (Bomb)", role: "bomb" },
        { id: "ber_air", name: "Polizeihubschrauber", role: "air" },
        { id: "ber_kripo", name: "Kriminalpolizei (KriPo)", role: "investigation" }
      ],
      fire: [
        { id: "ber_engine", name: "Berliner Feuerwehr - Löschfahrzeug", role: "fire" },
        { id: "ber_ladder", name: "Drehleiter", role: "fire_support" },
        { id: "ber_rescue", name: "Rüstwagen (Rescue)", role: "rescue" },
        { id: "ber_ems", name: "Rettungswagen (Ambulance)", role: "ems" },
        { id: "ber_haz", name: "Gefahrgut (HazMat)", role: "hazmat" }
      ]
    }
  },

  {
    id: "it_rome",
    country: "IT",
    name: "Rome (112/115/118)",
    greetingPolice: "112, Polizia. Qual è la tua emergenza?",
    greetingFire: "115, Vigili del Fuoco. Qual è l'emergenza?",
    units: {
      police: [
        { id: "rom_ps", name: "Polizia di Stato - Volante", role: "patrol" },
        { id: "rom_cc", name: "Carabinieri - Pattuglia", role: "patrol" },
        { id: "rom_nocs", name: "NOCS (Unità speciale)", role: "tactical" },
        { id: "rom_digos", name: "DIGOS (Investigazione)", role: "investigation" },
        { id: "rom_rm", name: "Reparto Mobile (Riot)", role: "riot" },
        { id: "rom_cc_sup", name: "Carabinieri (Support)", role: "federal" },
        { id: "rom_k9", name: "Unità cinofila (K9)", role: "k9" },
        { id: "rom_bomb", name: "Artificieri (Antibomba)", role: "bomb" },
        { id: "rom_air", name: "Elicottero", role: "air" }
      ],
      fire: [
        { id: "rom_vvf", name: "Vigili del Fuoco - APS", role: "fire" },
        { id: "rom_ladder", name: "Autoscala", role: "fire_support" },
        { id: "rom_rescue", name: "Soccorso (Rescue)", role: "rescue" },
        { id: "rom_ems", name: "118 Ambulanza", role: "ems" },
        { id: "rom_haz", name: "NBCR (HazMat)", role: "hazmat" }
      ]
    }
  },

  {
    id: "ca_toronto",
    country: "CA",
    name: "Toronto (911)",
    greetingPolice: "911, what's your emergency?",
    greetingFire: "911, fire/EMS. What's the address of the emergency?",
    units: {
      police: [
        { id: "tor_patrol", name: "Toronto Police - Patrol", role: "patrol" },
        { id: "tor_etf", name: "Emergency Task Force", role: "tactical" },
        { id: "tor_pou", name: "Public Order Unit", role: "riot" },
        { id: "tor_detect", name: "Detectives (Investigations)", role: "investigation" },
        { id: "tor_k9", name: "Canine Unit", role: "k9" },
        { id: "tor_bomb", name: "Explosive Disposal Unit", role: "bomb" },
        { id: "tor_air", name: "Air Support", role: "air" }
      ],
      fire: [
        { id: "tor_pumper", name: "Toronto Fire - Pumper", role: "fire" },
        { id: "tor_aerial", name: "Aerial Ladder", role: "fire_support" },
        { id: "tor_rescue", name: "Rescue", role: "rescue" },
        { id: "tor_ems", name: "Paramedic Services", role: "ems" },
        { id: "tor_haz", name: "HazMat", role: "hazmat" }
      ]
    }
  },

  {
    id: "jp_tokyo",
    country: "JP",
    name: "Tokyo (110/119)",
    greetingPolice: "110, police. What is your emergency?",
    greetingFire: "119, fire/ambulance. What is the address?",
    units: {
      police: [
        { id: "tk_patrol", name: "Kōban Patrol", role: "patrol" },
        { id: "tk_sit", name: "Special Investigation Team", role: "investigation" },
        { id: "tk_tactical", name: "Tactical Unit", role: "tactical" }
      ],
      fire: [
        { id: "tk_engine", name: "Fire Engine", role: "fire" },
        { id: "tk_ladder", name: "Ladder Truck", role: "fire_support" },
        { id: "tk_rescue", name: "Rescue Unit", role: "rescue" },
        { id: "tk_amb", name: "Ambulance", role: "ems" }
      ]
    }
  },

  {
    id: "au_syd",
    country: "AU",
    name: "Sydney (000)",
    greetingPolice: "000, do you need Police, Fire or Ambulance?",
    greetingFire: "000, Fire and Rescue. What's the location?",
    units: {
      police: [
        { id: "au_patrol", name: "NSW Police (General Duties)", role: "patrol" },
        { id: "au_sog", name: "SOG (Tactical)", role: "tactical" }
      ],
      fire: [
        { id: "au_engine", name: "Fire & Rescue Engine", role: "fire" },
        { id: "au_rescue", name: "Rescue", role: "rescue" },
        { id: "au_amb", name: "Ambulance", role: "ems" }
      ]
    }
  },

  {
    id: "za_jhb",
    country: "ZA",
    name: "Johannesburg (112/10111)",
    greetingPolice: "10111, police. What is your emergency?",
    greetingFire: "Emergency services. What is the location?",
    units: {
      police: [
        { id: "za_patrol", name: "SAPS Patrol", role: "patrol" },
        { id: "za_tactical", name: "Tactical Response", role: "tactical" }
      ],
      fire: [
        { id: "za_engine", name: "Fire Engine", role: "fire" },
        { id: "za_ems", name: "Ambulance", role: "ems" },
        { id: "za_rescue", name: "Rescue", role: "rescue" }
      ]
    }
  }
];