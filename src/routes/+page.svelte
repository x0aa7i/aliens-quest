<script lang="ts">
	import Explore from "$lib/sections/explore.svelte";
	import Header from "$lib/sections/header.svelte";
	import Hero from "$lib/sections/hero.svelte";

	let { data } = $props();
</script>

<Header />
<Hero />
<Explore posts={data.posts} />
