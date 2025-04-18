<script lang="ts">
	import Metadata from "$lib/components/metadata.svelte";
	import Explore from "$lib/sections/explore.svelte";
	import Hero from "$lib/sections/hero.svelte";

	let { data } = $props();
</script>

<Metadata title="Aliens Quest – Explore the Fermi Paradox Solutions" />

<Hero />
<Explore posts={data.posts} />
