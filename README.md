# DioBook

Minimal EPUB audiobook reader with studio-quality cloud voices, AI-powered companion features, and complete privacy. Works on iPhone, Android, Windows, Mac.

**Live:** https://meldatelkok.github.io/diobook/

## Features

### 🎧 Listening
- **12 cloud voices** — Deepgram Aura (Asteria, Luna, Zeus, Athena, Angus, Orpheus, and more)
- **Device voices** fallback — works offline
- **Speed control** — 0.5×–2.5× with pitch preservation
- **Sleep timer** — 5 min to 1 hour, or "end of chapter"
- **Auto-next chapter** — seamless chapter transitions
- **Ambient sounds** — rain, fireplace, coffee shop, ocean, forest, white noise
- **Lock-screen controls** — play/pause/skip from iOS/Android lock screen and AirPods

### 🤖 AI companion
- **Ask about this book** — chat with an AI about characters, plot, themes
- **Chapter summaries** — 3-4 sentence AI summaries, on demand or auto after each chapter
- **Word translation & definition** — long-press any word for meaning + Turkish translation
- **Book recommendations** — AI suggests 5 similar books when you finish

### 📚 Library
- **Multi-book library** — stored locally in IndexedDB
- **Continue reading card** — last played book surfaced
- **Search & sort** — by recent/title/author/progress
- **Book covers** — auto-extracted from EPUB
- **Import from URL** — paste a direct EPUB link (Project Gutenberg, etc.)
- **Backup & restore** — export/import full library as JSON

### 📖 Reading
- **Bookmarks** — save any sentence, jump back anytime
- **Font size** — Small/Medium/Large/XL
- **Sentence highlight** — currently-playing sentence highlighted, tap to jump
- **"Back to playing"** — floating button when you scroll away
- **Chapter time remaining** — "12 min left" based on speed

### 🎨 UI
- **Dark & light mode** — auto or manual
- **Reading streak** — Duolingo-style daily streak tracking
- **Reading stats** — total time listened, finished books
- **Keyboard shortcuts** (desktop) — Space, arrows, N/P, B, /, Esc

### 📱 Platform
- **Install as PWA** on iOS, Android, Windows, Mac
- **Offline** — UI works offline, TTS requires internet
- **Responsive** — optimized for phone, tablet, and desktop
- **App shortcuts** — quick actions from home screen icon

### 🔒 Privacy
- Books never leave your device beyond the single sentence being spoken for TTS
- No analytics, no cookies, no accounts
- All library data stored locally

## How to use

### iPhone / iPad
1. Open https://meldatelkok.github.io/diobook/ in Safari
2. Tap Share → **Add to Home Screen**
3. Open DioBook from home screen for full-screen experience

### Android
1. Open the site in Chrome
2. Tap the "Install app" button in the menu
3. Launch from app drawer

### Windows / Mac
1. Open the site in Chrome/Edge/Safari
2. Click the install icon in the address bar (⊕)
3. Launch like any native app

## Keyboard shortcuts (desktop)

| Key | Action |
|-----|--------|
| `Space` | Play / pause |
| `←` `→` | Back / forward 1 sentence |
| `↑` `↓` | Back / forward 5 sentences |
| `N` / `P` | Next / previous chapter |
| `B` | Toggle bookmark on current sentence |
| `/` | Focus library search |
| `Esc` | Close any open sheet |

## Tech stack

- Vanilla HTML/CSS/JS — no build step
- [epub.js](https://github.com/futurepress/epub.js) for EPUB parsing
- Cloudflare Workers AI — [Deepgram Aura](https://developers.cloudflare.com/workers-ai/models/) for TTS, Llama 3.1 for summaries/chat/recommendations
- Web Speech API for on-device TTS fallback
- IndexedDB for book storage
- LocalStorage for settings, progress, bookmarks
- Service Worker for offline app shell
- Media Session API for lock-screen controls

## Privacy

Books never leave your device beyond the single sentence being spoken (sent to the TTS proxy for audio synthesis). No analytics, no cookies, no tracking.
