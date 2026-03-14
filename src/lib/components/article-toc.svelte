<script lang="ts">
	import type { TocEntry } from "$lib/hooks/use-toc.svelte.js";

	import { MediaQuery } from "svelte/reactivity";

	import { useToc } from "$lib/hooks/use-toc.svelte.js";

	type Props = {
		toc: TocEntry[];
		articleRef: HTMLElement | null;
	};

	let { toc, articleRef }: Props = $props();

	let navRef: HTMLElement | null = $state(null);
	let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

	const isDesktop = new MediaQuery("(min-width: 1024px)");
	const tocState = $derived(useToc(toc, articleRef));

	/**
	 * Processes the TOC tree into a flat lookup map.
	 */
	function buildRootLookup(toc: any[]): Map<string, string> {
		const map = new Map<string, string>();

		function walk(entry: any, rootUrl: string) {
			const id = entry.url.replace("#", "");
			map.set(id, rootUrl);

			if (entry.items?.length) {
				for (const child of entry.items) {
					walk(child, rootUrl);
				}
			}
		}

		for (const root of toc) {
			walk(root, root.url);
		}

		return map;
	}

	const rootLookup = $derived(buildRootLookup(toc));

	$effect(() => {
		if (!tocState.activeId || !navRef || isDesktop.current) return;

		const rootUrl = rootLookup.get(tocState.activeId);
		if (!rootUrl) return;

		const activeLink = navRef.querySelector(`a[href="${rootUrl}"]`) as HTMLElement;
		if (!activeLink) return;

		// Cancel any pending scroll
		if (scrollTimeout) clearTimeout(scrollTimeout);

		scrollTimeout = setTimeout(() => {
			const nav = navRef!;

			// Horizontal scroll only (mobile)
			const linkLeft = activeLink.offsetLeft;
			const linkWidth = activeLink.offsetWidth;
			const navWidth = nav.offsetWidth;
			const targetScrollLeft = linkLeft - navWidth / 2 + linkWidth / 2;

			// Vertical scroll only (desktop sidebar)
			const linkTop = activeLink.offsetTop;
			const linkHeight = activeLink.offsetHeight;
			const navHeight = nav.offsetHeight;
			const targetScrollTop = linkTop - navHeight / 2 + linkHeight / 2;

			nav.scrollTo({
				left: targetScrollLeft,
				top: targetScrollTop,
				behavior: "smooth",
			});

			scrollTimeout = null;
		}, 100);

		return () => {
			if (scrollTimeout) clearTimeout(scrollTimeout);
		};
	});
</script>

<aside class="sticky top-0 w-full border-y sm:border-x lg:border-none lg:py-8">
	<!-- Section tabs -->
	<nav bind:this={navRef} class="no-scrollbar w-full overflow-x-auto" aria-label="Article sections">
		<ul class="flex gap-y-1 divide-x lg:flex-col">
			{#each toc as entry (entry.url)}
				{@const isActive = tocState.isActive(entry)}
				<li class="bg-surface-raised lg:border">
					<a
						href={entry.url}
						class={[
							"block w-full px-6 py-4 text-base text-nowrap transition-colors duration-300 max-lg:border-b-2 lg:border-l-2 lg:py-5",
							isActive
								? "border-zinc-300 bg-linear-to-r from-zinc-900/50 to-transparent text-white"
								: "border-transparent text-white/50 hover:text-white/80",
						]}
					>
						{entry.title}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>
