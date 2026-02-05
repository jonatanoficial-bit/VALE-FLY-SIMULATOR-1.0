window.FlySimStore = (() => {
  const KEY = "flysim_v1";
  const VERSION = 1;

  function save(data){
    const payload = { version: VERSION, savedAt: new Date().toISOString(), data };
    localStorage.setItem(KEY, JSON.stringify(payload));
  }

  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return null;
      const payload = JSON.parse(raw);
      if(!payload || !payload.data) return null;
      return payload.data;
    }catch{ return null; }
  }

  function clear(){ localStorage.removeItem(KEY); }

  function exportBlob(data){
    const payload = { version: VERSION, exportedAt: new Date().toISOString(), data };
    const json = JSON.stringify(payload, null, 2);
    return new Blob([json], { type: "application/json" });
  }

  function importJson(text){
    const payload = JSON.parse(text);
    if(!payload || !payload.data) throw new Error("Arquivo inválido");
    save(payload.data);
    return payload.data;
  }

  return { save, load, clear, exportBlob, importJson, KEY, VERSION };
})();
