# 🪺 Noise Nest

**Blend ambient nature sounds to create your perfect calm.**

A sleek, modern ambient sound mixer built with SvelteKit 5 and Howler.js. Mix rain, birds, thunder, waves, wind, and fire into your own relaxation soundscape.

## ✨ Features

- 🎛️ **6 ambient sound channels** — toggle and mix independently
- 🔊 **Per-sound volume control** — fine-tune each layer
- 🔄 **Seamless crossfade looping** — no gaps between loop restarts
- 🌑 **Dark glassmorphism UI** — frosted-glass cards with teal accent glow
- ✨ **Ambient particle animation** — canvas-based floating particles
- 📱 **Fully responsive** — 3 → 2 → 1 column grid across breakpoints
- ♿ **Accessible** — ARIA labels, keyboard navigation, focus indicators

## 🧞 Commands

| Command      | Action                                   |
| :----------- | :--------------------------------------- |
| `bun install` | Install dependencies                    |
| `bun run dev` | Start dev server at `localhost:5173`     |
| `bun run build` | Build production site to `./build/`   |
| `bun run preview` | Preview production build locally    |

## 🏗️ Architecture

```
src/
├── lib/
│   ├── audio.svelte.ts           # Reactive audio engine (crossfade, Howler.js)
│   ├── sounds.ts                 # Sound definitions (6 tiles)
│   ├── components/
│   │   ├── SoundCard.svelte              # Toggle + volume slider tile
│   │   ├── VolumeSlider.svelte           # Custom range input with gradient fill
│   │   └── BackgroundParticles.svelte    # Canvas floating particles
│   └── styles/
│       └── global.css            # Design tokens, reset, slider styling
├── routes/
│   ├── +layout.svelte            # Root layout (global CSS, title)
│   └── +page.svelte              # Main page (grid, header, footer)
└── app.html                      # Shell with Inter font
static/
└── sounds/                       # Audio files (rain.mp3, birds.mp3, etc.)
```

## 🔊 How the Audio Engine Works

The audio engine (`src/lib/audio.svelte.ts`) is the brain of the app. It uses **Svelte 5 runes** for reactivity and **Howler.js** for audio playback.

### Crossfade Looping

Instead of using Howler's built-in `loop: true` (which can cause audible gaps), the engine manages looping manually:

1. A sound starts playing with a **fade-in** (3 seconds)
2. A polling timer checks the playback position every 500ms
3. When the track is **~3 seconds from ending**, it:
   - Starts fading out the current instance
   - Starts a **new overlapping instance** with fade-in
4. The two instances briefly overlap, creating a **seamless transition**
5. The old instance is cleaned up after the fade completes

```
Track 1:  ████████████████████▁▁▁▁  (fading out)
Track 2:              ▁▁▁▁████████████████████▁▁▁▁  (fading in, then plays)
Track 3:                          ▁▁▁▁████████████████████
                      ↑ crossfade overlap
```

### Svelte 5 Runes Used

| Rune | Purpose |
|------|---------|
| `$state()` | Reactive sound states (volume, active, name, icon) |
| `$derived()` | Auto-computes `isAnyPlaying` from sound states |
| `$effect()` | Auto-cleanup of Howl instances on component destroy |
| `$props()` | Component prop declarations (SoundCard, VolumeSlider) |

### Data Flow

```
User clicks tile
  → SoundCard calls ontoggle()
    → engine.toggle(id) flips $state
      → Howler.js starts/stops with crossfade
      → Svelte reactivity updates UI (glow, labels)

User drags slider
  → VolumeSlider calls onchange()
    → engine.setVolume(id, v) updates $state
      → Howler.js adjusts volume in real-time
```

## 🎵 Adding New Sounds

1. Drop a `.mp3` file into `static/sounds/`
2. Add an entry to the `SOUNDS` array in `src/lib/sounds.ts`:

```ts
{ id: 'creek', name: 'Creek', icon: '🏞️', src: '/sounds/creek.mp3' }
```

3. The grid auto-expands — no other changes needed.

## 🛠️ Tech Stack

- **[SvelteKit](https://svelte.dev/docs/kit)** — Full-stack framework
- **[Svelte 5](https://svelte.dev/docs/svelte)** — Runes-based reactivity
- **[Howler.js](https://howlerjs.com/)** — Cross-browser audio
- **Vanilla CSS** — Custom properties design system
- **Canvas API** — Background particle animation
