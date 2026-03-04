(function(){
  const DEFAULTS = {
    tickMs: 1000,      // 1s real
    startMinute: 6*60  // 06:00
  };

  function ensureClock(state){
    state.clock ||= {
      day: state.company?.day || 1,
      minuteOfDay: DEFAULTS.startMinute,
      speed: 1
    };
  }

  function fmt(min){
    const h = Math.floor(min/60)%24;
    const m = Math.floor(min%60);
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
  }

  let timer = null;

  function start(){
    stop();
    timer = setInterval(()=>{
      const s = window.gameState;
      if(!s) return;
      ensureClock(s);

      const addMinutes = Math.max(1, Math.min(4, Number(s.clock.speed)||1));
      s.clock.minuteOfDay += addMinutes;

      if(s.clock.minuteOfDay >= 24*60){
        s.clock.minuteOfDay -= 24*60;
        s.company.day = (s.company.day||1) + 1;
        s.clock.day = s.company.day;
      }

      window.dispatchEvent(new CustomEvent("time-tick", { detail: { minuteOfDay: s.clock.minuteOfDay, day: s.company.day } }));
      window.dispatchEvent(new Event("game-updated"));

      try{ FlySimStore.save(s); }catch(_){}
    }, DEFAULTS.tickMs);
  }

  function stop(){
    if(timer){ clearInterval(timer); timer=null; }
  }

  function setSpeed(x){
    const s=window.gameState; if(!s) return;
    ensureClock(s);
    s.clock.speed = Math.max(1, Math.min(4, Number(x)||1));
    try{ FlySimStore.save(s); }catch(_){}
    window.dispatchEvent(new Event("game-updated"));
  }

  window.TimeSim = { start, stop, setSpeed, fmt, ensureClock };
})();