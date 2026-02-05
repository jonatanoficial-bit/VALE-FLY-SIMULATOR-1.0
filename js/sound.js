
(function(){
  function ensure(state){
    state.settings = state.settings || { soundOn: true };
    return state;
  }
  function beep(freq){
    try{
      if(!window.gameState) return;
      ensure(window.gameState);
      if(!window.gameState.settings.soundOn) return;
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const o = ctx.createOscillator();
      o.frequency.value = freq||440;
      o.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime+0.05);
    }catch(e){}
  }
  window.SoundModule={beep};
})();
