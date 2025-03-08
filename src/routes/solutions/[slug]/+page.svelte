<script lang="ts">
	import { page } from "$app/state";

	import Danger from "$lib/components/icons/danger.svelte";
	import Target from "$lib/components/icons/target.svelte";
	import * as Tabs from "$lib/components/ui/tabs";

	let { data } = $props();
	const post = $derived(data.post);

	const stats = $derived([
		{ name: "probability", value: data.post.probability, Icon: Target },
		{ name: "risk", value: data.post.risk, Icon: Danger },
	]);
</script>

<svelte:head>
	<title>{post.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={post.title} />
</svelte:head>

<article class="container mx-auto mt-10 flex min-h-[calc(100vh-220px)] flex-col xl:px-8">
	<div
		class="grid flex-1 auto-rows-fr grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[200px_minmax(0,1fr)_auto]"
	>
		<div class="hidden border-r xl:block">
			<span class="font-semibold text-gray-200">Solutions</span>

			<ul class="mt-2 text-gray-400">
				{#each data.posts as post (post.slug)}
					<li
						class={[
							"text-sm transition-colors hover:text-gray-50",
							page.url.pathname === post.permalink && "text-gray-50",
						]}
					>
						<a href={post.permalink} class="block py-1.5"> {post.title} </a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="space-y-5">
			<div class="space-y-2 px-4 xl:px-8">
				<div class="flex flex-wrap items-center gap-3">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html post.logo}
					<h1 class="not-prose font-head text-3xl font-semibold">{post.title}</h1>
				</div>

				<div class="flex flex-wrap gap-x-4 text-gray-400">
					{#each stats as { name, value, Icon } (name)}
						{#if value}
							<div class="inline-flex items-center justify-center gap-1">
								<Icon width="16" height="16" class="shrink-0" aria-hidden="true" />
								<span class="text-sm"> {value} {name} </span>
							</div>
						{/if}
					{/each}
				</div>
			</div>

			<img src={post.cover.src} alt="" class="max-h-44 w-full object-cover lg:hidden" />
			{@render tabs(post.content)}
		</div>

		<img src={post.cover.src} alt="" class="ml-8 hidden aspect-square w-96 object-cover lg:block" />
	</div>
</article>

{#snippet tabs(data: { title: string; content: string }[])}
	<Tabs.Root value={data[0].title} class="max-w-full">
		<div
			class="no-scrollbar overflow-x-auto scroll-smooth whitespace-nowrap border-b border-b-gray-700 xl:px-5"
		>
			<Tabs.List>
				{#each data as tab (tab.title)}
					<Tabs.Trigger value={tab.title}>
						{tab.title}
					</Tabs.Trigger>
				{/each}
			</Tabs.List>
		</div>

		{#each data as tab (tab.title)}
			<Tabs.Content value={tab.title} class="prose px-4 pb-8 pt-4 xl:px-8">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html tab.content}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
{/snippet}
