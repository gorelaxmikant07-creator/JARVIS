# Project JARVIS v0.1

A free-first, Android-friendly personal assistant interface prototype.

## What works now
- Responsive JARVIS-inspired HUD
- Local command engine: help, time/date, status, notes, day-planning template
- Local conversation history and note storage in browser localStorage
- Optional browser speech synthesis and speech recognition when supported
- PWA manifest and service worker shell for installation/offline shell caching
- No API keys, backend, or paid services required for this prototype

## Important limitations
This version is not connected to an AI model. It cannot answer general knowledge questions like a full LLM, browse the internet, or control Android apps. Those require separate integrations.
Speech recognition support depends on the browser and may send audio to a browser vendor's service.
Local browser storage is not encrypted. Do not store secrets or sensitive personal data.
Never put API keys in front-end JavaScript or a public repository. Add a backend before connecting a paid or private model API.

## Test on Android
1. Extract the ZIP.
2. Create a GitHub repository named `project-jarvis`.
3. Upload the contents of this folder to the repository root (not the enclosing folder).
4. In repository Settings → Pages, publish from the `main` branch and root folder.
5. Open the generated HTTPS Pages URL in Chrome.
6. Use Chrome's menu → Add to Home screen / Install app.
7. Test `help`, `status`, `time`, and `remember: revise biology`.

Service workers and installation require HTTPS or localhost. Opening `index.html` directly from a file manager may not enable PWA/offline features.

## Files
- `index.html`: application shell
- `styles.css`: visual design
- `app.js`: UI event handling
- `core/memory.js`: local storage
- `core/commands.js`: local command routing
- `adapters/voice.js`: browser speech adapters
- `manifest.json`: PWA metadata
- `sw.js`: offline app shell cache
