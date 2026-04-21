# diobook
EPUB reader that reads books aloud using your device's built-in voices. PWA, works offline, unlimited listening.
A lightweight web app that reads your EPUB books aloud using your device's built-in text-to-speech voices. No accounts, no limits, no cloud, no subscriptions.

**Live:** https://meldatelkok.github.io/diobook/

## Features

- 📖 **EPUB support** — Load any EPUB file from your device
- 🎧 **Device voices** — Uses your OS's built-in voices (Premium/Enhanced quality on iOS)
- 🎨 **Clean UI** — Library view with covers, full-screen player, mini player
- ⏱ **Speed & pitch control** — 0.5×–2.5× playback speed
- 📌 **Resume where you left** — Per-book progress tracking
- 🌙 **Dark mode** — Pure black background, OLED-friendly
- 📱 **Install as PWA** — Add to home screen for a native-like experience
- 💾 **Offline** — Books stored locally in IndexedDB
- 🔇 **No tracking, no backend** — Everything runs in your browser

## How to use

1. Open https://meldatelkok.github.io/diobook/ in Safari (iOS) or Chrome (Android/desktop)
2. Tap **+** to add an EPUB file
3. Pick a chapter and press play
4. On iPhone: Add to Home Screen via the Share button for a full-screen app experience

## Getting the best voices on iPhone

For higher-quality narration, download Premium voices:

**Settings → Accessibility → Spoken Content → Voices → English**

Recommended downloads:
- Ava (Premium)
- Zoe (Premium)
- Evan (Enhanced)
- Samantha (Enhanced)

After downloading, refresh the voice list in the app's settings.

## Tech stack

- Vanilla HTML/CSS/JS — zero build step
- [epub.js](https://github.com/futurepress/epub.js) for EPUB parsing
- Web Speech API for TTS
- IndexedDB for book storage
- LocalStorage for settings and reading progress

## Privacy

All processing happens on your device. Books never leave your browser. No analytics, no cookies, no external requests beyond loading the app itself.
