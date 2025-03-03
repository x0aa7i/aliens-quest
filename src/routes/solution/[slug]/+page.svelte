<script lang="ts">
	import Header from "$lib/sections/header.svelte";

	let { data } = $props();
	const Content = data.content;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<Header />

<section class="container mx-auto mt-10 px-8 py-4">
	<article class="prose mx-auto max-w-prose">
		<h1>{data.meta.title}</h1>

		{#if data.meta.cover}
			<div class="h-52 w-full">
				<img src={data.meta.cover} alt={data.meta.title} class="h-full w-full object-cover" />
			</div>
		{/if}

		<Content />
	</article>
</section>
