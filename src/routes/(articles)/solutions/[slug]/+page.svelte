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

	const post = $derived(data.post);

	const titleMeta = $derived([
		{ icon: ExpandIcon, label: "Rank", value: "2 Rank" },
		{ icon: MedalIcon, label: "Votes", value: "1.2k votes" },
		{ icon: LikeIcon, label: "Positive", value: "68% Positive" },
	]);

	let articleRef: HTMLElement | null = $state(null);
	const tocProps = $derived({ tocState: useToc(post.toc, articleRef), items: post.toc });

	const seo = $derived({
		title: `${post.title} - ${defaultMeta.name}`,
		type: "article",
		orImage: {
			url: defaultMeta.url + post.cover.src,
			width: post.cover.width.toString(),
			height: post.cover.height.toString(),
		},
	});
</script>

<Metadata {...seo} />

<main class="min-h-screen">
	<!-- Cover image as background -->
	{#if post.cover?.src}
		<div class="pointer-events-none absolute inset-0 h-96" aria-hidden="true">
			<img
				src={post.cover.src}
				width={post.cover.width}
				height={post.cover.height}
				alt="background"
				class="cover-image h-full w-full object-cover opacity-60"
				loading="eager"
			/>
		</div>
	{/if}

	<section class="pt-24">
		<!-- Hero content -->
		<div class="relative z-10 mx-auto px-4 py-10 md:container md:px-8 lg:px-10">
			<!-- Vote widget (inline on mobile, absolute on desktop) -->
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
					<div class="flex flex-wrap items-center gap-2 md:gap-3">
						{#if post.logo}
							<span class="text-primary **:stroke-3 [&_svg]:h-8 [&_svg]:w-16" aria-hidden="true">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html post.logo}
							</span>
						{/if}

						<h1
							itemprop="headline"
							class="font-head text-4xl leading-none font-medium tracking-tight text-primary md:text-5xl lg:text-5xl"
						>
							{post.title}
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
	</section>

	<!-- ═══════════════════════════════════════════════
	     3-COLUMN BODY LAYOUT
	     left: section nav | center: article | right: sidebar
	     ═══════════════════════════════════════════════ -->
	<div
		class="mx-auto grid grid-cols-1 md:container md:px-8 lg:grid-cols-[14rem_1fr] lg:px-10 xl:grid-cols-[14rem_1fr_24rem]"
	>
		<!-- ── LEFT: Section nav + all-solutions sidebar ── -->
		<div class="sticky top-0 z-10 h-full w-full">
			<aside class="sticky top-0 w-full border-y sm:border-x lg:border-none lg:py-8">
				<!-- Section tabs -->
				<nav aria-label="Article sections" class="no-scrollbar w-full overflow-x-auto">
					<ul class="flex gap-y-1 divide-x lg:flex-col">
						{#each post.toc as entry (entry.url)}
							{@const isActive = tocProps.tocState.isActive(entry)}
							<li class="bg-surface-raised lg:border">
								<a
									href={entry.url}
									class={[
										"block w-full px-6 py-5 text-base text-nowrap transition-colors duration-200 ",
										isActive
											? "bg-linear-to-r from-zinc-900/50 to-transparent text-white"
											: "text-white/50 hover:text-white/80",
									]}
								>
									{entry.title}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			</aside>
		</div>

		<!-- ── CENTER: Main article content ── -->
		<article class="min-w-0 border-x lg:border-none" bind:this={articleRef}>
			<!-- Prose body -->
			<div class="w-full space-y-8 px-4 pt-6 pb-16 sm:px-6 xl:px-8 xl:pt-8">
				<div class="prose mx-auto max-w-prose text-pretty">
					{@html post.content}
				</div>

				<!-- Article footer: edit link + prev/next nav -->
				<footer class="mx-auto mt-10 w-full max-w-prose border-t pt-6 text-lg">
					<EditLink slug={post.slug} />
				</footer>
			</div>
		</article>

		<!-- ── RIGHT: Pop culture + similar solutions ── -->
		<aside class="hidden xl:block">
			<div class="top-8 space-y-10 overflow-y-auto p-6">
				<!-- Pop culture section -->
				{#if post.media?.length}
					<section aria-labelledby="pop-culture-heading">
						<h2 class="font-head text-xl font-medium tracking-wide text-white">Pop culture</h2>
						<div class="mt-4 flex flex-wrap gap-4">
							{#each post.media as item (item.id)}
								<div
									class="group flex w-[calc(50%-0.5rem)] flex-col gap-2 overflow-hidden border transition-colors hover:border-zinc-600"
								>
									<!-- Placeholder image area -->
									<div class="aspect-4/5 w-full overflow-hidden bg-zinc-900">
										{#if item.cover}
											<img
												src={item.cover}
												alt={item.title ?? item.id}
												loading="lazy"
												class="h-full w-full object-cover"
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
				{#if post.similar.length}
					<section aria-labelledby="similar-solutions-heading">
						<h2 class="font-head text-xl font-medium tracking-wide text-primary">
							Similar solutions
						</h2>
						<div class="mt-4 flex flex-col gap-4">
							{#each post.similar as p (p.slug)}
								<a
									href={p.url}
									class="group flex flex-col overflow-hidden border transition-colors hover:border-zinc-600"
								>
									<!-- Cover image -->
									<div class="aspect-2/1 w-full overflow-hidden bg-zinc-900">
										{#if p.cover?.src}
											<img
												src={p.cover.src}
												alt={p.title}
												loading="lazy"
												class="h-full w-full object-cover opacity-70 transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
											/>
										{:else}
											<div class="flex h-full w-full items-center justify-center text-zinc-700">
												<span class="text-3xl">🌌</span>
											</div>
										{/if}
									</div>
									<div class="px-3 py-4">
										<p
											class="truncate font-sans text-base leading-snug font-medium text-primary group-hover:text-zinc-200"
										>
											{p.title}
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

<style>
	.cover-image {
		mask-image:
			radial-gradient(ellipse 70% 60% at 10% 50%, black 0%, transparent 100%),
			linear-gradient(to bottom, black 0%, transparent 100%);
		mask-composite: intersect;
		-webkit-mask-composite: source-in;

		@media (max-width: 767px) {
			mask-image:
				radial-gradient(ellipse 90% 50% at 10% 40%, black 0%, transparent 100%),
				linear-gradient(to bottom, black 0%, transparent 100%);
		}
	}
</style>
