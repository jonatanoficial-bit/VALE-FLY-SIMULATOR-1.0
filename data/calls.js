/* Auto-gerado: Calls Pack (base + world) */
window.CALLS = [
  {
    "id": "pol_som_alto_01",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Perturbação do sossego (som alto)",
    "baseSeverity": "leve",
    "timers": {
      "worsen": 55,
      "fail": 120
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "what"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço completo e referência?",
          "answer": "Rua ... número ... (voz irritada)",
          "effect": {
            "severity": "leve"
          }
        },
        {
          "id": "what",
          "label": "O que acontece",
          "prompt": "O que está acontecendo exatamente?",
          "answer": "Som altíssimo há horas.",
          "effect": {
            "severity": "leve"
          }
        },
        {
          "id": "weapons",
          "label": "Há armas?",
          "prompt": "Você viu arma ou ameaça?",
          "answer": "Não, só barulho.",
          "effect": {
            "severity": "leve"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol"
      ]
    },
    "hint": "Coleta endereço e confirma ausência de risco. Despache patrulha de área.",
    "opening": [
      "Boa noite... meu vizinho está com o som altíssimo há horas e ninguém consegue dormir.",
      "Tem uma festa com música muito alta aqui no prédio, já passou do limite.",
      "Estou ligando porque o som está ensurdecedor e tem briga começando."
    ]
  },
  {
    "id": "pol_domestic_02",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Violência doméstica (possível agressão)",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 40,
      "fail": 90
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "injuries"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Endereço e referência?",
          "answer": "Apartamento ... (sussurrando)",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "injuries",
          "label": "Feridos?",
          "prompt": "Tem alguém ferido agora?",
          "answer": "Ele me empurrou... tô com dor.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "children",
          "label": "Crianças no local",
          "prompt": "Há crianças no imóvel?",
          "answer": "Sim, duas.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "weapons",
          "label": "Armas no local",
          "prompt": "Ele tem arma/faca?",
          "answer": "Acho que tem uma faca.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol"
      ]
    },
    "hint": "Priorize proteção. Pergunte feridos e presença de armas. Despache patrulha imediatamente.",
    "opening": [
      "Eu preciso de ajuda... tem uma discussão e ele está me ameaçando.",
      "Meu companheiro está agressivo, tenho medo de apanhar.",
      "Ouço gritos e pancadas no apartamento ao lado, acho que alguém está sendo agredido."
    ]
  },
  {
    "id": "pol_armed_robbery_03",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Roubo armado em andamento",
    "baseSeverity": "critico",
    "timers": {
      "worsen": 30,
      "fail": 70
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "weapon"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Onde está acontecendo?",
          "answer": "Na porta do mercado...",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "weapon",
          "label": "Tipo de arma",
          "prompt": "Ele está com arma de fogo?",
          "answer": "Sim, revólver!",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "hostages",
          "label": "Reféns",
          "prompt": "Tem reféns?",
          "answer": "Tem gente no caixa...",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "suspects",
          "label": "Quantos suspeitos",
          "prompt": "Quantos são?",
          "answer": "Acho que dois.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol",
        "tactical"
      ]
    },
    "hint": "Tempo é vida. Colete endereço + arma e despache patrulha; se houver reféns, tático.",
    "opening": [
      "Estão assaltando o mercado agora! Tem homem armado aqui.",
      "Roubo em andamento... o cara está com arma apontada pro caixa!",
      "Acabaram de anunciar um assalto, tem gente rendida."
    ]
  },
  {
    "id": "pol_pursuit_04",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Perseguição / veículo suspeito",
    "baseSeverity": "medio",
    "timers": {
      "worsen": 50,
      "fail": 110
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "plate"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Via / direção",
          "prompt": "Em que via e sentido?",
          "answer": "Avenida ... sentido centro.",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "plate",
          "label": "Placa",
          "prompt": "Consegue informar a placa?",
          "answer": "ABC-1D23",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "danger",
          "label": "Colisão/risco",
          "prompt": "Ele está colocando alguém em risco?",
          "answer": "Quase bateu em 2 carros!",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "traffic",
        "patrol"
      ]
    },
    "hint": "Trânsito/rodoviária é mais eficiente, mas patrulha também serve.",
    "opening": [
      "Tem um carro em alta velocidade fugindo, quase bateu em vários veículos.",
      "Um veículo suspeito está fazendo zigue-zague e furando farol, parece fuga.",
      "Tem uma perseguição aqui, o carro tá desgovernado e perigoso."
    ]
  },
  {
    "id": "pol_missing_child_05",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Criança desaparecida (última vez vista agora)",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 60,
      "fail": 140
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "desc"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde você está agora?",
          "answer": "Parque ...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "desc",
          "label": "Descrição",
          "prompt": "Idade/roupa/características?",
          "answer": "7 anos, camiseta azul...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "time",
          "label": "Há quanto tempo",
          "prompt": "Há quanto tempo sumiu?",
          "answer": "5 minutos!",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "investigation",
        "patrol"
      ]
    },
    "hint": "Tempo crítico. Coleta descrição e local e aciona patrulha + investigação.",
    "opening": [
      "Minha criança sumiu agora, eu perdi ela de vista faz poucos minutos!",
      "Meu filho se perdeu... eu estou no desespero, não encontro ele.",
      "Uma menina está desaparecida aqui na praça, ninguém sabe pra onde foi."
    ]
  },
  {
    "id": "pol_trote_06",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Trote / chamada indevida",
    "baseSeverity": "trote",
    "timers": {
      "worsen": 80,
      "fail": 160
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "confirm"
      ],
      "questions": [
        {
          "id": "confirm",
          "label": "Confirmar ocorrência",
          "prompt": "Confirme a ocorrência real, por favor.",
          "answer": "(risadas) É brincadeira…",
          "effect": {
            "confidenceTrote": 4
          }
        },
        {
          "id": "callback",
          "label": "Número para retorno",
          "prompt": "Qual seu número para retorno?",
          "answer": "...",
          "effect": {
            "confidenceTrote": 2,
            "timePenaltySec": 6
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "dismiss_only"
      ]
    },
    "hint": "Trote: o correto é encerrar. Despachar aqui é desperdício.",
    "opening": [
      "(silêncio) ... alô?",
      "Quero pedir uma pizza... (risos)",
      "Não sei... tô só testando."
    ]
  },
  {
    "id": "pol_burglary_01",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Invasão / arrombamento suspeito",
    "baseSeverity": "medio",
    "timers": {
      "worsen": 55,
      "fail": 120
    },
    "outcomes": {
      "success": "Ocorrência atendida com sucesso.",
      "worsen": "Risco aumentou.",
      "fail": "Falha operacional com consequências."
    },
    "protocol": {
      "required": [
        "location",
        "entry"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço?",
          "answer": "Casa ...",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "entry",
          "label": "Sinais de entrada",
          "prompt": "Viu porta/janela arrombada?",
          "answer": "Sim, porta forçada.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "suspect",
          "label": "Suspeito no local",
          "prompt": "Você vê alguém?",
          "answer": "Não vejo, mas ouvi barulho.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol"
      ]
    },
    "hint": "Colete endereço e sinais de invasão. Despache patrulha.",
    "opening": [
      "Acho que tem alguém tentando entrar na minha casa... ouvi barulho na janela.",
      "Meu estabelecimento pode ter sido arrombado, o alarme disparou agora.",
      "Tem uma pessoa suspeita forçando a porta aqui."
    ]
  },
  {
    "id": "pol_traffic_accident_02",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Acidente de trânsito com vítimas",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 40,
      "fail": 95
    },
    "outcomes": {
      "success": "Ocorrência atendida com sucesso.",
      "worsen": "Risco aumentou.",
      "fail": "Falha operacional com consequências."
    },
    "protocol": {
      "required": [
        "location",
        "victims"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde ocorreu?",
          "answer": "Rodovia ... km ...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "victims",
          "label": "Número de vítimas",
          "prompt": "Quantos feridos?",
          "answer": "Dois no chão.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "hazard",
          "label": "Risco de incêndio",
          "prompt": "Há vazamento/fumaça?",
          "answer": "Sim, vazando combustível!",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "traffic",
        "patrol"
      ]
    },
    "hint": "Se houver vazamento, trate como crítico e acione suporte adequado (na Etapa 3 entra EMS/Fire).",
    "opening": [
      "Teve uma batida forte, tem gente ferida e um carro destruído.",
      "Acidente grave agora, parece que tem vítima presa.",
      "Colisão na avenida, muita gente caída no chão."
    ]
  },
  {
    "id": "fire_apartment_fire_01",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Incêndio em apartamento",
    "baseSeverity": "critico",
    "timers": {
      "worsen": 35,
      "fail": 80
    },
    "outcomes": {
      "success": "Situação controlada.",
      "worsen": "A condição se agravou.",
      "fail": "Falha crítica com vítimas/risco elevado."
    },
    "protocol": {
      "required": [
        "location",
        "victims"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço?",
          "answer": "Prédio ... apto ...",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "victims",
          "label": "Vítimas presas",
          "prompt": "Tem alguém preso?",
          "answer": "Meu filho tá no quarto!",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "smoke",
          "label": "Fumaça densa",
          "prompt": "Tem muita fumaça?",
          "answer": "Sim, não dá pra respirar.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "fire_engine",
        "rescue"
      ]
    },
    "hint": "Incêndio com risco de vidas. Despache viatura de combate + resgate.",
    "opening": [
      "Tem muita fumaça saindo de um apartamento, acho que tem gente lá dentro!",
      "Incêndio no prédio! Está subindo fumaça pelo corredor.",
      "O apartamento pegou fogo e os vizinhos estão desesperados."
    ]
  },
  {
    "id": "fire_gas_leak_02",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Vazamento de gás (odor forte)",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 45,
      "fail": 105
    },
    "outcomes": {
      "success": "Situação controlada.",
      "worsen": "A condição se agravou.",
      "fail": "Falha crítica com vítimas/risco elevado."
    },
    "protocol": {
      "required": [
        "location",
        "source"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Endereço?",
          "answer": "Cozinha da casa ...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "source",
          "label": "Fonte",
          "prompt": "É botijão/encanamento?",
          "answer": "Botijão.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "ignition",
          "label": "Chamas/centelha",
          "prompt": "Tem fogo ou faísca?",
          "answer": "Não, mas tem gente ligando luz.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "hazmat",
        "fire_engine"
      ]
    },
    "hint": "Oriente evacuação e não acender luz. Despache unidade adequada.",
    "opening": [
      "Estou sentindo um cheiro muito forte de gás, estou com medo de explodir.",
      "Vazamento de gás aqui, tá dando tontura e o cheiro é insuportável.",
      "Cheiro de gás no prédio inteiro, pode ser vazamento grande."
    ]
  },
  {
    "id": "fire_elevator_03",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Pessoa presa em elevador",
    "baseSeverity": "medio",
    "timers": {
      "worsen": 70,
      "fail": 160
    },
    "outcomes": {
      "success": "Situação controlada.",
      "worsen": "A condição se agravou.",
      "fail": "Falha crítica com vítimas/risco elevado."
    },
    "protocol": {
      "required": [
        "location",
        "count"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Prédio",
          "prompt": "Qual o prédio/endereço?",
          "answer": "Centro ...",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "count",
          "label": "Quantas pessoas",
          "prompt": "Quantas presas?",
          "answer": "Duas.",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "medical",
          "label": "Mal-estar",
          "prompt": "Alguém passando mal?",
          "answer": "Uma tá com falta de ar.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "rescue"
      ]
    },
    "hint": "Resgate técnico. Se houver mal-estar, trate como mais grave.",
    "opening": [
      "Estou preso no elevador, ele parou entre andares e a luz piscou.",
      "Uma pessoa ficou trancada no elevador, tá sem ventilação direito.",
      "O elevador travou e tem gente dentro pedindo ajuda."
    ]
  },
  {
    "id": "fire_trote_04",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Trote (falso incêndio)",
    "baseSeverity": "trote",
    "timers": {
      "worsen": 80,
      "fail": 180
    },
    "outcomes": {
      "success": "Situação controlada.",
      "worsen": "A condição se agravou.",
      "fail": "Falha crítica com vítimas/risco elevado."
    },
    "protocol": {
      "required": [
        "confirm"
      ],
      "questions": [
        {
          "id": "confirm",
          "label": "Confirmar",
          "prompt": "Você vê fogo/fumaça agora?",
          "answer": "Não… é brincadeira…",
          "effect": {
            "confidenceTrote": 4
          }
        },
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço?",
          "answer": "...",
          "effect": {
            "confidenceTrote": 1,
            "timePenaltySec": 8
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "dismiss_only"
      ]
    },
    "hint": "Trote: encerre. Não desperdice recursos.",
    "opening": [
      "(risos) é brincadeira...",
      "Falso alarme...",
      "Nada não, foi engano."
    ]
  },
  {
    "id": "fire_vehicle_fire_01",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Incêndio em veículo",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 45,
      "fail": 100
    },
    "outcomes": {
      "success": "Resgate concluído.",
      "worsen": "Risco aumentou.",
      "fail": "Perda de controle / vítimas."
    },
    "protocol": {
      "required": [
        "location",
        "people"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde está o veículo?",
          "answer": "Posto de gasolina!",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "people",
          "label": "Pessoas próximas",
          "prompt": "Tem gente perto?",
          "answer": "Sim, muita.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "fuel",
          "label": "Combustível vazando",
          "prompt": "Há vazamento?",
          "answer": "Sim.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "fire_engine"
      ]
    },
    "hint": "Risco de explosão. Priorize rápido.",
    "opening": [
      "Um carro acabou de pegar fogo! Tá subindo muita fumaça...",
      "Tem um veículo em chamas na via, o fogo está aumentando!",
      "Um carro pegou fogo e parece ter vazamento de combustível."
    ]
  },
  {
    "id": "fire_flood_02",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Alagamento / resgate em enchente",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 60,
      "fail": 130
    },
    "outcomes": {
      "success": "Resgate concluído.",
      "worsen": "Risco aumentou.",
      "fail": "Perda de controle / vítimas."
    },
    "protocol": {
      "required": [
        "location",
        "trapped"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Onde?",
          "answer": "Rua ...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "trapped",
          "label": "Pessoas ilhadas",
          "prompt": "Quantas?",
          "answer": "Três no telhado.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "water",
          "label": "Nível da água",
          "prompt": "Até onde subiu?",
          "answer": "Acima do joelho.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "rescue"
      ]
    },
    "hint": "Resgate técnico. Tempo e água subindo.",
    "opening": [
      "A água subiu muito e tem gente ilhada, não consegue sair!",
      "Enchente aqui, precisamos de resgate urgente.",
      "A rua virou um rio e um carro ficou preso com pessoas dentro."
    ]
  },
  {
    "id": "pol_som_alto_01_v14",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Perturbação do sossego (som alto) (variação)",
    "baseSeverity": "leve",
    "timers": {
      "worsen": 55,
      "fail": 120
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "what"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço completo e referência?",
          "answer": "Rua ... número ... (voz irritada)",
          "effect": {
            "severity": "leve"
          }
        },
        {
          "id": "what",
          "label": "O que acontece",
          "prompt": "O que está acontecendo exatamente?",
          "answer": "Som altíssimo há horas.",
          "effect": {
            "severity": "leve"
          }
        },
        {
          "id": "weapons",
          "label": "Há armas?",
          "prompt": "Você viu arma ou ameaça?",
          "answer": "Não, só barulho.",
          "effect": {
            "severity": "leve"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol"
      ]
    },
    "hint": "Coleta endereço e confirma ausência de risco. Despache patrulha de área.",
    "opening": [
      "Boa noite... meu vizinho está com o som altíssimo há horas e ninguém consegue dormir.",
      "Tem uma festa com música muito alta aqui no prédio, já passou do limite.",
      "Estou ligando porque o som está ensurdecedor e tem briga começando."
    ]
  },
  {
    "id": "pol_domestic_02_v15",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Violência doméstica (possível agressão) (variação)",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 40,
      "fail": 90
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "injuries"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Endereço e referência?",
          "answer": "Apartamento ... (sussurrando)",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "injuries",
          "label": "Feridos?",
          "prompt": "Tem alguém ferido agora?",
          "answer": "Ele me empurrou... tô com dor.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "children",
          "label": "Crianças no local",
          "prompt": "Há crianças no imóvel?",
          "answer": "Sim, duas.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "weapons",
          "label": "Armas no local",
          "prompt": "Ele tem arma/faca?",
          "answer": "Acho que tem uma faca.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol"
      ]
    },
    "hint": "Priorize proteção. Pergunte feridos e presença de armas. Despache patrulha imediatamente.",
    "opening": [
      "Eu preciso de ajuda... tem uma discussão e ele está me ameaçando.",
      "Meu companheiro está agressivo, tenho medo de apanhar.",
      "Ouço gritos e pancadas no apartamento ao lado, acho que alguém está sendo agredido."
    ]
  },
  {
    "id": "pol_armed_robbery_03_v16",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Roubo armado em andamento (variação)",
    "baseSeverity": "critico",
    "timers": {
      "worsen": 30,
      "fail": 70
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "weapon"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Onde está acontecendo?",
          "answer": "Na porta do mercado...",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "weapon",
          "label": "Tipo de arma",
          "prompt": "Ele está com arma de fogo?",
          "answer": "Sim, revólver!",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "hostages",
          "label": "Reféns",
          "prompt": "Tem reféns?",
          "answer": "Tem gente no caixa...",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "suspects",
          "label": "Quantos suspeitos",
          "prompt": "Quantos são?",
          "answer": "Acho que dois.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol",
        "tactical"
      ]
    },
    "hint": "Tempo é vida. Colete endereço + arma e despache patrulha; se houver reféns, tático.",
    "opening": [
      "Estão assaltando o mercado agora! Tem homem armado aqui.",
      "Roubo em andamento... o cara está com arma apontada pro caixa!",
      "Acabaram de anunciar um assalto, tem gente rendida."
    ]
  },
  {
    "id": "pol_pursuit_04_v17",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Perseguição / veículo suspeito (variação)",
    "baseSeverity": "medio",
    "timers": {
      "worsen": 50,
      "fail": 110
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "plate"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Via / direção",
          "prompt": "Em que via e sentido?",
          "answer": "Avenida ... sentido centro.",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "plate",
          "label": "Placa",
          "prompt": "Consegue informar a placa?",
          "answer": "ABC-1D23",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "danger",
          "label": "Colisão/risco",
          "prompt": "Ele está colocando alguém em risco?",
          "answer": "Quase bateu em 2 carros!",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "traffic",
        "patrol"
      ]
    },
    "hint": "Trânsito/rodoviária é mais eficiente, mas patrulha também serve.",
    "opening": [
      "Tem um carro em alta velocidade fugindo, quase bateu em vários veículos.",
      "Um veículo suspeito está fazendo zigue-zague e furando farol, parece fuga.",
      "Tem uma perseguição aqui, o carro tá desgovernado e perigoso."
    ]
  },
  {
    "id": "pol_missing_child_05_v18",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Criança desaparecida (última vez vista agora) (variação)",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 60,
      "fail": 140
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "desc"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde você está agora?",
          "answer": "Parque ...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "desc",
          "label": "Descrição",
          "prompt": "Idade/roupa/características?",
          "answer": "7 anos, camiseta azul...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "time",
          "label": "Há quanto tempo",
          "prompt": "Há quanto tempo sumiu?",
          "answer": "5 minutos!",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "investigation",
        "patrol"
      ]
    },
    "hint": "Tempo crítico. Coleta descrição e local e aciona patrulha + investigação.",
    "opening": [
      "Minha criança sumiu agora, eu perdi ela de vista faz poucos minutos!",
      "Meu filho se perdeu... eu estou no desespero, não encontro ele.",
      "Uma menina está desaparecida aqui na praça, ninguém sabe pra onde foi."
    ]
  },
  {
    "id": "pol_trote_06_v19",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Trote / chamada indevida (variação)",
    "baseSeverity": "trote",
    "timers": {
      "worsen": 80,
      "fail": 160
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "confirm"
      ],
      "questions": [
        {
          "id": "confirm",
          "label": "Confirmar ocorrência",
          "prompt": "Confirme a ocorrência real, por favor.",
          "answer": "(risadas) É brincadeira…",
          "effect": {
            "confidenceTrote": 4
          }
        },
        {
          "id": "callback",
          "label": "Número para retorno",
          "prompt": "Qual seu número para retorno?",
          "answer": "...",
          "effect": {
            "confidenceTrote": 2,
            "timePenaltySec": 6
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "dismiss_only"
      ]
    },
    "hint": "Trote: o correto é encerrar. Despachar aqui é desperdício.",
    "opening": [
      "(silêncio) ... alô?",
      "Quero pedir uma pizza... (risos)",
      "Não sei... tô só testando."
    ]
  },
  {
    "id": "pol_burglary_01_v20",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Invasão / arrombamento suspeito (variação)",
    "baseSeverity": "medio",
    "timers": {
      "worsen": 55,
      "fail": 120
    },
    "outcomes": {
      "success": "Ocorrência atendida com sucesso.",
      "worsen": "Risco aumentou.",
      "fail": "Falha operacional com consequências."
    },
    "protocol": {
      "required": [
        "location",
        "entry"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço?",
          "answer": "Casa ...",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "entry",
          "label": "Sinais de entrada",
          "prompt": "Viu porta/janela arrombada?",
          "answer": "Sim, porta forçada.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "suspect",
          "label": "Suspeito no local",
          "prompt": "Você vê alguém?",
          "answer": "Não vejo, mas ouvi barulho.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol"
      ]
    },
    "hint": "Colete endereço e sinais de invasão. Despache patrulha.",
    "opening": [
      "Acho que tem alguém tentando entrar na minha casa... ouvi barulho na janela.",
      "Meu estabelecimento pode ter sido arrombado, o alarme disparou agora.",
      "Tem uma pessoa suspeita forçando a porta aqui."
    ]
  },
  {
    "id": "pol_traffic_accident_02_v21",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Acidente de trânsito com vítimas (variação)",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 40,
      "fail": 95
    },
    "outcomes": {
      "success": "Ocorrência atendida com sucesso.",
      "worsen": "Risco aumentou.",
      "fail": "Falha operacional com consequências."
    },
    "protocol": {
      "required": [
        "location",
        "victims"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde ocorreu?",
          "answer": "Rodovia ... km ...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "victims",
          "label": "Número de vítimas",
          "prompt": "Quantos feridos?",
          "answer": "Dois no chão.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "hazard",
          "label": "Risco de incêndio",
          "prompt": "Há vazamento/fumaça?",
          "answer": "Sim, vazando combustível!",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "traffic",
        "patrol"
      ]
    },
    "hint": "Se houver vazamento, trate como crítico e acione suporte adequado (na Etapa 3 entra EMS/Fire).",
    "opening": [
      "Teve uma batida forte, tem gente ferida e um carro destruído.",
      "Acidente grave agora, parece que tem vítima presa.",
      "Colisão na avenida, muita gente caída no chão."
    ]
  },
  {
    "id": "fire_apartment_fire_01_v22",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Incêndio em apartamento (variação)",
    "baseSeverity": "critico",
    "timers": {
      "worsen": 35,
      "fail": 80
    },
    "outcomes": {
      "success": "Situação controlada.",
      "worsen": "A condição se agravou.",
      "fail": "Falha crítica com vítimas/risco elevado."
    },
    "protocol": {
      "required": [
        "location",
        "victims"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço?",
          "answer": "Prédio ... apto ...",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "victims",
          "label": "Vítimas presas",
          "prompt": "Tem alguém preso?",
          "answer": "Meu filho tá no quarto!",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "smoke",
          "label": "Fumaça densa",
          "prompt": "Tem muita fumaça?",
          "answer": "Sim, não dá pra respirar.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "fire_engine",
        "rescue"
      ]
    },
    "hint": "Incêndio com risco de vidas. Despache viatura de combate + resgate.",
    "opening": [
      "Tem muita fumaça saindo de um apartamento, acho que tem gente lá dentro!",
      "Incêndio no prédio! Está subindo fumaça pelo corredor.",
      "O apartamento pegou fogo e os vizinhos estão desesperados."
    ]
  },
  {
    "id": "fire_gas_leak_02_v23",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Vazamento de gás (odor forte) (variação)",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 45,
      "fail": 105
    },
    "outcomes": {
      "success": "Situação controlada.",
      "worsen": "A condição se agravou.",
      "fail": "Falha crítica com vítimas/risco elevado."
    },
    "protocol": {
      "required": [
        "location",
        "source"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Endereço?",
          "answer": "Cozinha da casa ...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "source",
          "label": "Fonte",
          "prompt": "É botijão/encanamento?",
          "answer": "Botijão.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "ignition",
          "label": "Chamas/centelha",
          "prompt": "Tem fogo ou faísca?",
          "answer": "Não, mas tem gente ligando luz.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "hazmat",
        "fire_engine"
      ]
    },
    "hint": "Oriente evacuação e não acender luz. Despache unidade adequada.",
    "opening": [
      "Estou sentindo um cheiro muito forte de gás, estou com medo de explodir.",
      "Vazamento de gás aqui, tá dando tontura e o cheiro é insuportável.",
      "Cheiro de gás no prédio inteiro, pode ser vazamento grande."
    ]
  },
  {
    "id": "fire_elevator_03_v24",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Pessoa presa em elevador (variação)",
    "baseSeverity": "medio",
    "timers": {
      "worsen": 70,
      "fail": 160
    },
    "outcomes": {
      "success": "Situação controlada.",
      "worsen": "A condição se agravou.",
      "fail": "Falha crítica com vítimas/risco elevado."
    },
    "protocol": {
      "required": [
        "location",
        "count"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Prédio",
          "prompt": "Qual o prédio/endereço?",
          "answer": "Centro ...",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "count",
          "label": "Quantas pessoas",
          "prompt": "Quantas presas?",
          "answer": "Duas.",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "medical",
          "label": "Mal-estar",
          "prompt": "Alguém passando mal?",
          "answer": "Uma tá com falta de ar.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "rescue"
      ]
    },
    "hint": "Resgate técnico. Se houver mal-estar, trate como mais grave.",
    "opening": [
      "Estou preso no elevador, ele parou entre andares e a luz piscou.",
      "Uma pessoa ficou trancada no elevador, tá sem ventilação direito.",
      "O elevador travou e tem gente dentro pedindo ajuda."
    ]
  },
  {
    "id": "fire_trote_04_v25",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Trote (falso incêndio) (variação)",
    "baseSeverity": "trote",
    "timers": {
      "worsen": 80,
      "fail": 180
    },
    "outcomes": {
      "success": "Situação controlada.",
      "worsen": "A condição se agravou.",
      "fail": "Falha crítica com vítimas/risco elevado."
    },
    "protocol": {
      "required": [
        "confirm"
      ],
      "questions": [
        {
          "id": "confirm",
          "label": "Confirmar",
          "prompt": "Você vê fogo/fumaça agora?",
          "answer": "Não… é brincadeira…",
          "effect": {
            "confidenceTrote": 4
          }
        },
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço?",
          "answer": "...",
          "effect": {
            "confidenceTrote": 1,
            "timePenaltySec": 8
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "dismiss_only"
      ]
    },
    "hint": "Trote: encerre. Não desperdice recursos.",
    "opening": [
      "(risos) é brincadeira...",
      "Falso alarme...",
      "Nada não, foi engano."
    ]
  },
  {
    "id": "fire_vehicle_fire_01_v26",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Incêndio em veículo (variação)",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 45,
      "fail": 100
    },
    "outcomes": {
      "success": "Resgate concluído.",
      "worsen": "Risco aumentou.",
      "fail": "Perda de controle / vítimas."
    },
    "protocol": {
      "required": [
        "location",
        "people"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde está o veículo?",
          "answer": "Posto de gasolina!",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "people",
          "label": "Pessoas próximas",
          "prompt": "Tem gente perto?",
          "answer": "Sim, muita.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "fuel",
          "label": "Combustível vazando",
          "prompt": "Há vazamento?",
          "answer": "Sim.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "fire_engine"
      ]
    },
    "hint": "Risco de explosão. Priorize rápido.",
    "opening": [
      "Um carro acabou de pegar fogo! Tá subindo muita fumaça...",
      "Tem um veículo em chamas na via, o fogo está aumentando!",
      "Um carro pegou fogo e parece ter vazamento de combustível!"
    ]
  },
  {
    "id": "fire_flood_02_v27",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Alagamento / resgate em enchente (variação)",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 60,
      "fail": 130
    },
    "outcomes": {
      "success": "Resgate concluído.",
      "worsen": "Risco aumentou.",
      "fail": "Perda de controle / vítimas."
    },
    "protocol": {
      "required": [
        "location",
        "trapped"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Onde?",
          "answer": "Rua ...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "trapped",
          "label": "Pessoas ilhadas",
          "prompt": "Quantas?",
          "answer": "Três no telhado.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "water",
          "label": "Nível da água",
          "prompt": "Até onde subiu?",
          "answer": "Acima do joelho.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "rescue"
      ]
    },
    "hint": "Resgate técnico. Tempo e água subindo.",
    "opening": [
      "A água subiu muito e tem gente ilhada, não consegue sair!",
      "Enchente aqui, precisamos de resgate urgente.",
      "A rua virou um rio e um carro ficou preso com pessoas dentro."
    ]
  },
  {
    "id": "pol_som_alto_01_v28",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Perturbação do sossego (som alto) (variação)",
    "baseSeverity": "leve",
    "timers": {
      "worsen": 55,
      "fail": 120
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "what"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço completo e referência?",
          "answer": "Rua ... número ... (voz irritada)",
          "effect": {
            "severity": "leve"
          }
        },
        {
          "id": "what",
          "label": "O que acontece",
          "prompt": "O que está acontecendo exatamente?",
          "answer": "Som altíssimo há horas.",
          "effect": {
            "severity": "leve"
          }
        },
        {
          "id": "weapons",
          "label": "Há armas?",
          "prompt": "Você viu arma ou ameaça?",
          "answer": "Não, só barulho.",
          "effect": {
            "severity": "leve"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol"
      ]
    },
    "hint": "Coleta endereço e confirma ausência de risco. Despache patrulha de área.",
    "opening": [
      "Boa noite... meu vizinho está com o som altíssimo há horas e ninguém consegue dormir.",
      "Tem uma festa com música muito alta aqui no prédio, já passou do limite.",
      "Estou ligando porque o som está ensurdecedor e tem briga começando."
    ]
  },
  {
    "id": "pol_domestic_02_v29",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Violência doméstica (possível agressão) (variação)",
    "baseSeverity": "grave",
    "timers": {
      "worsen": 40,
      "fail": 90
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "injuries"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Endereço e referência?",
          "answer": "Apartamento ... (sussurrando)",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "injuries",
          "label": "Feridos?",
          "prompt": "Tem alguém ferido agora?",
          "answer": "Ele me empurrou... tô com dor.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "children",
          "label": "Crianças no local",
          "prompt": "Há crianças no imóvel?",
          "answer": "Sim, duas.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "weapons",
          "label": "Armas no local",
          "prompt": "Ele tem arma/faca?",
          "answer": "Acho que tem uma faca.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "caller_name",
          "label": "Nome do solicitante",
          "prompt": "Qual seu nome completo?",
          "answer": "Agora não dá pra falar! Pelo amor de Deus...",
          "effect": {
            "timePenaltySec": 12,
            "forceWorsen": true
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol"
      ]
    },
    "hint": "Priorize proteção. Pergunte feridos e presença de armas. Despache patrulha imediatamente.",
    "opening": [
      "Eu preciso de ajuda... tem uma discussão e ele está me ameaçando.",
      "Meu companheiro está agressivo, tenho medo de apanhar.",
      "Ouço gritos e pancadas no apartamento ao lado, acho que alguém está sendo agredido."
    ]
  },
  {
    "id": "pol_bank_hostage_01",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Assalto a banco com reféns",
    "opening": [
      "Estão assaltando o banco agora! Tem gente rendida lá dentro!",
      "Assalto no banco com reféns... ouvi disparo e gritos!"
    ],
    "baseSeverity": "critico",
    "callerState": "panic",
    "timers": {
      "worsen": 25,
      "fail": 70
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "hostages"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço exato do banco e ponto de referência?",
          "answer": "Centro... esquina da avenida principal.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "hostages",
          "label": "Reféns",
          "prompt": "Há reféns? Quantas pessoas aproximadamente?",
          "answer": "Muita gente no saguão... parece mais de dez.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "weapons",
          "label": "Armas",
          "prompt": "Você viu arma de fogo ou algo suspeito (mochila/objeto)?",
          "answer": "Sim, arma na mão...",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "suspects",
          "label": "Suspeitos",
          "prompt": "Quantos suspeitos e como eles estão vestidos?",
          "answer": "Dois, com capuz escuro.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "injuries",
          "label": "Feridos",
          "prompt": "Há feridos visíveis?",
          "answer": "Não sei... mas tem gente chorando.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "caller_safe",
          "label": "Você está seguro?",
          "prompt": "Você está em local seguro para falar?",
          "answer": "Sim, estou escondido.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "tactical"
      ]
    },
    "hint": "Priorize segurança. Coleta endereço/reféns e acione unidade tática."
  },
  {
    "id": "pol_active_shooter_01",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Tiroteio / atirador ativo",
    "opening": [
      "Tem tiros aqui! Uma pessoa está atirando e todo mundo correndo!",
      "Ouvi vários disparos, acho que é um atirador dentro do prédio!"
    ],
    "baseSeverity": "critico",
    "callerState": "panic",
    "timers": {
      "worsen": 20,
      "fail": 60
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "weapon"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Qual o endereço exato e o tipo de local (escola, shopping, rua)?",
          "answer": "É no centro comercial... na entrada principal.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "weapon",
          "label": "Arma",
          "prompt": "Você viu arma de fogo? Consegue descrever?",
          "answer": "Sim, parece uma pistola.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "suspects",
          "label": "Qtd. suspeitos",
          "prompt": "É uma pessoa só ou mais?",
          "answer": "Acho que é um só.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "injuries",
          "label": "Feridos",
          "prompt": "Há feridos? Quantos aproximadamente?",
          "answer": "Tem pessoas caídas...",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "direction",
          "label": "Direção",
          "prompt": "Para onde ele foi/está indo agora?",
          "answer": "Subiu a escada rolante.",
          "effect": {}
        },
        {
          "id": "caller_safe",
          "label": "Segurança",
          "prompt": "Você está em local seguro? Consegue se proteger?",
          "answer": "Estou atrás de uma coluna.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "tactical"
      ]
    },
    "hint": "Caso crítico: local, arma e direção. Acione unidade tática imediatamente."
  },
  {
    "id": "pol_suspicious_package_01",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Objeto suspeito / possível bomba",
    "opening": [
      "Tem uma mochila abandonada num lugar movimentado e ninguém assume.",
      "Encontraram um pacote estranho com fios aparentes."
    ],
    "baseSeverity": "grave",
    "callerState": "tense",
    "timers": {
      "worsen": 45,
      "fail": 110
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "package"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço exato e onde está o objeto?",
          "answer": "Na entrada do metrô, perto das catracas.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "package",
          "label": "Descrição",
          "prompt": "Descreva o objeto (tamanho, cor, se tem fios/cheiro/som).",
          "answer": "É uma mochila preta, parece pesada.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "touched",
          "label": "Alguém mexeu?",
          "prompt": "Alguém tocou ou moveu o objeto?",
          "answer": "Ninguém mexeu, só isolaram.",
          "effect": {}
        },
        {
          "id": "people",
          "label": "Pessoas próximas",
          "prompt": "Tem muita gente próxima? Dá para manter distância?",
          "answer": "Sim, está cheio...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "threat",
          "label": "Ameaça",
          "prompt": "Houve ameaça/mensagem sobre isso?",
          "answer": "Não, só apareceu aqui.",
          "effect": {}
        },
        {
          "id": "caller_name",
          "label": "Seu nome",
          "prompt": "Qual seu nome para registro?",
          "answer": "Depois eu passo...",
          "effect": {
            "timePenaltySec": 8
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "bomb"
      ]
    },
    "hint": "Não trate como rotina. Coleta localização/descrição e acione antibomba."
  },
  {
    "id": "pol_bomb_threat_01",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Ameaça de bomba (telefone/mensagem)",
    "opening": [
      "Recebemos uma ligação dizendo que tem uma bomba no prédio.",
      "Chegou uma mensagem ameaçando explosão num evento."
    ],
    "baseSeverity": "grave",
    "callerState": "tense",
    "timers": {
      "worsen": 40,
      "fail": 100
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "details"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Qual o endereço exato e que tipo de local é (empresa, escola, evento)?",
          "answer": "É um prédio comercial no centro.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "details",
          "label": "Detalhes",
          "prompt": "O que foi dito na ameaça? Houve prazo/local específico?",
          "answer": "Disseram que vai explodir hoje à noite.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "who",
          "label": "Origem",
          "prompt": "Número/origem da mensagem? Alguém reconheceu a voz?",
          "answer": "Número desconhecido.",
          "effect": {}
        },
        {
          "id": "evac",
          "label": "Evacuação",
          "prompt": "O local está sendo evacuado com calma?",
          "answer": "Estão tentando tirar as pessoas.",
          "effect": {}
        },
        {
          "id": "suspicious",
          "label": "Objeto suspeito",
          "prompt": "Há algum objeto suspeito identificado?",
          "answer": "Ainda não.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "bomb"
      ]
    },
    "hint": "Coleta detalhes da ameaça e acione equipe antibomba."
  },
  {
    "id": "pol_riot_01",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Distúrbio / tumulto violento",
    "opening": [
      "Tem uma confusão grande aqui, pessoas quebrando coisas e brigando.",
      "A multidão está ficando violenta, estão arremessando objetos."
    ],
    "baseSeverity": "grave",
    "callerState": "agitated",
    "timers": {
      "worsen": 35,
      "fail": 90
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "crowd"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde está acontecendo exatamente?",
          "answer": "Na praça central, perto do palco.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "crowd",
          "label": "Tamanho",
          "prompt": "Quantas pessoas aproximadamente?",
          "answer": "Muitas... dezenas.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "weapons",
          "label": "Armas",
          "prompt": "Você vê armas (pau, pedra, faca)?",
          "answer": "Pedras e garrafas.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "injuries",
          "label": "Feridos",
          "prompt": "Há feridos no local?",
          "answer": "Sim, uma pessoa caída.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "property",
          "label": "Danos",
          "prompt": "Estão danificando patrimônio/lojas?",
          "answer": "Sim, vitrines quebradas.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "riot"
      ]
    },
    "hint": "Aja rápido e com segurança. Coleta local/tamanho e acione unidade de choque."
  },
  {
    "id": "pol_car_theft_01",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Furto/roubo de veículo em andamento",
    "opening": [
      "Estão tentando levar um carro agora, forçando a porta!",
      "Tem um homem tentando ligar meu carro na rua!"
    ],
    "baseSeverity": "medio",
    "callerState": "tense",
    "timers": {
      "worsen": 55,
      "fail": 130
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "vehicle"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Qual o endereço e sentido da via?",
          "answer": "Rua principal, perto do semáforo.",
          "effect": {
            "severity": "medio"
          }
        },
        {
          "id": "vehicle",
          "label": "Veículo",
          "prompt": "Qual veículo (cor, modelo) e placa se possível?",
          "answer": "Prata, sedã... não vi placa.",
          "effect": {}
        },
        {
          "id": "suspects",
          "label": "Suspeito",
          "prompt": "Descreva o suspeito (roupas, direção de fuga).",
          "answer": "Boné, jaqueta escura.",
          "effect": {}
        },
        {
          "id": "weapon",
          "label": "Arma",
          "prompt": "Você viu arma?",
          "answer": "Não vi arma.",
          "effect": {}
        },
        {
          "id": "caller_safe",
          "label": "Segurança",
          "prompt": "Você está em segurança?",
          "answer": "Sim, estou observando de longe.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol"
      ]
    },
    "hint": "Coleta local/descrição e despache patrulha para abordagem."
  },
  {
    "id": "pol_stabbing_01",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Agressão com faca",
    "opening": [
      "Uma pessoa foi esfaqueada aqui!",
      "Tem uma briga e alguém está com faca!"
    ],
    "baseSeverity": "grave",
    "callerState": "panic",
    "timers": {
      "worsen": 30,
      "fail": 80
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "injuries"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde está acontecendo exatamente?",
          "answer": "Na calçada, em frente ao bar.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "injuries",
          "label": "Feridos",
          "prompt": "A vítima está consciente? Sangramento forte?",
          "answer": "Tá sangrando muito e caída.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "suspect",
          "label": "Autor",
          "prompt": "O agressor ainda está no local?",
          "answer": "Saiu correndo...",
          "effect": {}
        },
        {
          "id": "direction",
          "label": "Fuga",
          "prompt": "Qual direção ele tomou?",
          "answer": "Rumo à avenida.",
          "effect": {}
        },
        {
          "id": "weapon",
          "label": "Arma",
          "prompt": "A faca ainda está com ele?",
          "answer": "Sim.",
          "effect": {
            "severity": "grave"
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "patrol"
      ]
    },
    "hint": "Priorize atendimento e contenção. Acione patrulha e, se possível, suporte médico."
  },
  {
    "id": "pol_terror_suspected_01",
    "agency": "police",
    "region": "GLOBAL",
    "title": "Ameaça terrorista / ataque coordenado (suspeita)",
    "opening": [
      "Tem gente correndo e falando em explosão... vi alguém deixar uma mochila e sair rápido.",
      "Recebemos uma ameaça de ataque durante um evento lotado."
    ],
    "baseSeverity": "critico",
    "callerState": "panic",
    "timers": {
      "worsen": 25,
      "fail": 75
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "what"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde está acontecendo? Informe endereço e tipo de local.",
          "answer": "É num evento na área central.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "what",
          "label": "O que houve",
          "prompt": "O que você viu/ouviu exatamente?",
          "answer": "Uma mochila abandonada e gritos de explosão.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "suspects",
          "label": "Suspeitos",
          "prompt": "Você viu suspeitos? Descreva rapidamente.",
          "answer": "Uma pessoa de capuz saiu correndo.",
          "effect": {}
        },
        {
          "id": "package",
          "label": "Objeto",
          "prompt": "Descreva o objeto suspeito.",
          "answer": "Mochila grande, preta.",
          "effect": {}
        },
        {
          "id": "injuries",
          "label": "Feridos",
          "prompt": "Há feridos?",
          "answer": "Não vi, só pânico.",
          "effect": {}
        },
        {
          "id": "weapons",
          "label": "Armas",
          "prompt": "Você viu armas?",
          "answer": "Não.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "federal",
        "bomb"
      ]
    },
    "hint": "Caso extremo: colete informações e acione coordenação/federal e antibomba."
  },
  {
    "id": "fire_highrise_fire_01",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Incêndio em prédio alto (múltiplos andares)",
    "opening": [
      "Tem fumaça e fogo subindo pelo prédio, muita gente nas janelas!",
      "O corredor está tomado de fumaça, não conseguimos descer."
    ],
    "baseSeverity": "critico",
    "callerState": "panic",
    "timers": {
      "worsen": 25,
      "fail": 70
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "floor"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço completo do prédio?",
          "answer": "Avenida principal, número 200.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "floor",
          "label": "Andar",
          "prompt": "Em qual andar está o fogo/fumaça?",
          "answer": "Parece no 8º andar.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "people",
          "label": "Pessoas presas",
          "prompt": "Há pessoas presas/sem rota de fuga?",
          "answer": "Sim, tem gente no apartamento.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "stairs",
          "label": "Escada",
          "prompt": "A escada de emergência está com fumaça?",
          "answer": "Sim, muita fumaça.",
          "effect": {}
        },
        {
          "id": "gas",
          "label": "Gás",
          "prompt": "Sente cheiro de gás ou explosões?",
          "answer": "Não, só fumaça.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "fire_support",
        "fire"
      ]
    },
    "hint": "Coleta endereço/andar e acione viatura de incêndio e apoio (escada)."
  },
  {
    "id": "fire_industrial_fire_01",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Incêndio industrial / galpão",
    "opening": [
      "Um galpão está pegando fogo e a fumaça é muito forte.",
      "Incêndio em área industrial, tem estalos e risco de explosão."
    ],
    "baseSeverity": "grave",
    "callerState": "agitated",
    "timers": {
      "worsen": 35,
      "fail": 95
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "what"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Qual o endereço do galpão e como acessar?",
          "answer": "Zona industrial, portão ao lado do depósito.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "what",
          "label": "Material",
          "prompt": "O que está queimando? Há produtos químicos?",
          "answer": "Tem muito material plástico...",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "people",
          "label": "Pessoas",
          "prompt": "Há pessoas presas no local?",
          "answer": "Acho que não, evacuaram.",
          "effect": {}
        },
        {
          "id": "haz",
          "label": "Risco químico",
          "prompt": "Há cilindros/gases/combustível próximo?",
          "answer": "Tem botijões e tambores.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "smoke",
          "label": "Fumaça",
          "prompt": "A fumaça está indo para área residencial?",
          "answer": "Sim, está indo para as casas.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "fire"
      ]
    },
    "hint": "Incêndio complexo: endereço e material. Acione unidade de incêndio."
  },
  {
    "id": "fire_hazmat_spill_01",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Derramamento químico / produto perigoso",
    "opening": [
      "Caiu um líquido estranho na via e está soltando cheiro forte.",
      "Um caminhão vazou produto e as pessoas estão passando mal."
    ],
    "baseSeverity": "grave",
    "callerState": "tense",
    "timers": {
      "worsen": 40,
      "fail": 110
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "substance"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Qual o endereço e sentido da via?",
          "answer": "Rodovia, km 12, próximo ao retorno.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "substance",
          "label": "Substância",
          "prompt": "Você sabe qual produto vazou? Placa/identificação?",
          "answer": "Não sei, mas tem símbolo de perigo.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "people",
          "label": "Expostos",
          "prompt": "Há pessoas passando mal ou com contato direto?",
          "answer": "Sim, tosse e ardência.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "fire",
          "label": "Fogo",
          "prompt": "Há fogo/faíscas no local?",
          "answer": "Não.",
          "effect": {}
        },
        {
          "id": "wind",
          "label": "Vento",
          "prompt": "O vento está levando o cheiro para onde?",
          "answer": "Para o lado das casas.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "hazmat"
      ]
    },
    "hint": "Produto perigoso: colete local/substância e acione HazMat."
  },
  {
    "id": "fire_cardiac_01",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Pessoa inconsciente / possível parada cardíaca",
    "opening": [
      "Meu pai caiu e não responde!",
      "Tem uma pessoa no chão, inconsciente, acho que não está respirando!"
    ],
    "baseSeverity": "critico",
    "callerState": "panic",
    "timers": {
      "worsen": 20,
      "fail": 55
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "breathing"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Endereço",
          "prompt": "Qual o endereço exato?",
          "answer": "Rua do mercado, número 10.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "breathing",
          "label": "Respiração",
          "prompt": "A pessoa está respirando?",
          "answer": "Não sei... muito fraco.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "age",
          "label": "Idade",
          "prompt": "Idade aproximada?",
          "answer": "Uns 60.",
          "effect": {}
        },
        {
          "id": "aed",
          "label": "DEA",
          "prompt": "Há um DEA/desfibrilador no local?",
          "answer": "Não.",
          "effect": {}
        },
        {
          "id": "medical",
          "label": "Histórico",
          "prompt": "Algum histórico médico conhecido?",
          "answer": "Pressão alta.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "ems"
      ]
    },
    "hint": "Prioridade absoluta: local e respiração. Acione ambulância imediatamente."
  },
  {
    "id": "fire_collapse_01",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Desabamento / vítimas presas",
    "opening": [
      "Uma parte do prédio desabou e tem gente gritando presa!",
      "Caiu uma estrutura e tem pessoas soterradas."
    ],
    "baseSeverity": "critico",
    "callerState": "panic",
    "timers": {
      "worsen": 25,
      "fail": 70
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "trapped"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Qual o endereço exato do desabamento?",
          "answer": "Rua da obra, em frente ao mercado.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "trapped",
          "label": "Presos",
          "prompt": "Quantas pessoas estão presas/soterradas?",
          "answer": "Pelo menos duas.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "injuries",
          "label": "Feridos",
          "prompt": "Há feridos graves visíveis?",
          "answer": "Sim, muito sangue.",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "gas",
          "label": "Gás/energia",
          "prompt": "Você sente cheiro de gás ou fios energizados?",
          "answer": "Tem cheiro de gás.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "stability",
          "label": "Risco",
          "prompt": "A estrutura continua cedendo?",
          "answer": "Está estalando.",
          "effect": {
            "severity": "grave"
          }
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "special_rescue",
        "rescue"
      ]
    },
    "hint": "Priorize busca e salvamento. Acione salvamento/USAR."
  },
  {
    "id": "fire_mci_crash_01",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Engavetamento / múltiplas vítimas",
    "opening": [
      "Acidente com vários carros e muitas pessoas feridas!",
      "Teve um engavetamento enorme, tem gente presa."
    ],
    "baseSeverity": "grave",
    "callerState": "agitated",
    "timers": {
      "worsen": 35,
      "fail": 95
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "victims"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde está o acidente? Informe sentido da via.",
          "answer": "Na rodovia, sentido centro.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "victims",
          "label": "Vítimas",
          "prompt": "Quantas vítimas aproximadamente?",
          "answer": "Muitas, mais de cinco.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "trapped",
          "label": "Presos",
          "prompt": "Há vítimas presas nas ferragens?",
          "answer": "Sim, pelo menos uma.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "fire",
          "label": "Fogo",
          "prompt": "Há fogo ou vazamento de combustível?",
          "answer": "Tem cheiro de gasolina.",
          "effect": {}
        },
        {
          "id": "traffic",
          "label": "Trânsito",
          "prompt": "A via está totalmente bloqueada?",
          "answer": "Sim, tudo parado.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "rescue",
        "ems"
      ]
    },
    "hint": "Caso com vítimas múltiplas. Acione resgate e, se disponível, ambulância."
  },
  {
    "id": "fire_drowning_01",
    "agency": "fire",
    "region": "GLOBAL",
    "title": "Afogamento / resgate aquático",
    "opening": [
      "Uma pessoa está se afogando no lago!",
      "Tem alguém sendo levado pela correnteza!"
    ],
    "baseSeverity": "grave",
    "callerState": "panic",
    "timers": {
      "worsen": 30,
      "fail": 80
    },
    "outcomes": {
      "success": "Ocorrência controlada.",
      "worsen": "A situação piorou e o risco aumentou.",
      "fail": "Ocorrência evoluiu para consequências graves."
    },
    "protocol": {
      "required": [
        "location",
        "inwater"
      ],
      "questions": [
        {
          "id": "location",
          "label": "Local",
          "prompt": "Onde exatamente (praia, rio, lago) e referência?",
          "answer": "No rio, perto da ponte.",
          "effect": {
            "severity": "grave"
          }
        },
        {
          "id": "inwater",
          "label": "Na água?",
          "prompt": "A vítima ainda está na água?",
          "answer": "Sim, sumindo!",
          "effect": {
            "severity": "critico"
          }
        },
        {
          "id": "count",
          "label": "Qtd.",
          "prompt": "Quantas vítimas?",
          "answer": "Uma.",
          "effect": {}
        },
        {
          "id": "current",
          "label": "Correnteza",
          "prompt": "A correnteza está forte?",
          "answer": "Sim.",
          "effect": {}
        },
        {
          "id": "caller_safe",
          "label": "Sua segurança",
          "prompt": "Você está em segurança? Não se arrisque.",
          "answer": "Estou na margem.",
          "effect": {}
        }
      ]
    },
    "dispatch": {
      "correctRoles": [
        "rescue"
      ]
    },
    "hint": "Resgate aquático: local e se a vítima está na água. Acione resgate."
  }
];
