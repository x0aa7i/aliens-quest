<script lang="ts">
	import Metadata from "$lib/components/metadata.svelte";
	import Hero from "$lib/sections/hero.svelte";

	let { data } = $props();
</script>

<Metadata title="Aliens Quest — Explore the Fermi Paradox Solutions" />

<Hero cards={data.posts} />
