<!--
  Root layout — applies global styles and wraps all pages.
-->

<script lang="ts">
	import '$lib/styles/global.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Noise Nest — Ambient Sound Mixer</title>
</svelte:head>

{@render children()}
