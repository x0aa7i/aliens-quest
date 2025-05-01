<script lang="ts">
	import Danger from "$lib/components/icons/danger.svelte";
	import Target from "$lib/components/icons/target.svelte";
	import Metadata, { defaultMeta } from "$lib/components/metadata.svelte";
	import Sentinel from "$lib/components/sentinel.svelte";
	import Sidebar from "$lib/components/sidebar/sidebar.svelte";
	import Toc from "$lib/components/toc/toc.svelte";
	import { useToc } from "$lib/hooks/use-toc.svelte.js";

	let { data } = $props();

	const { component, metadata } = $derived(data.post);

	const PageContent = $derived(component);
	const tocProps = $derived({ tocState: useToc(metadata.toc), items: metadata.toc });

	const stats = $derived([
		{ name: "risk", value: metadata.risk, Icon: Danger },
		{ name: "probability", value: metadata.probability, Icon: Target },
	]);

	const meta = $derived({
		title: `${metadata.title} - ${defaultMeta.name}`,
		type: "article",
		orImage: {
			url: defaultMeta.url + metadata.cover.src,
			width: metadata.cover.width.toString(),
			height: metadata.cover.height.toString(),
		},
	});
</script>

<Metadata {...meta} />

<Sentinel id="page-top-sentinel" />

<article class="container mx-auto flex min-h-[calc(100vh-220px)] flex-col md:pt-4 lg:px-8">
	<div
		class="grid flex-1 auto-rows-fr grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,1fr)_240px]"
	>
		<aside class="hidden pr-6 pt-5 lg:block">
			<Sidebar items={data.posts} />
		</aside>

		<main class="border-t sm:border-l sm:border-r">
			<!-- mobile -->
			<div class="sticky top-0 border-b bg-gray-900 px-4 sm:px-6 xl:hidden xl:px-8">
				<div class="mx-auto flex h-14 max-w-prose items-center justify-end">
					<Sidebar items={data.posts} type="mobile" />
					<Toc {...tocProps} type="mobile" />
				</div>
			</div>

			<div class="space-y-2 px-4 py-8 sm:px-6 xl:px-8">
				<div class="mx-auto flex max-w-prose flex-wrap items-center gap-3">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html metadata.logo}
					<h1 class="not-prose font-head text-3xl font-semibold">{metadata.title}</h1>
				</div>

				<div class="mx-auto flex max-w-prose flex-wrap gap-x-4 text-gray-400">
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

			<div class="w-full space-y-8 border-t px-4 pb-24 pt-6 sm:px-6 xl:px-8 xl:pt-8">
				<div class="mx-auto h-44 w-full max-w-prose overflow-hidden bg-cover">
					<img
						src={metadata.cover.src}
						width={metadata.cover.width}
						height={metadata.cover.height}
						alt="cover"
						class="h-full w-full object-cover"
					/>
				</div>

				<div class="prose mx-auto max-w-prose text-pretty">
					<PageContent />
				</div>
			</div>
		</main>

		<aside class="hidden pl-8 pt-5 xl:block">
			<Toc {...tocProps} type="desktop" />
		</aside>
	</div>
</article>

<Sentinel id="page-bottom-sentinel" />
