/**
 * Reactive audio engine for Noise Nest.
 *
 * Uses Svelte 5 runes ($state, $effect) to manage Howler.js instances
 * reactively. Each sound has its own Howl instance, volume, and active state.
 *
 * Crossfade: Uses two alternating Howl instances per sound. When one nears
 * its end, the other fades in while the first fades out — creating a seamless
 * overlap with no gaps.
 *
 * Usage:
 *   const engine = createAudioEngine(SOUNDS);
 *   engine.toggle('rain');
 *   engine.setVolume('rain', 0.6);
 */

import { Howl } from "howler";
import type { SoundDefinition } from "./sounds";

/** Duration of crossfade overlap in milliseconds */
const CROSSFADE_MS = 2500;

/** How often to check playback position for crossfade triggers (ms) */
const POLL_INTERVAL_MS = 500;

export interface SoundState {
    id: string;
    name: string;
    icon: string;
    volume: number;
    active: boolean;
}

/** Two Howl instances that alternate for seamless crossfade looping. */
interface DualHowl {
    a: Howl;
    b: Howl;
    /** Which instance is currently playing: 'a' or 'b' */
    current: "a" | "b";
}

/**
 * Creates a reactive audio engine that manages multiple looping sounds.
 * Must be called during component initialization (so $effect teardowns work).
 */
export function createAudioEngine(definitions: SoundDefinition[]) {
    /* --- Reactive state for each sound --- */
    const sounds: SoundState[] = $state(
        definitions.map((def) => ({
            id: def.id,
            name: def.name,
            icon: def.icon,
            volume: 0.5,
            active: false,
        })),
    );

    /* --- Internal (non-reactive) maps --- */
    const dualHowls = new Map<string, DualHowl>();
    const pollTimers = new Map<string, ReturnType<typeof setInterval>>();

    /** Create a single Howl instance for a given source. */
    function createHowl(src: string): Howl {
        return new Howl({
            src: [src],
            loop: false,
            volume: 0,
            html5: true,
        });
    }

    /** Get or create the dual-Howl pair for a sound. */
    function getDualHowl(id: string): DualHowl | null {
        if (dualHowls.has(id)) return dualHowls.get(id)!;

        const def = definitions.find((d) => d.id === id);
        if (!def) return null;

        const pair: DualHowl = {
            a: createHowl(def.src),
            b: createHowl(def.src),
            current: "a",
        };

        dualHowls.set(id, pair);
        return pair;
    }

    /** Start the crossfade polling loop for a sound. */
    function startCrossfadePoll(id: string) {
        clearPollTimer(id);

        const timer = setInterval(() => {
            const sound = sounds.find((s) => s.id === id);
            const pair = dualHowls.get(id);
            if (!sound?.active || !pair) {
                clearPollTimer(id);
                return;
            }

            const playing = pair[pair.current];
            const seek = playing.seek() as number;
            const duration = playing.duration();

            if (duration <= 0 || typeof seek !== "number") return;

            const remainingMs = (duration - seek) * 1000;

            if (remainingMs <= CROSSFADE_MS + POLL_INTERVAL_MS) {
                // Time to crossfade — switch to the other instance
                const nextKey = pair.current === "a" ? "b" : "a";
                const next = pair[nextKey];

                // Fade out current
                playing.fade(sound.volume, 0, CROSSFADE_MS);

                // Start next with fade in
                next.volume(0);
                next.play();
                next.fade(0, sound.volume, CROSSFADE_MS);

                pair.current = nextKey;
            }
        }, POLL_INTERVAL_MS);

        pollTimers.set(id, timer);
    }

    /** Clear the crossfade polling timer. */
    function clearPollTimer(id: string) {
        const timer = pollTimers.get(id);
        if (timer) {
            clearInterval(timer);
            pollTimers.delete(id);
        }
    }

    /** Toggle a sound on or off. */
    function toggle(id: string) {
        const sound = sounds.find((s) => s.id === id);
        if (!sound) return;

        sound.active = !sound.active;

        const pair = getDualHowl(id);
        if (!pair) return;

        if (sound.active) {
            // Start playing the current instance with fade-in
            const playing = pair[pair.current];
            playing.volume(0);
            playing.play();
            playing.fade(0, sound.volume, 800);

            // Begin crossfade polling
            startCrossfadePoll(id);
        } else {
            // Stop both instances with fade-out
            clearPollTimer(id);
            pair.a.fade(pair.a.volume() as number, 0, 800);
            pair.b.fade(pair.b.volume() as number, 0, 800);

            setTimeout(() => {
                pair.a.stop();
                pair.b.stop();
            }, 850);
        }
    }

    /** Set volume for a specific sound (0–1). */
    function setVolume(id: string, value: number) {
        const sound = sounds.find((s) => s.id === id);
        if (!sound) return;

        sound.volume = Math.max(0, Math.min(1, value));

        const pair = dualHowls.get(id);
        if (pair) {
            // Only adjust the currently-playing instance
            pair[pair.current].volume(sound.volume);
        }
    }

    /** Check if any sound is currently playing. */
    const isAnyPlaying = $derived(sounds.some((s) => s.active));

    /** Stop all sounds and clean up. */
    function destroyAll() {
        for (const id of dualHowls.keys()) {
            clearPollTimer(id);
        }
        for (const pair of dualHowls.values()) {
            pair.a.unload();
            pair.b.unload();
        }
        dualHowls.clear();
    }

    /* Auto-cleanup when the owning component is destroyed */
    $effect(() => {
        return () => {
            destroyAll();
        };
    });

    return {
        get sounds() {
            return sounds;
        },
        get isAnyPlaying() {
            return isAnyPlaying;
        },
        toggle,
        setVolume,
        destroyAll,
    };
}
