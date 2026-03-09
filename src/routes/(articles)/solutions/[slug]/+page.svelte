<script lang="ts">
	import CaretDownIcon from "~icons/bx/caret-down";
	import CaretUpIcon from "~icons/bx/caret-up";
	import ExpandIcon from "~icons/bx/expand-vertical";
	import LikeIcon from "~icons/bx/like";
	import MedalIcon from "~icons/bx/up-arrow-circle";

	import EditLink from "$lib/components/edit-link.svelte";
	import Metadata, { defaultMeta } from "$lib/components/metadata.svelte";
	import { useToc } from "$lib/hooks/use-toc.svelte.js";

	let { data } = $props();

	const metadata = $derived(data.post);

	const titleMeta = $derived([
		{ icon: ExpandIcon, label: "Rank", value: "2 Rank" },
		{ icon: MedalIcon, label: "Votes", value: "1.2k votes" },
		{ icon: LikeIcon, label: "Positive", value: "68% Positive" },
	]);

	let articleRef: HTMLElement | null = $state(null);
	const tocProps = $derived({ tocState: useToc(metadata.toc, articleRef), items: metadata.toc });

	// Similar solutions: all posts except the current one (capped at 3)
	const similarPosts = $derived(
		data.posts.filter((p: { slug: string }) => p.slug !== metadata.slug).slice(0, 3)
	);

	const seo = $derived({
		title: `${metadata.title} - ${defaultMeta.name}`,
		type: "article",
		orImage: {
			url: defaultMeta.url + metadata.cover.src,
			width: metadata.cover.width.toString(),
			height: metadata.cover.height.toString(),
		},
	});
</script>

<Metadata {...seo} />

