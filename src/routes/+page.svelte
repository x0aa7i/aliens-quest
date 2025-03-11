<script lang="ts">
	import Explore from "$lib/sections/explore.svelte";
	import Header from "$lib/sections/header.svelte";
	import Hero from "$lib/sections/hero.svelte";

	let { data } = $props();
	const description =
		"Why haven’t we met aliens? Aliens Quest explores the Fermi Paradox and its possible solutions that could explain our cosmic loneliness. Join the search for answers.";
</script>

<svelte:head>
	<title>Aliens Quest - Exploring the Fermi Paradox Solutions</title>
	<meta property="og:title" content="Aliens Quest – Exploring the Fermi Paradox" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Aliens Quest" />
	<meta name="description" content={description} />
</svelte:head>

<Header class="xl:max-w-7xl" />
<Hero />
<Explore posts={data.posts} />
