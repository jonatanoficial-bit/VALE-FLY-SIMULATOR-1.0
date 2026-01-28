// FlySim 2026 - Part 2 bootstrap

(function () {
  // Service worker (offline)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  let state = window.FlySimState.sanitizeState(window.FlySimStore.load()) || window.FlySimState.newGame();
  window.FlySimStore.save(state);

  const airportsByIata = window.FlySimAirports.byIata;

  const canvas = document.getElementById('mapCanvas');
  const map = new window.FlySimMapCanvas.MapView(canvas, airportsByIata, () => state);
  window.__flysim_map = map;

  const ui = new window.FlySimUI.UI({
    getState: () => state,
    setState: (s) => { state = s; },
    airportsByIata,
    onAdvanceDay: () => {
      const result = window.FlySimEconomy.advanceOneDay(state, airportsByIata);
      window.FlySimStore.save(state);

      // subtle feedback
      const fmt = (v) => Number(v || 0).toLocaleString('pt-BR', {style:'currency',currency:'BRL'});
      const warn = result.shortage01 > 0.05 ? ' • ⚠ Equipe insuficiente' : '';
      document.getElementById('toast').textContent =
        `Dia concluído • Lucro: ${fmt(result.profit)} • Salários: ${fmt(result.wages)} • Manut.: ${fmt(result.maintCost)}${warn}`;

      document.getElementById('toast').classList.add('show');
      setTimeout(() => document.getElementById('toast').classList.remove('show'), 2600);

      return result;
    },
    onRenderMap: () => map.render(),
    onReset: () => {
      window.FlySimStore.clear();
      state = window.FlySimState.newGame();
      window.FlySimStore.save(state);
    }
  });

  // First render
  map.render();
  ui.render();
})();
