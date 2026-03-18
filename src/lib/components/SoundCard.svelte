<!--
  SoundCard — A sound tile with a circular toggle button and volume slider.
  Shows a teal glow when the sound is active.
-->

<script lang="ts">
	import VolumeSlider from './VolumeSlider.svelte';

	interface Props {
		/** Emoji icon for the sound */
		icon: string;
		/** Display name */
		name: string;
		/** Whether the sound is currently playing */
		active: boolean;
		/** Current volume (0–1) */
		volume: number;
		/** Called when the user clicks the toggle button */
		ontoggle: () => void;
		/** Called when the user adjusts the volume slider */
		onvolumechange: (value: number) => void;
	}

	let { icon, name, active, volume, ontoggle, onvolumechange }: Props = $props();

	function handleVolumeChange(sliderValue: number) {
		onvolumechange(sliderValue / 100);
	}
</script>

<article class="sound-card" class:active>
	<button
		class="toggle-button"
		class:active
		onclick={ontoggle}
		aria-label="{active ? 'Pause' : 'Play'} {name}"
		aria-pressed={active}
	>
		<span class="icon" role="img" aria-hidden="true">{icon}</span>
	</button>

	<span class="sound-name">{name}</span>

	<VolumeSlider
		value={Math.round(volume * 100)}
		onchange={handleVolumeChange}
		label="{name} volume"
	/>
</article>

<style>
	.sound-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-lg) var(--space-md) var(--space-md);
		border-radius: var(--radius-xl);
		background: var(--color-bg-card);
		border: 1px solid var(--color-glass-border);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		transition:
			background var(--transition-base),
			border-color var(--transition-base),
			box-shadow var(--transition-slow);
	}

	.sound-card:hover {
		background: var(--color-bg-card-hover);
		border-color: var(--color-glass-border-hover);
	}

	.sound-card.active {
		background: var(--color-bg-card-active);
		border-color: hsla(170, 60%, 40%, 0.3);
		box-shadow: var(--shadow-glow);
	}

	.toggle-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		border-radius: var(--radius-full);
		border: 2px solid var(--color-glass-border);
		background: hsla(220, 20%, 16%, 0.8);
		cursor: pointer;
		transition:
			background var(--transition-base),
			border-color var(--transition-base),
			box-shadow var(--transition-base),
			transform var(--transition-fast);
	}

	.toggle-button:hover {
		background: hsla(220, 20%, 22%, 0.9);
		border-color: var(--color-glass-border-hover);
		transform: scale(1.05);
	}

	.toggle-button:active {
		transform: scale(0.96);
	}

	.toggle-button.active {
		background: hsla(170, 40%, 18%, 0.7);
		border-color: hsla(170, 60%, 50%, 0.4);
		box-shadow: 0 0 18px var(--color-accent-glow), inset 0 0 12px hsla(170, 60%, 50%, 0.1);
	}

	.toggle-button:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
	}

	.icon {
		font-size: 1.75rem;
		line-height: 1;
		filter: drop-shadow(0 0 2px hsla(0, 0%, 0%, 0.3));
	}

	.sound-name {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		transition: color var(--transition-base);
	}

	.sound-card.active .sound-name {
		color: var(--color-accent);
	}
</style>