<main class="relative min-h-screen overflow-x-hidden" bind:this={articleRef}>
	<header class="relative border-b border-zinc-800 pt-24">
		<!-- Cover image as background -->
		{#if metadata.cover?.src}
			<div class="pointer-events-none absolute inset-0" aria-hidden="true">
				<img
					src={metadata.cover.src}
					width={metadata.cover.width}
					height={metadata.cover.height}
					alt=""
					class="h-full w-full object-cover opacity-30"
					loading="eager"
				/>
				<!-- style="mask-image: radial-gradient(ellipse 86% 165% at 9% 29%, transparent 0%, black 50%, black 100%), linear-gradient(to bottom, transparent 65%, black 100%); mask-composite: intersect;" -->
			</div>
		{/if}

		<!-- Hero content -->
		<div class="relative z-10 px-4 py-10 sm:px-6 lg:px-20">
			<!-- Vote widget (inline on mobile, absolute on desktop) -->
			<div class="relative mx-auto max-w-7xl">
				<!-- Title row -->
				<div class="flex flex-col items-start gap-4 md:flex-row md:items-center lg:gap-6">
					<!-- Upvote / Downvote widget -->
					<div
						class="order-1 flex shrink-0 gap-1 md:order-0 md:flex-col"
						aria-label="Vote on this solution"
					>
						<button
							class="flex h-9 w-10 items-center justify-center border text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
							aria-label="Upvote"
						>
							<CaretUpIcon class="size-5" />
						</button>
						<button
							class="flex h-9 w-10 items-center justify-center border text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
							aria-label="Downvote"
						>
							<CaretDownIcon class="size-5" />
						</button>
					</div>

					<!-- Logo + Title -->
					<div class="flex min-w-0 flex-col gap-2">
						<div class="flex flex-wrap items-center gap-3">
							{#if metadata.logo}
								<span class="text-primary **:stroke-3 [&_svg]:h-8 [&_svg]:w-16" aria-hidden="true">
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html metadata.logo}
								</span>
							{/if}

							<h1
								itemprop="headline"
								class="font-head text-3xl leading-none font-medium tracking-tight text-primary md:text-4xl lg:text-5xl"
							>
								{metadata.title}
							</h1>
						</div>

						<!-- Stats row: rank · votes · sentiment -->
						<div class="flex flex-wrap items-center gap-4 opacity-80">
							{#each titleMeta as { icon: Icon, label, value }}
								<span
									class="flex items-center gap-1.5 font-head text-sm font-medium tracking-wide text-secondary"
								>
									<Icon class="size-4" aria-hidden="true" />
									<span class="sr-only">{label}</span>
									<span>{value}</span>
								</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- ═══════════════════════════════════════════════
	     3-COLUMN BODY LAYOUT
	     left: section nav | center: article | right: sidebar
	     ═══════════════════════════════════════════════ -->
	<div
		class="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[200px_1fr] xl:grid-cols-[200px_1fr_305px]"
	>
		<!-- ── LEFT: Section nav + all-solutions sidebar ── -->
		<aside class="hidden border-r border-zinc-800 lg:block">
			<div class="sticky top-8 space-y-6 overflow-y-auto px-0 py-5">
				<!-- Section tabs (TOC-driven) -->
				{#if metadata.toc?.length}
					<nav aria-label="Article sections">
						<ul class="flex flex-col">
							{#each metadata.toc as entry (entry.url)}
								{@const isActive = tocProps.tocState.isActive(entry)}
								<li>
									<a
										href={entry.url}
										class={[
											"block w-full border-b border-zinc-800 px-6 py-5 font-sans text-base transition-all duration-200",
											isActive
												? "bg-linear-to-r from-zinc-900/50 to-transparent text-white"
												: "text-white/40 hover:text-white/70",
										]}
									>
										{entry.title}
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				{/if}
			</div>
		</aside>

		<!-- ── CENTER: Main article content ── -->
		<article class="min-w-0 border-r border-zinc-800">
			<!-- Prose body -->
			<div class="w-full space-y-8 px-4 pt-6 pb-16 sm:px-6 xl:px-8 xl:pt-8">
				<div class="prose prose-invert mx-auto max-w-prose text-pretty">
					<!-- <ContentComponent media={metadata.media} /> -->

					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html data.post.content}
				</div>

				<!-- Article footer: edit link + prev/next nav -->
				<footer
					class="@container mx-auto mt-10 max-w-prose space-y-5 border-t border-zinc-800 pt-8"
				>
					<EditLink slug={metadata.slug} />
				</footer>
			</div>
		</article>

		<!-- ── RIGHT: Pop culture + similar solutions ── -->
		<aside class="hidden border-t-0 xl:block">
			<div class="sticky top-8 space-y-10 overflow-y-auto p-6">
				<!-- Pop culture section -->
				{#if metadata.media?.length}
					<section aria-labelledby="pop-culture-heading">
						<h2
							id="pop-culture-heading"
							class="mb-4 font-head text-xl font-medium tracking-wide text-white"
						>
							Pop culture
						</h2>
						<div class="flex flex-col gap-4">
							{#each metadata.media.slice(0, 3) as item (item.id)}
								<div
									class="group flex flex-col gap-2 overflow-hidden border border-zinc-800 transition-colors hover:border-zinc-600"
								>
									<!-- Placeholder image area -->
									<div class="aspect-video w-full overflow-hidden bg-zinc-900">
										{#if item.cover}
											<img
												src={item.cover}
												alt={item.title ?? item.id}
												loading="lazy"
												class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
											/>
										{:else}
											<div class="flex h-full w-full items-center justify-center text-zinc-700">
												<span class="text-3xl">🎬</span>
											</div>
										{/if}
									</div>
									<div class="px-3 pb-3">
										<p class="truncate font-sans text-base leading-snug font-medium text-white">
											{item.title}
										</p>
										<p class="mt-0.5 truncate font-sans text-sm text-white/50">
											{item.year ? `${item.type} · ${item.year}` : item.type}
										</p>
									</div>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Similar solutions section -->
				{#if similarPosts.length}
					<section aria-labelledby="similar-solutions-heading">
						<h2
							id="similar-solutions-heading"
							class="mb-4 font-head text-xl font-medium tracking-wide text-white"
						>
							Similar solutions
						</h2>
						<div class="flex flex-col gap-4">
							{#each similarPosts as post (post.slug)}
								<a
									href={post.url}
									class="group flex flex-col gap-2 overflow-hidden border border-zinc-800 transition-colors hover:border-zinc-600"
								>
									<!-- Cover image -->
									<div class="aspect-video w-full overflow-hidden bg-zinc-900">
										{#if post.cover?.src}
											<img
												src={post.cover.src}
												alt={post.title}
												loading="lazy"
												class="h-full w-full object-cover opacity-70 transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
											/>
										{:else}
											<div class="flex h-full w-full items-center justify-center text-zinc-700">
												<span class="text-3xl">🌌</span>
											</div>
										{/if}
									</div>
									<div class="px-3 pb-3">
										<p
											class="truncate font-sans text-base leading-snug font-medium text-white group-hover:text-zinc-200"
										>
											{post.title}
										</p>
										<p class="mt-0.5 truncate font-sans text-sm text-white/50">
											#{post.slug}
										</p>
									</div>
								</a>
							{/each}
						</div>
					</section>
				{/if}
			</div>
		</aside>
	</div>
</main>
