<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Aliens Quest: About</title>
</svelte:head>

<section class="container mx-auto px-4 py-16 md:py-24 lg:py-28">
	<div class="prose mx-auto max-w-prose">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html data.about.content}
	</div>
</section>
