/**
 * Sound definitions for Noise Nest.
 *
 * Each entry describes a sound tile. The `src` path points to static audio
 * files inside `/static/sounds/`. Sound files will be added later — the UI
 * renders gracefully even when files are missing.
 */

export interface SoundDefinition {
	id: string;
	name: string;
	icon: string;
	src: string;
}

export const SOUNDS: SoundDefinition[] = [
	{ id: 'rain', name: 'Rain', icon: '🌧️', src: '/sounds/rain.mp3' },
	{ id: 'birds', name: 'Birds', icon: '🐦', src: '/sounds/birds.mp3' },
	{ id: 'thunder', name: 'Thunder', icon: '⚡', src: '/sounds/thunder.mp3' },
	{ id: 'waves', name: 'Waves', icon: '🌊', src: '/sounds/waves.mp3' },
	{ id: 'wind', name: 'Wind', icon: '💨', src: '/sounds/wind.mp3' },
	{ id: 'fire', name: 'Fire', icon: '🔥', src: '/sounds/fire.mp3' }
];
