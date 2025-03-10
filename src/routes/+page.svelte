<script lang="ts">
	import Explore from "$lib/sections/explore.svelte";
	import Header from "$lib/sections/header.svelte";
	import Hero from "$lib/sections/hero.svelte";

	let { data } = $props();
</script>

<svelte:head>
	<title>Aliens Quest</title>
</svelte:head>

<Header class="xl:max-w-7xl" />
<Hero />
<Explore posts={data.posts} />
