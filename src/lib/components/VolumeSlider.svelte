<!--
  VolumeSlider — Custom-styled range input with dynamic track fill.
  Uses a linear-gradient trick to show the filled/unfilled portions.
-->

<script lang="ts">
	interface Props {
		/** Current value (0–100) */
		value: number;
		/** Callback when the slider value changes */
		onchange: (value: number) => void;
		/** Accessible label for the slider */
		label?: string;
	}

	let { value, onchange, label = 'Volume' }: Props = $props();

	/** Percentage for the track fill gradient */
	let fillPercent = $derived(Math.round(value));

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onchange(Number(target.value));
	}
</script>

<div class="volume-slider">
	<label class="visually-hidden">{label}</label>
	<input
		type="range"
		min="0"
		max="100"
		{value}
		oninput={handleInput}
		aria-label={label}
		style="background: linear-gradient(to right, var(--color-accent) {fillPercent}%, var(--color-slider-track) {fillPercent}%)"
	/>
</div>

<style>
	.volume-slider {
		width: 100%;
		padding: 0 var(--space-xs);
	}

	input[type='range'] {
		width: 100%;
		height: 6px;
		border-radius: 3px;
	}
</style>
