// BUILD_2026-02-13_STAGE4_03
// Generated: 2026-02-13 13:12:13
// Visual Aircraft Shop (inline grid + modal). Non-breaking: keeps <select> as source of truth.

(function(){
  function money(n){
    try{ return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n||0); }
    catch(_){ return "R$ " + (n||0); }
  }

  function state(){
    return window.gameState || window.DEFAULT_GAME_STATE || {};
  }

  function list(){
    return (state().aircraftCatalog || []).slice();
  }

  function ensure(){
    return document.getElementById("buyModel")
      && document.getElementById("shopGrid")
      && document.getElementById("buyModelPreview");
  }

  function cardHTML(m){
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
  }

  function renderInline(){
    const grid = document.getElementById("shopGrid");
    const sel = document.getElementById("buyModel");
    if(!grid || !sel) return;
    const models = list();
    // Show top 6 inline for fast purchase (mobile-friendly)
    const top = models.slice(0, 6);
    grid.innerHTML = top.map(cardHTML).join("");
    syncSelected(grid, sel.value);
  }

  function syncSelected(container, modelId){
    container.querySelectorAll(".cardMini").forEach(c=>c.classList.toggle("selected", c.getAttribute("data-model")===modelId));
  }

  function openModal(){
    const modal = document.getElementById("aircraftPicker");
    if(!modal) return;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden","false");
    renderModalGrid("");
    setTimeout(()=>document.getElementById("aircraftSearch")?.focus(), 30);
  }

  function closeModal(){
    const modal = document.getElementById("aircraftPicker");
    if(!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden","true");
  }

  function renderModalGrid(q){
    const grid = document.getElementById("aircraftGrid");
    const sel = document.getElementById("buyModel");
    if(!grid || !sel) return;
    const query = (q||"").toLowerCase().trim();
    const models = list();
    const filtered = !query ? models : models.filter(m=>`${m.modelId} ${m.name}`.toLowerCase().includes(query));
    grid.innerHTML = filtered.map(cardHTML).join("") || `<div style="color:rgba(255,255,255,.6);padding:10px">Nenhum modelo encontrado.</div>`;
    syncSelected(grid, sel.value);
  }

  function setModel(id){
    const sel = document.getElementById("buyModel");
    const preview = document.getElementById("buyModelPreview");
    if(!sel) return;
    sel.value = id;
    sel.dispatchEvent(new Event("change"));
    if(preview) preview.src = `assets/aircraft/models/${id}.png`;
    // sync both grids
    const inline = document.getElementById("shopGrid");
    const modalGrid = document.getElementById("aircraftGrid");
    if(inline) syncSelected(inline, id);
    if(modalGrid) syncSelected(modalGrid, id);
  }

  function init(){
    const sel = document.getElementById("buyModel");
    const openBtn = document.getElementById("openAircraftPicker");
    const closeBtn = document.getElementById("closeAircraftPicker");
    const backdrop = document.querySelector("#aircraftPicker .modalBackdrop");
    const search = document.getElementById("aircraftSearch");
    const inline = document.getElementById("shopGrid");
    const modalGrid = document.getElementById("aircraftGrid");

    renderInline();

    inline?.addEventListener("click", (e)=>{
      const card = e.target.closest(".cardMini");
      if(!card) return;
      setModel(card.getAttribute("data-model"));
    });

    openBtn?.addEventListener("click", openModal);
    closeBtn?.addEventListener("click", closeModal);
    backdrop?.addEventListener("click", closeModal);
    search?.addEventListener("input", ()=>renderModalGrid(search.value||""));

    modalGrid?.addEventListener("click", (e)=>{
      const card = e.target.closest(".cardMini");
      if(!card) return;
      setModel(card.getAttribute("data-model"));
      closeModal();
    });

    sel?.addEventListener("change", ()=>{
      const id = sel.value;
      const preview = document.getElementById("buyModelPreview");
      if(preview) preview.src = `assets/aircraft/models/${id}.png`;
      syncSelected(inline, id);
      if(modalGrid) syncSelected(modalGrid, id);
    });
  }

  function boot(){
    if(ensure()) return init();
    let tries=0;
    const t=setInterval(()=>{
      tries++;
      if(ensure()){ clearInterval(t); init(); }
      if(tries>80) clearInterval(t);
    }, 100);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
