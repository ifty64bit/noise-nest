<!--
  BackgroundParticles — Subtle floating particles rendered on a canvas.
  Creates a calm, atmospheric backdrop behind the sound grid.
-->

<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	interface Particle {
		x: number;
		y: number;
		radius: number;
		opacity: number;
		speedX: number;
		speedY: number;
		/** Direction the opacity is changing: 1 = brighter, -1 = dimmer */
		fadeDir: number;
	}

	const PARTICLE_COUNT = 60;
	const MAX_RADIUS = 2.5;
	const MIN_RADIUS = 0.5;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationId: number;
		let particles: Particle[] = [];

		function resize() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		function createParticle(): Particle {
			return {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS),
				opacity: Math.random() * 0.4 + 0.05,
				speedX: (Math.random() - 0.5) * 0.3,
				speedY: -Math.random() * 0.25 - 0.05,
				fadeDir: Math.random() > 0.5 ? 1 : -1
			};
		}

		function init() {
			resize();
			particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
		}

		function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (const p of particles) {
				/* Move */
				p.x += p.speedX;
				p.y += p.speedY;

				/* Gentle opacity pulse */
				p.opacity += p.fadeDir * 0.002;
				if (p.opacity >= 0.45) p.fadeDir = -1;
				if (p.opacity <= 0.05) p.fadeDir = 1;

				/* Wrap around edges */
				if (p.y < -10) p.y = canvas.height + 10;
				if (p.x < -10) p.x = canvas.width + 10;
				if (p.x > canvas.width + 10) p.x = -10;

				/* Draw */
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx.fillStyle = `hsla(170, 50%, 70%, ${p.opacity})`;
				ctx.fill();
			}

			animationId = requestAnimationFrame(draw);
		}

		init();
		draw();
		window.addEventListener('resize', resize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas bind:this={canvas} class="particles" aria-hidden="true"></canvas>

<style>
	.particles {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}
</style>
