/* Local-only storage. Do not store passwords, API keys, or sensitive data here. */
window.JarvisMemory = (() => {
  const KEY = "jarvis-memory-v1";
  function read() {
    try {
      return (
        JSON.parse(localStorage.getItem(KEY)) || {
          notes: [],
          preferences: { name: "sir", speech: true, reduceMotion: false },
          history: [],
        }
      );
    } catch {
      return {
        notes: [],
        preferences: { name: "sir", speech: true, reduceMotion: false },
        history: [],
      };
    }
  }
  function write(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }
  return {
    all: read,
    preferences() {
      return read().preferences;
    },
    setPreferences(patch) {
      const data = read();
      data.preferences = { ...data.preferences, ...patch };
      write(data);
      return data.preferences;
    },
    addNote(text) {
      const data = read();
      data.notes.push({ text, createdAt: new Date().toISOString() });
      data.notes = data.notes.slice(-100);
      write(data);
      return data.notes;
    },
    notes() {
      return read().notes;
    },
    addHistory(role, text) {
      const data = read();
      data.history.push({ role, text, at: Date.now() });
      data.history = data.history.slice(-80);
      write(data);
    },
    history() {
      return read().history;
    },
    clearHistory() {
      const data = read();
      data.history = [];
      write(data);
    },
    clearAll() {
      localStorage.removeItem(KEY);
    },
  };
})();
