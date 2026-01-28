# FlySim 2026 (Parte 1) – Offline MVP

Esta é a **Parte 1** do roadmap: um **MVP premium** totalmente jogável **offline**, com mapa mundi (modo offline) e um núcleo de gestão de rotas.

## O que já está incluído (Parte 1)

- **Mapa global offline** renderizado em **canvas** (pan/zoom com mouse ou toque)
- **Base de aeroportos offline** (lista curada de hubs globais + foco Brasil)
- **Criação de rotas** (origem/destino, preço, frequência e assentos)
- **Economia simples** (receita/custo/lucro por dia por rota)
- **Salvar automaticamente** no dispositivo
- **Exportar/Importar save** (JSON) para backup ou troca entre PC e celular
- PWA com **Service Worker** (cache offline)

> Observação: o **mapa realista 100% offline (alta resolução/tiles)** entra na **Parte 3** via pacotes regionais.

## Como rodar

1. Abra `index.html` no navegador.
2. Para testar o modo PWA offline corretamente, rode com um servidor local (ex.: `python -m http.server`) e acesse pelo navegador.
3. No celular, adicione à tela inicial (PWA) para jogar offline.

## Próximas partes

- Parte 2: gestão mais profunda (frota, manutenção, demanda, relatórios)
- Parte 3: mapa offline realista com pacotes regionais
- Parte 4: simulação 3D de voo mais realista