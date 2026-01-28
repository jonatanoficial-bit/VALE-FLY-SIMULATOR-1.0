window.GameModule = (() => {
  function init(){
    // autosave + tick
    setInterval(()=>{
      try{ FlySimStore.save(window.gameState || window.flightData); }catch(_){}
      window.dispatchEvent(new Event("game-updated"));
    }, 1000);
  }
  return { init };
})();
