window.JarvisCommands = (() => {
  const help = [
    "Available local commands:",
    "• help — show this guide",
    "• time / date — show device time",
    "• status — show system status",
    "• remember: [note] — save a local note",
    "• notes — list saved notes",
    "• clear notes — delete saved notes",
    "• plan my day — create a simple planning template",
    "",
    "General questions need an AI model connection, which is not configured yet.",
  ].join("\n");
  function run(raw) {
    const input = raw.trim();
    const lower = input.toLowerCase();
    if (/^(help|commands|what can you do)\??$/.test(lower))
      return { text: help };
    if (/^(time|date|time and date|what time is it)\??$/.test(lower))
      return {
        text:
          "Local device time: " +
          new Date().toLocaleString(undefined, {
            dateStyle: "full",
            timeStyle: "short",
          }),
      };
    if (/^(status|system status)$/.test(lower))
      return {
        text:
          "System status: ONLINE\nMode: local prototype\nMemory: browser storage available\nAI model: not connected\nVoice output: " +
          (JarvisVoice.supported() ? "available" : "not supported") +
          "\nVoice input: " +
          (JarvisVoice.recognitionSupported()
            ? "available in this browser"
            : "not supported in this browser"),
      };
    if (lower.startsWith("remember:")) {
      const note = input.slice(input.indexOf(":") + 1).trim();
      if (!note)
        return {
          text: "Please include the note after “remember:”. For example: remember: revise biology on Friday.",
        };
      JarvisMemory.addNote(note);
      return {
        text: "Saved locally. I will keep that note in this browser on this device.",
      };
    }
    if (/^(notes|show notes|memory notes)$/.test(lower)) {
      const notes = JarvisMemory.notes();
      return {
        text: notes.length
          ? "Your saved notes:\n" +
            notes.map((n, i) => `${i + 1}. ${n.text}`).join("\n")
          : "No notes saved yet. Use “remember: ...” to save one.",
      };
    }
    if (/^(clear notes|delete notes)$/.test(lower)) {
      return {
        text: "To protect against accidental loss, clear notes from the settings/storage controls in a future build. This command does not delete anything yet.",
      };
    }
    if (/^(plan my day|help me plan my day)$/.test(lower))
      return {
        text: "A simple plan, sir:\n1. Choose your three most important tasks.\n2. Start with the most time-sensitive task.\n3. Take short breaks between focused sessions.\n4. Review what remains at the end of the day.\n\nTell me your tasks and I can organise them locally.",
      };
    if (/\b(thank you|thanks)\b/.test(lower))
      return { text: "You're welcome, sir. Happy to be of service." };
    if (/^(hello|hi|hey|good morning|good evening)\b/.test(lower))
      return {
        text: "Good day, sir. Local systems are operational. What shall we work on?",
      };
    return {
      text: "I can process local commands, but an AI model is not connected yet. Try “help”, “time”, “status”, or “remember: ...”. The next development step is to connect a model through a secure backend.",
    };
  }
  return { run, help };
})();
