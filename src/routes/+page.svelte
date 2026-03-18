<!--
  Home page — The main ambient sound mixer interface.
  Displays a grid of SoundCards powered by the reactive audio engine.
-->

<script lang="ts">
	import SoundCard from '$lib/components/SoundCard.svelte';
	import BackgroundParticles from '$lib/components/BackgroundParticles.svelte';
	import { createAudioEngine } from '$lib/audio.svelte';
	import { SOUNDS } from '$lib/sounds';

	const engine = createAudioEngine(SOUNDS);
</script>

<BackgroundParticles />

<div class="app-wrapper">
	<!-- Header -->
	<header class="header">
		<div class="logo">
			<span class="logo-icon" role="img" aria-hidden="true">🪺</span>
			<h1 class="logo-text">Noise Nest</h1>
		</div>
		<p class="tagline">Blend ambient sounds to create your perfect calm</p>
	</header>

	<!-- Sound Grid -->
	<main class="sound-grid">
		{#each engine.sounds as sound (sound.id)}
			<SoundCard
				icon={sound.icon}
				name={sound.name}
				active={sound.active}
				volume={sound.volume}
				ontoggle={() => engine.toggle(sound.id)}
				onvolumechange={(v) => engine.setVolume(sound.id, v)}
			/>
		{/each}
	</main>

	<!-- Footer -->
	<footer class="footer">
		<p>Click a sound to play · Adjust volume with the slider</p>
	</footer>
</div>

<style>
	.app-wrapper {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xl);
		min-height: 100dvh;
		padding: var(--space-2xl) var(--space-md);
	}

	/* --- Header --- */
	.header {
		text-align: center;
	}

	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-xs);
	}

	.logo-icon {
		font-size: 2rem;
		line-height: 1;
	}

	.logo-text {
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		background: linear-gradient(135deg, var(--color-text-primary), var(--color-accent));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.tagline {
		font-size: 0.9rem;
		font-weight: 300;
		color: var(--color-text-secondary);
	}

	/* --- Sound Grid --- */
	.sound-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-md);
		width: 100%;
		max-width: 540px;
	}

	/* Tablet */
	@media (max-width: 640px) {
		.sound-grid {
			grid-template-columns: repeat(2, 1fr);
			max-width: 360px;
		}
	}

	/* Mobile */
	@media (max-width: 380px) {
		.sound-grid {
			grid-template-columns: 1fr;
			max-width: 200px;
		}
	}

	/* --- Footer --- */
	.footer {
		margin-top: auto;
		padding-top: var(--space-xl);
		text-align: center;
	}

	.footer p {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}
</style>
