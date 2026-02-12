// BUILD_2026-02-12_STAGE4_02_HF1
// Generated: 2026-02-12 21:50:14
// Aircraft Picker (runs after DOM + gameState)

(function(){
  function money(n){
    try{ return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n||0); }
    catch(_){ return "R$ " + (n||0); }
  }

  function ready(){
    return document.getElementById("aircraftPicker")
      && document.getElementById("openAircraftPicker")
      && document.getElementById("closeAircraftPicker")
      && document.getElementById("aircraftGrid")
      && document.getElementById("aircraftSearch")
      && document.getElementById("buyModel")
      && (window.gameState || window.DEFAULT_GAME_STATE);
  }

  function init(){
    const modal = document.getElementById("aircraftPicker");
    const openBtn = document.getElementById("openAircraftPicker");
    const closeBtn = document.getElementById("closeAircraftPicker");
    const grid = document.getElementById("aircraftGrid");
    const search = document.getElementById("aircraftSearch");
    const sel = document.getElementById("buyModel");
    const preview = document.getElementById("buyModelPreview");
    const backdrop = modal?.querySelector(".modalBackdrop");

    if(!modal || !openBtn || !closeBtn || !grid || !search || !sel) return;

    function open(){
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden","false");
      renderGrid(search.value||"");
      setTimeout(()=>search.focus(), 30);
    }
    function close(){
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden","true");
    }

    function getList(){
      const s = window.gameState || window.DEFAULT_GAME_STATE || {};
      return (s.aircraftCatalog || []).slice();
    }

    function renderGrid(q){
      const list = getList();
      const query = (q||"").toLowerCase().trim();
      const filtered = !query ? list : list.filter(m=>{
        const t = `${m.modelId} ${m.name}`.toLowerCase();
        return t.includes(query);
      });

      grid.innerHTML = filtered.map(m=>{
        const img = `<img src="assets/aircraft/models/${m.modelId}.png" onerror="this.onerror=null;this.src='assets/aircraft/models/placeholder.png';" alt="${m.name}">`;
        const km = Math.round(m.rangeKm||0);
        const seats = m.seats||0;
        return `
          <div class="cardMini" data-model="${m.modelId}">
            <div class="imgWrap">${img}</div>
            <div class="title">${m.modelId} • ${m.name}</div>
            <div class="metaLine"><span>${seats} assentos</span><span>${km} km</span></div>
            <div class="metaLine"><span>Preço</span><span>${money(m.price||0)}</span></div>
          </div>
        `;
      }).join("") || `<div style="color:var(--muted);padding:10px">Nenhum modelo encontrado.</div>`;
    }

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    backdrop?.addEventListener("click", close);
    search.addEventListener("input", ()=>renderGrid(search.value||""));

    grid.addEventListener("click", (e)=>{
      const card = e.target.closest(".cardMini");
      if(!card) return;
      const id = card.getAttribute("data-model");
      sel.value = id;
      sel.dispatchEvent(new Event("change"));
      if(preview) preview.src = `assets/aircraft/models/${id}.png`;
      close();
    });

    // keep preview synced
    sel.addEventListener("change", ()=>{
      if(preview) preview.src = `assets/aircraft/models/${sel.value}.png`;
    });
  }

  function boot(){
    if(ready()) return init();
    let tries = 0;
    const t = setInterval(()=>{
      tries++;
      if(ready()){ clearInterval(t); init(); }
      if(tries>80) clearInterval(t);
    }, 100);
  }

  if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
