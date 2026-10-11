window.JarvisVoice = (() => {
  function speak(text) {
    const prefs = window.JarvisMemory?.preferences();
    if (!prefs?.speech || !("speechSynthesis" in window)) return false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 0.88;
    utterance.lang = "en-GB";
    window.speechSynthesis.speak(utterance);
    return true;
  }
  function listen(onText, onError) {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      onError(
        "Speech recognition is not supported by this browser. Try Chrome or use the text box."
      );
      return null;
    }
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => onText(event.results[0][0].transcript);
    recognition.onerror = (event) =>
      onError("Voice input issue: " + event.error);
    recognition.start();
    return recognition;
  }
  return {
    speak,
    listen,
    supported: () => "speechSynthesis" in window,
    recognitionSupported: () =>
      !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  };
})();
