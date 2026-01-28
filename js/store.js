// FlySim Store v1 (offline-first)
// - localStorage save
// - export/import JSON save file

window.FlySimStore = (() => {
  const KEY = 'flysim_save_v1';

  function safeJsonParse(str, fallback = null) {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function load() {
    return safeJsonParse(localStorage.getItem(KEY), null);
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  function downloadJson(filename, dataObj) {
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function readFileAsText(file) {
    return await file.text();
  }

  return {
    KEY,
    save,
    load,
    clear,
    downloadJson,
    readFileAsText,
  };
})();
