<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs";
	import Header from "$lib/sections/header.svelte";

	let { data } = $props();
	const post = data.post;
</script>

<svelte:head>
	<title>{post.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={post.title} />
</svelte:head>

<Header />

<section class="container mx-auto mt-10 px-8 py-4">
	<article class="mx-auto max-w-prose">
		<div class="flex items-center gap-4">
			<!-- {@html data.meta.logo} -->
			<h1 class="text-3xl font-semibold">{post.title}</h1>
		</div>

		{@render tabs(post.content)}
	</article>
</section>

{#snippet tabs(data: { title: string; content: string }[])}
	<Tabs.Root value={data[0].title} class="max-w-full">
		<div class="no-scrollbar overflow-x-auto scroll-smooth whitespace-nowrap">
			<Tabs.List>
				{#each data as tab (tab.title)}
					<Tabs.Trigger value={tab.title}>
						{tab.title}
					</Tabs.Trigger>
				{/each}
			</Tabs.List>
		</div>

		{#each data as tab (tab.title)}
			<Tabs.Content value={tab.title} class="prose mt-5">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html tab.content}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
{/snippet}
