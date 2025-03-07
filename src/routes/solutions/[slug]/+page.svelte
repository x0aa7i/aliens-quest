<script lang="ts">
	import Danger from "$lib/components/icons/danger.svelte";
	import Target from "$lib/components/icons/target.svelte";
	import * as Tabs from "$lib/components/ui/tabs";

	let { data } = $props();
	const post = data.post;

	const stats = [
		{ name: "probability", value: post.probability, Icon: Target },
		{ name: "mortality", value: post.mortality, Icon: Danger },
	];
</script>

<svelte:head>
	<title>{post.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={post.title} />
</svelte:head>

<article class="container mx-auto mt-10 px-8 py-4">
	<div class="container mx-auto grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
		<div class="space-y-5">
			<div class="space-y-2">
				<div class="flex items-center gap-3">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html post.logo}
					<h1 class="not-prose font-head text-3xl font-semibold">{post.title}</h1>
				</div>

				<div class="flex gap-5 text-gray-400">
					{#each stats as { name, value, Icon } (name)}
						{#if value}
							<div class="inline-flex items-center justify-center gap-2">
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

		<img
			src={post.cover.src}
			alt=""
			class="mt-12 hidden aspect-square w-96 object-cover lg:block xl:w-[460px]"
		/>
	</div>
</article>

{#snippet tabs(data: { title: string; content: string }[])}
	<Tabs.Root value={data[0].title} class="max-w-full">
		<div
			class="no-scrollbar overflow-x-auto scroll-smooth whitespace-nowrap border-b border-b-gray-700"
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
			<Tabs.Content value={tab.title} class="prose mt-5">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html tab.content}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
{/snippet}
