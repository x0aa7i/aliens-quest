<script lang="ts">
	let { data } = $props();
	const Content = data.content;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article class="prose-neutral prose prose-invert">
	<hgroup>
		<h1>{data.meta.title}</h1>
	</hgroup>

	<Content />
</article>
