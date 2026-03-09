export type TocEntry = {
	title: string;
	url: string;
	items?: TocEntry[];
};

export type TocState = ReturnType<typeof useToc>;

function getAbsoluteTop(element: Element): number {
	return element.getBoundingClientRect().top + window.scrollY;
}

function collectIds(items: TocEntry[]): string[] {
	return items.flatMap((item) => {
		const id = item.url.slice(1);
		// const id = item.url.startsWith("#") ? item.url.slice(1) : "";
		return id ? [id, ...collectIds(item.items ?? [])] : collectIds(item.items ?? []);
	});
}

function createSentinel(id: string): HTMLElement {
	const el = document.createElement("div");
	el.id = id;
	Object.assign(el.style, {
		opacity: "0",
		height: "1px",
		marginTop: "-1px",
		pointerEvents: "none",
	});
	return el;
}

type UseTocOptions = {
	topSentinelId?: string;
	bottomSentinelId?: string;
};

export function useToc(tocItems: TocEntry[], article?: HTMLElement | null, opts?: UseTocOptions) {
	const topSentinelId = opts?.topSentinelId ?? "toc-page-top-sentinel";
	const bottomSentinelId = opts?.bottomSentinelId ?? "toc-page-bottom-sentinel";

	let tocObserver: IntersectionObserver | null = null;
	let sentinelsObserver: IntersectionObserver | null = null;

	let activeId = $state<string | null>(null);
	let intersectingId = $state<string | null>(null);

	let isPageTopVisible = $state(false);
	let isPageBottomVisible = $state(false);

	const headingIds = $derived(collectIds(tocItems));
	const tocElements = new Map<string, HTMLElement>();

	// Create & observe top/bottom sentinels
	$effect(() => {
		if (!article) return;

		const topSentinel = createSentinel(topSentinelId);
		const bottomSentinel = createSentinel(bottomSentinelId);

		article.insertBefore(topSentinel, article.firstChild);
		article.appendChild(bottomSentinel);

		// Disconnect previous observer if any
		sentinelsObserver?.disconnect();

		const observerCallback: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				if (entry.target.id === topSentinelId) {
					isPageTopVisible = entry.isIntersecting;
				} else if (entry.target.id === bottomSentinelId) {
					isPageBottomVisible = entry.isIntersecting;
				}
			}
		};

		sentinelsObserver = new IntersectionObserver(observerCallback, {
			rootMargin: "0px",
			threshold: 0,
		});

		sentinelsObserver.observe(topSentinel);
		sentinelsObserver.observe(bottomSentinel);

		return () => {
			sentinelsObserver?.disconnect();
			topSentinel.remove();
			bottomSentinel.remove();
		};
	});

	// Observe TOC heading elements to track which one is in view
	$effect(() => {
		if (headingIds.length === 0) return;

		// Disconnect previous observer
		tocObserver?.disconnect();

		tocElements.clear();
		for (const id of headingIds) {
			const el = document.getElementById(id);
			if (el) tocElements.set(id, el);
		}

		if (tocElements.size === 0) return;

		// Track elements currently intersecting
		const intersecting = new Map<string, IntersectionObserverEntry>();

		const observerCallback: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) intersecting.set(entry.target.id, entry);
				else intersecting.delete(entry.target.id);
			}

			// Among currently visible headings, pick the bottom-most one
			intersectingId =
				[...intersecting.values()]
					.sort((a, b) => getAbsoluteTop(a.target) - getAbsoluteTop(b.target))
					.at(-1)?.target.id ?? null;
		};

		tocObserver = new IntersectionObserver(observerCallback, {
			rootMargin: "0px 0px -70% 0px", // Activate when item enters top 30% of viewport
			threshold: 0,
		});

		for (const el of tocElements.values()) {
			tocObserver.observe(el);
		}

		return () => {
			tocObserver?.disconnect();
		};
	});

	// Resolve final activeId from scroll position signals
	$effect(() => {
		if (isPageTopVisible && !intersectingId) {
			activeId = headingIds.at(0) ?? null;
		} else if (isPageBottomVisible) {
			activeId = headingIds.at(-1) ?? null;
		} else if (intersectingId) {
			activeId = intersectingId;
		}
	});

	// determine if a specific TOC item is active or contains the active item
	function isActive(item: TocEntry): boolean {
		if (!activeId) return false;
		const hash = `#${activeId}`;
		return item.url === hash || !!item.items?.some((child) => child.url === hash);
		// !!item.items.some(child => isActive(child)); // for deeper nesting:
	}

	return {
		get activeId() {
			return activeId;
		},
		isActive,
	};
}
