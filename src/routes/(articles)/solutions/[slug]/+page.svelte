<script lang="ts">
	import ArticleNav from "$lib/components/article-nav.svelte";
	import EditLink from "$lib/components/edit-link.svelte";
	import Danger from "$lib/components/icons/danger.svelte";
	import Target from "$lib/components/icons/target.svelte";
	import Metadata, { defaultMeta } from "$lib/components/metadata.svelte";
	import Sidebar from "$lib/components/sidebar/sidebar.svelte";
	import Toc from "$lib/components/toc/toc.svelte";
	import { useToc } from "$lib/hooks/use-toc.svelte.js";

	let { data } = $props();

	const metadata = $derived(data.post.metadata);
	const ContentComponent = $derived(data.post.component);

	let articleRef: HTMLElement | null = $state(null);
	const tocProps = $derived({ tocState: useToc(metadata.toc, articleRef), items: metadata.toc });

	const stats = $derived([
		{ name: "risk", value: metadata.risk, Icon: Danger },
		{ name: "scenario", value: metadata.probability, Icon: Target },
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

<main class="container mx-auto min-h-[calc(100vh-220px)] md:pt-4 lg:px-8" bind:this={articleRef}>
	<div
		class="grid auto-rows-fr grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,1fr)_240px]"
	>
		<!-- Desktop Sidebar -->
		<aside class="hidden pr-6 pt-5 lg:block">
			<Sidebar items={data.posts} />
		</aside>

		<article class="border-t sm:border-l sm:border-r">
			<!-- Mobile Header with Navigation -->
			<div class="sticky top-0 border-b bg-gray-900 px-4 sm:px-6 xl:hidden xl:px-8">
				<div class="mx-auto flex h-14 max-w-prose items-center justify-end">
					<Sidebar items={data.posts} type="mobile" />
					<Toc {...tocProps} type="mobile" />
				</div>
			</div>

			<!-- Article Header -->
			<header class="space-y-2 px-4 py-8 sm:px-6 xl:px-8">
				<div class="text-primary mx-auto flex max-w-prose flex-wrap items-center gap-3">
					{#if metadata.logo}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html metadata.logo}
					{/if}
					<h1 itemprop="headline" class="font-head text-3xl font-semibold">
						{metadata.title}
					</h1>
				</div>

				<div class="text-quaternary mx-auto flex max-w-prose flex-wrap gap-x-4">
					{#each stats as { name, value, Icon } (name)}
						{#if value}
							<div class="inline-flex items-center justify-center gap-1">
								<Icon width="16" height="16" class="shrink-0" aria-hidden="true" />
								<span class="text-tertiary text-sm capitalize"> {value} {name} </span>
							</div>
						{/if}
					{/each}
				</div>
			</header>

			<!-- Article Body -->
			<div class="w-full space-y-8 border-t px-4 pb-12 pt-6 sm:px-6 xl:px-8 xl:pt-8">
				{#if metadata.cover && metadata.cover.src}
					<figure class="mx-auto h-44 w-full max-w-prose overflow-hidden bg-cover">
						<img
							src={metadata.cover.src}
							width={metadata.cover.width}
							height={metadata.cover.height}
							alt="Cover for {metadata.title}"
							class="h-full w-full object-cover"
							loading="lazy"
						/>
					</figure>
				{/if}

				<div class="prose mx-auto max-w-prose text-pretty">
					<ContentComponent media={metadata.media} />
				</div>

				<!-- Article Footer: Edit Link and Navigation  -->
				<footer class="@container mx-auto mt-10 max-w-prose space-y-5">
					<EditLink slug={metadata.slug} />
					<ArticleNav posts={data.posts} current={metadata.slug} />
				</footer>
			</div>
		</article>

		<!-- Desktop Table of Contents -->
		<aside class="hidden pl-8 pt-5 xl:block">
			<Toc {...tocProps} type="desktop" />
		</aside>
	</div>
</main>
