# DioBook

Minimal EPUB audiobook reader. Load any EPUB, pick a voice, listen — no accounts, no limits, no ads.

**Live:** https://meldatelkok.github.io/diobook/

## Features

- 📖 **EPUB support** — Load any EPUB file from your device
- ☁ **12 cloud voices** — Deepgram Aura voices (Asteria, Luna, Zeus, Athena, Angus, etc.) via Cloudflare Workers AI — free and unlimited
- 📱 **Device voices fallback** — Uses iPhone/device built-in voices if you prefer offline
- 🎨 **Clean UI** — Library view with covers, full-screen player, floating mini player
- 🌙 **Dark & light mode** — Auto-follows system preference or manual toggle
- ⏱ **Speed control** — 0.5×–2.5× playback with pitch preservation
- 📌 **Resume where you left** — Per-book progress tracking
- 📚 **Multi-book library** — Books stored locally in IndexedDB
- 📱 **Install as PWA** — Add to home screen for a native-like experience
- 🔇 **No tracking, no analytics** — All processing in your browser

## How to use

1. Open https://meldatelkok.github.io/diobook/ in Safari (iOS) or any modern browser
2. Tap **+** to add an EPUB file
3. Pick a chapter and press play
4. Tap the voice chip to switch between 12 different cloud voices
5. On iPhone: Share → **Add to Home Screen** for fullscreen app experience

## Voices

**Cloud voices** (default, requires internet, unlimited & free):
- Asteria, Luna, Stella, Athena, Hera (female)
- Orion, Arcas, Perseus, Angus, Orpheus, Helios, Zeus (male)
- Includes British, American, Irish accents

**Device voices** (offline):
- Uses your OS's built-in TTS voices
- On iPhone, higher-quality Premium voices are hidden from web apps by iOS — cloud voices recommended

## Tech stack

- Vanilla HTML/CSS/JS — no build step
- [epub.js](https://github.com/futurepress/epub.js) for EPUB parsing
- [Deepgram Aura](https://developers.cloudflare.com/workers-ai/models/) via Cloudflare Workers AI for high-quality TTS
- Web Speech API for on-device TTS fallback
- IndexedDB for book storage
- LocalStorage for settings and reading progress

## Privacy

Books never leave your device beyond the single sentence being spoken (sent to the TTS proxy for audio synthesis). No analytics, no cookies, no tracking.
