<script lang="ts">
	import CaretDownIcon from "~icons/bx/caret-down";
	import CaretUpIcon from "~icons/bx/caret-up";
	import ExpandIcon from "~icons/bx/expand-vertical";
	import LikeIcon from "~icons/bx/like";
	import MedalIcon from "~icons/bx/up-arrow-circle";
	import { enhance } from "$app/forms";

	import ArticleToc from "$lib/components/article-toc.svelte";
	import EditLink from "$lib/components/edit-link.svelte";
	import Metadata, { defaultMeta } from "$lib/components/metadata.svelte";
	import { visitorId } from "$lib/hooks/fingerprint.svelte";

	let { data } = $props();

	const post = $derived(data.post);
	const userVotes = $derived(data.userVotes); // { solutionId: value }

	let articleRef: HTMLElement | null = $state(null);

	const positivity = $derived.by(() => {
		const total = post.upvotes + post.downvotes;
		if (total === 0) return 0;
		return (post.upvotes / total) * 100;
	});

	const titleMeta = $derived([
		{ icon: ExpandIcon, label: "Rank", value: `${post.rank} Rank` },
		{ icon: MedalIcon, label: "Votes", value: `${post.votes} Votes` },
		{ icon: LikeIcon, label: "Positive", value: `${positivity}% Positive` },
	]);

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
				class="cover-image h-full w-full object-cover opacity-40"
				loading="eager"
			/>
		</div>
	{/if}

	<section class="pt-24 md:pt-28">
		<!-- Hero content -->
		<div class="relative z-10 mx-auto px-4 py-10 sm:px-6 md:container md:px-8 lg:px-10">
			<!-- Vote widget (inline on mobile, absolute on desktop) -->
			<!-- Title row -->
			<div class="flex flex-col items-start gap-4 md:flex-row md:items-center lg:gap-6">
				<!-- Upvote / Downvote widget -->
				<form
					method="POST"
					class="order-1 flex shrink-0 gap-1 md:order-0 md:flex-col"
					aria-label="Vote on this solution"
					use:enhance
				>
					<input type="hidden" name="fingerprint" value={visitorId.current} />
					<input type="hidden" name="solutionId" value={post.slug} />
					<button
						name="value"
						value="1"
						aria-label="Upvote"
						aria-pressed={userVotes[post.slug] === 1}
						class={[
							"flex h-10 w-12 items-center justify-center border transition-colors hover:brightness-125",
							userVotes[post.slug] === 1
								? "border-[#007856] bg-[#05241E] text-emerald-50"
								: "border bg-surface-raised/70 text-quaternary",
						]}
					>
						<CaretUpIcon class="size-5" />
					</button>

					<button
						name="value"
						value="-1"
						aria-label="Downvote"
						aria-pressed={userVotes[post.slug] === -1}
						class={[
							"flex h-10 w-12 items-center justify-center border transition-colors hover:brightness-125",
							userVotes[post.slug] === -1
								? "border-[#7C4130] bg-[#281A15] text-orange-50"
								: "border bg-surface-raised/70 text-quaternary",
						]}
					>
						<CaretDownIcon class="size-5" />
					</button>
				</form>

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
					<div class="flex flex-wrap items-center gap-x-4 gap-y-1 opacity-80">
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

	<!-- 3-COLUMN BODY LAYOUT -->
	<!-- left: section nav | center: article | right: sidebar -->
	<div
		class="mx-auto grid grid-cols-1 gap-x-4 md:container md:px-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:px-10 xl:grid-cols-[14rem_minmax(0,1fr)_22rem]"
	>
		<!-- LEFT: Section nav  -->
		<div class="sticky top-0 z-10 h-full w-full">
			<ArticleToc toc={post.toc} {articleRef} />
		</div>

		<!-- ── CENTER: Main article content ── -->
		<article class="min-w-0 sm:border-x lg:border-none" bind:this={articleRef}>
			<!-- Prose body -->
			<div class="w-full space-y-8 px-4 py-12 sm:px-6 lg:px-8 lg:pt-8">
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
		<aside
			class="w-full space-y-12 overflow-hidden px-4 py-8 sm:border-x sm:px-6 lg:col-start-2 lg:border-none lg:px-8 xl:col-start-3 xl:px-0"
		>
			<!-- Similar solutions section -->
			{#if post.similar.length}
				<section aria-labelledby="similar-solutions-heading">
					<h2 class="font-head text-xl font-medium tracking-wide text-primary">
						Similar solutions
					</h2>
					<div class="mt-4 no-scrollbar flex gap-4 overflow-x-auto xl:flex-col">
						{#each post.similar as p (p.slug)}
							<a
								href={p.url}
								class={[
									"group flex max-w-full min-w-72 flex-1 flex-col overflow-hidden",
									"border transition-colors duration-300 hover:border-zinc-700",
								]}
							>
								<!-- Cover image -->
								<div class="aspect-5/2 w-full overflow-hidden bg-surface-raised">
									{#if p.cover?.src}
										<img
											src={p.cover.src}
											alt={p.title}
											loading="lazy"
											class="h-full w-full object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-90"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center text-zinc-700">
											<span class="text-3xl">🌌</span>
										</div>
									{/if}
								</div>
								<div
									class="px-4 py-4 text-secondary transition-colors duration-300 group-hover:text-primary"
								>
									<div class="flex items-center gap-2">
										<div class="**:stroke-[1.5] [&_svg]:h-6 [&_svg]:w-8">
											{@html p.logo}
										</div>
										<p class="truncate font-head text-base leading-snug font-medium">
											{p.title}
										</p>
									</div>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}
		</aside>
	</div>
</main>

<style>
	.cover-image {
		mask-image:
			radial-gradient(ellipse 70% 60% at 10% 50%, black 25%, transparent 100%),
			linear-gradient(to bottom, black 25%, rgba(0, 0, 0, 0.5) 50%, transparent 100%);
		mask-composite: intersect;
		-webkit-mask-composite: source-in;

		@media (max-width: 767px) {
			mask-image:
				radial-gradient(ellipse 90% 50% at 10% 40%, black 35%, transparent 100%),
				linear-gradient(to bottom, black 25%, rgba(0, 0, 0, 0.75) 50%, transparent 100%);
		}
	}
</style>
