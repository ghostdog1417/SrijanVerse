# 🎵 SrijanVerse

A modern, feature-rich streaming app for exploring original songs and poetry by **Srijan Dwivedi**. Built with React and powered by Web Audio API, SrijanVerse delivers a Spotify-inspired experience with advanced playback controls, mood-based discovery, and offline support.

**Live Demo:** [SrijanVerse on Vercel](https://srijanverse.vercel.app)

---

## 🎯 What's Inside?

- **25+ Original Songs** in English and Hindi/Hindustani
- **Full Player** with equalizer, visualizer, crossfade, and gapless playback
- **Smart Discovery** by mood, artist, album, and listening habits
- **Playlist Management** with custom and auto-generated collections
- **Song Diary** to track personal notes and feelings tied to tracks
- **Poetry Reading** with full-screen immersive mode
- **Offline Access** via PWA and service worker caching
- **Dark/Light Theme** with dynamic color gradients
- **Mobile Responsive** design with touch-friendly controls

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8 |
| **Styling** | Tailwind CSS 3, PostCSS, Autoprefixer |
| **Icons** | Lucide React |
| **Audio** | HTML5 `<audio>` + Web Audio API |
| **Metadata** | jsmediatags (browser bundle) |
| **Storage** | localStorage (client-side persistence) |
| **PWA** | Service Worker, Web App Manifest |
| **Deployment** | Vercel (SPA rewrites + build optimization) |

---

## ✨ Core Features

### 🏠 Home Dashboard
- Quick stats: liked songs count, artist count, current queue
- Recently played tracks
- Smart recommendations based on artist/album and liked songs
- Mood-based auto-generated playlists:
  - **Late Night** — melancholic, introspective
  - **Romance** — love, longing, emotion
  - **Focus** — calm, contemplative
  - **Unwind** — relaxing, peaceful

### 🎶 Songs Library
- Browse all tracks with metadata extracted from MP3 tags
- **Search** by title, artist, or album
- **Filters:** favorites, artist, album, mood
- **Sort Options:** A-Z, Z-A, recently played, most played, artist
- **View Modes:** flat list or group-by-album
- **Quick Actions:** play, like/unlike, add to queue, jump to artist/album

### 👤 Artist Pages
- Grid view of all artists with dynamic styling
- Persistent artist list for quick navigation
- Artist spotlight with metadata
- One-click "Play Artist" to queue full discography
- Per-artist browsing and filtering

### 💿 Album Pages
- Grid view of all albums with visual styling
- Album list panel with quick selection
- Album spotlight (title, artist, track count)
- One-click "Play Album" functionality
- Complete album playback

### ▶️ Advanced Player
- **Full Player Page** with large artwork, song info, and controls
- **Queue System** with reordering, jump-to, and skip controls
- **Playback Settings:**
  - Visualizer (animated frequency analyser)
  - 10-band Equalizer with presets
  - Crossfade between tracks (0-5 seconds)
  - Gapless playback mode
  - Auto-play similar tracks
- **Synced Playback** across all UI states
- **Persistent Playback** state across sessions

### 📖 Poetry Section
- Browse all poems (`.txt` files from `/src/poems/`)
- Full-screen reading mode
- Clean typography for immersive reading

### 📔 Song Diary
- Attach personal notes to any song
- Record mood and date listened
- Filter and search diary entries
- Perfect for tracking emotional connections to music

### 🎨 UI/UX
- **Dark & Light Modes** with theme persistence
- **Dynamic Gradients** generated from artist/album metadata
- **Responsive Layout:** sidebar + content area + sticky player
- **Mobile Navigation** with hamburger toggle and overlay drawer
- **Smooth Transitions** and animations

---

## 🌌 SrijanVerse Design Kit

The repo now includes a dedicated design kit for the cinematic UI direction:
- [Design system summary](design/system.md)
- [Mobile screen specs](design/screens.md)
- [Desktop layout specs](design/desktop.md)
- [Component catalog](design/components.md)
- [Motion guide](design/motion.md)
- [Packaging notes](design/next-steps.md)

Prototype pages are available under `design/prototypes/` for quick visual review:
- Mobile: `design/prototypes/mobile/`
- Desktop: `design/prototypes/desktop/`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SrijanVerse

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Check code quality
npm run lint
```

---

## 📁 Project Structure

```
SrijanVerse/
├── src/
│   ├── components/          # React components
│   │   ├── Player.jsx       # Main player component
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── SongCard.jsx     # Song card UI
│   │   └── PoetryCard.jsx   # Poetry card UI
│   ├── data/
│   │   ├── songs.js         # Song data and metadata
│   │   └── poems.js         # Poem data
│   ├── poems/               # Poem text files (.txt)
│   ├── songs/               # MP3 audio files
│   ├── App.jsx              # Root component
│   ├── App.css              # App styles
│   ├── main.jsx             # React DOM render
│   ├── index.css            # Global styles
│   └── assets/
│       └── manifest.webmanifest
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind setup
├── postcss.config.js        # PostCSS config
├── eslint.config.js         # ESLint rules
├── vercel.json              # Vercel deployment config
├── package.json
└── README.md
```

---

## 🎵 Adding Songs and Poems

### Songs

1. Place MP3 files in `src/songs/`
2. Update `src/data/songs.js` with metadata:

   ```javascript
   {
     id: unique_id,
     title: "Song Title",
     artist: "Artist Name",
     album: "Album Name",
     mood: "late-night",
     file: "Songs/filename.mp3"
   }
   ```

### Poems
1. Create `.txt` files in `src/poems/`
2. Update `src/data/poems.js` with entries:
   ```javascript
   {
     id: unique_id,
     title: "Poem Title",
     filename: "Poem Title.txt"
   }
   ```

---

## 💾 Data Persistence

All user data is stored in browser localStorage:
- **Liked songs** and favorites
- **Playlists** (custom collections)
- **Recently played** history
- **Theme preference** (dark/light)
- **Equalizer presets**
- **Song diary** entries (notes + moods)
- **Play statistics** and listening habits
- **Player settings** (visualizer, crossfade, gapless)

Data persists across sessions and works offline.

---

## 🌐 PWA & Offline Support

SrijanVerse is a Progressive Web App:
- **Install** on home screen (mobile & desktop)
- **Offline Access** via service worker caching
- **App Manifest** with icons and metadata
- **Standalone Mode** works like native app

---

## 🚀 Deployment

Deployed on **Vercel** with optimizations:
- SPA rewrites for client-side routing
- Explicit build command: `npm run build`
- Output directory: `dist`
- Automatic CI/CD from git

⚠️ **Note:** Browser bundle must be used for `jsmediatags`:
```javascript
import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js'
```

---

## 📄 License

Personal project by Srijan Dwivedi. All original music and poetry © Srijan Dwivedi.

---

## 🤝 Contributing

This is a personal creative project. For feedback or ideas, feel free to open an issue.

---

**Made with ❤️ by Srijan Dwivedi**

### Queue management

- Dedicated Queue tab with current track context.
- Queue list with position indicators.
- Queue item controls:
  - Play selected queue position
  - Move up
  - Move down
  - Remove
- "Clear Queue" action that keeps only current song.
- Queue preview in player page.

### Library and playlists

- Create custom playlists.
- Rename playlists.
- Delete playlists.
- Select a playlist to browse tracks.
- Remove specific tracks from a playlist.
- Quick add currently playing track to any playlist.
- Liked songs collection view.

### Smart playlists and listening intelligence

- Most Played This Week (from event history).
- Recently Liked (ordered by like timestamp).
- Never Played.
- Listening stats cards:
  - Recent plays
  - Top artist (from recent history)
  - Albums explored
  - Favorites rate

### Song diary

- Attach personal notes to each song.
- Mood tagging per note:
  - Memory
  - Healing
  - Heartbreak
  - Motivation
  - Peace
- Notes saved with timestamp and listed in reverse-chronological order.
- One-click playback from saved notes.

### Poetry experience

- Poetry catalog from local text files.
- Poetry cards with title, author, and excerpt.
- Full-screen poem reader modal.
- Date display and formatted poem body.

### Sharing and deep linking

- "Share Song Link" button generates URL with `?song=<id>`.
- Opening the app with `?song=<id>` auto-loads and plays that song.

## Navigation Tabs

Sidebar tabs currently available:

- Home
- Your Songs
- Artists
- Albums
- Queue
- Player
- Library
- Diary
- Poetry

## Player and Audio Features

### Playback controls

- Play/Pause
- Previous/Next
- Shuffle toggle
- Repeat cycle: off -> all -> one
- Seek bar with elapsed and total time
- Volume control
- Mute toggle

### Advanced playback

- Crossfade toggle with adjustable duration (0.5 to 8.0 seconds).
- Gapless preload mode (`preload="auto"` when enabled).
- Auto-play similar tracks when queue is finished.
- Sleep timer options: 10, 20, 30, 45, 60 minutes.

### Audio enhancements

- Web Audio based 3-band equalizer presets:
  - Flat
  - Bass Boost
  - Vocal Boost
  - Treble Boost
  - Night Mode
- Real-time visualizer using analyser node with animated bars.

### Lyrics

- LRC file parsing with timestamp support.
- Live lyric line highlighting by current playback time.
- Click lyric line to jump playback position.
- Graceful fallback when lyrics are missing or fetch fails.

### Reliability and error handling

- Playback loading states and buffering indicators.
- User-friendly fallback if media file fails.
- Detailed media error parsing (`MEDIA_ERR_*`).
- Safe handling for autoplay block and source-switch aborts.

## Data Persistence

The app stores user state in browser localStorage.

Persisted items include:

- Liked songs
- Playlists
- Recently played songs
- Theme
- Equalizer preset
- Auto similar playback setting
- Song diary entries
- Play statistics and play events
- Liked timestamps
- Visualizer enabled setting
- Crossfade enabled setting
- Crossfade seconds value
- Gapless enabled setting

All persistence failures (private mode/quota) are handled gracefully to keep the app usable.

## PWA and Offline Behavior

### PWA support

- `src/assets/manifest.webmanifest` defines app identity and standalone mode.
- `beforeinstallprompt` is captured to show custom install action.
- Install state detected through `display-mode: standalone` and `appinstalled` event.

### Service worker

- Service worker support is currently disabled in this source-only setup.
- App shell cache behavior is not active until a new root-scoped service worker is added.
- Navigation requests still fall back to `index.html` through Vite's SPA behavior and deployment rewrites.

## Song and Poem Content Format

### Songs

Songs are loaded automatically from `src/songs/*.mp3` and parsed at runtime.

Song metadata fields (from MP3 tags):

- `Title`
- `Artist`
- `Album` (optional)
- `Date` (from tag date/year when available)
- Embedded cover art (if present in ID3/APIC)

Runtime-generated song fields:

- `id` from MP3 filename
- `file` URL from the source MP3 file
- `lyricsText` loaded automatically from `src/lyrics/*.lrc` when a matching file exists

Songs are sorted newest-first by parsed `Date`.

Tag expectations:

- Place MP3s in `src/songs`.
- Add matching `.lrc` files in `src/lyrics` when lyrics are available.
- Embed album art in each MP3 if you want thumbnails shown in the UI.

### Poems

Poems are loaded automatically from `src/poems/*.txt` using `import.meta.glob`.

Poem metadata fields:

- `Title`
- `Author`
- `Date`
- `Excerpt` (optional; first poem line used if missing)

Keep a blank line between metadata and poem body.

Example:

```txt
Title: Moonlight Dreams
Author: Srijan Dwivedi
Date: 2026-03-19
Excerpt: Under the silver glow of the moon, memories dance...

Under the silver glow of the moon, memories dance,
Like fireflies caught in a glass of moments.
```

Note: `src/poems/_template.txt.example` exists for poem formatting.

## Installation and Local Development

Prerequisites:

- Node.js 18+ recommended
- npm

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Build, Preview, and Lint

Create production build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## Deployment

This repository is configured for static deployment (including Vercel SPA rewrites).

- `vercel.json` rewrites all routes to `index.html`.
- This ensures deep links like `/?song=...` and in-app routes keep working.
