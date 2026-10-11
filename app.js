(() => {
  const $ = id => document.getElementById(id);
  const messages = $("messages"), form = $("chatForm"), input = $("promptInput");
  let recognition = null;
  const prefs = JarvisMemory.preferences();
  $("displayName").value = prefs.name || "sir";
  $("speechToggle").checked = prefs.speech !== false;
  $("motionToggle").checked = !!prefs.reduceMotion;
  document.body.classList.toggle("reduce-motion", !!prefs.reduceMotion);

  function addMessage(role, text, save=true) {
    const article = document.createElement("article");
    article.className = "message " + role;
    const avatar = document.createElement("div"); avatar.className = "avatar"; avatar.textContent = role === "assistant" ? "J" : "U";
    const bubble = document.createElement("div"); bubble.className = "bubble";
    const label = document.createElement("div"); label.className = "message-label"; label.textContent = role === "assistant" ? "JARVIS · SYSTEM" : "YOU";
    const p = document.createElement("p"); p.textContent = text;
    bubble.append(label,p); article.append(avatar,bubble); messages.append(article); messages.scrollTop = messages.scrollHeight;
    if (save) JarvisMemory.addHistory(role, text);
  }
  function respond(text) {
    const result = JarvisCommands.run(text);
    addMessage("assistant", result.text);
    JarvisVoice.speak(result.text);
  }
  function send(text) {
    const clean = (text ?? input.value).trim(); if (!clean) return;
    addMessage("user", clean); input.value = ""; input.style.height = "auto"; respond(clean);
  }
  const history = JarvisMemory.history();
  if (history.length) {
    messages.innerHTML = "";
    history.forEach(item => addMessage(item.role, item.text, false));
  }
  form.addEventListener("submit", e => { e.preventDefault(); send(); });
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight,110) + "px"; });
  document.querySelectorAll("[data-prompt]").forEach(btn => btn.addEventListener("click", () => send(btn.dataset.prompt)));
  document.querySelectorAll("[data-command]").forEach(btn => btn.addEventListener("click", () => send(({time:"time",notes:"notes",help:"help"})[btn.dataset.command] || btn.dataset.command)));
  $("settingsBtn").addEventListener("click", () => $("settingsDialog").showModal());
  $("saveSettings").addEventListener("click", e => {
    e.preventDefault();
    const p = JarvisMemory.setPreferences({name:$("displayName").value.trim() || "sir", speech:$("speechToggle").checked, reduceMotion:$("motionToggle").checked});
    document.body.classList.toggle("reduce-motion", p.reduceMotion);
    $("settingsDialog").close();
    addMessage("assistant", "Settings saved on this device, " + p.name + ".");
  });
  $("clearBtn").addEventListener("click", () => {
    JarvisMemory.clearHistory(); messages.innerHTML = "";
    addMessage("assistant", "Conversation cleared. Local notes remain saved.");
  });
  $("micBtn").addEventListener("click", () => {
    if (recognition) { try { recognition.stop(); } catch {} recognition = null; return; }
    recognition = JarvisVoice.listen(text => { recognition = null; input.value = text; send(); }, err => { recognition = null; addMessage("assistant", err); });
  });
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
  $("systemStatus").textContent = "SYSTEM ONLINE · LOCAL MODE";
})();