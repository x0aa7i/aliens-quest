export type TocEntry = {
	title: string;
	url: string;
	items?: TocEntry[];
};

export type TocState = ReturnType<typeof useToc>;

function getAbsoluteTop(element: Element): number {
	const rect = element.getBoundingClientRect();
	return rect.top + window.scrollY;
}

function getTocIds(items: TocEntry[]): string[] {
	if (!items?.length) return [];

	const result: string[] = [];

	for (const item of items) {
		const id = item.url.substring(1);
		if (id) result.push(id);
		if (item.items) result.push(...getTocIds(item.items));
	}

	return result;
}

function createSentinel(sentinelId: string): HTMLElement {
	const sentinel = document.createElement("div");

	sentinel.id = sentinelId;
	sentinel.style.opacity = "0";
	sentinel.style.marginTop = "-1px";
	sentinel.style.height = "1px";
	sentinel.style.pointerEvents = "none";

	return sentinel;
}

type UseTocOptions = {
	topSentinelId?: string;
	bottomSentinelId?: string;
};

export function useToc(tocItems: TocEntry[], article?: HTMLElement | null, opts?: UseTocOptions) {
	let activeId = $state<string | null>(null);
	let intersectingId = $state<string | null>(null);
	let tocObserver: IntersectionObserver | null = null;
	let sentinelsObserver: IntersectionObserver | null = null;

	let isAtTop = $state(false);
	let isAtBottom = $state(false);

	const itemIds = $derived(getTocIds(tocItems));
	const tocElements = new Map<string, HTMLElement>();

	$effect(() => {
		if (!article) return;

		const topSentinelId = opts?.topSentinelId ?? "page-top-sentinel";
		const bottomSentinelId = opts?.bottomSentinelId ?? "page-bottom-sentinel";

		const topSentinel = createSentinel(topSentinelId);
		article.insertBefore(topSentinel, article.firstChild);

		const bottomSentinel = createSentinel(bottomSentinelId);
		article.appendChild(bottomSentinel);

		// Disconnect previous observer
		sentinelsObserver?.disconnect();

		const observerCallback: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				if (entry.target.id === topSentinelId) {
					isAtTop = entry.isIntersecting;
				} else if (entry.target.id === bottomSentinelId) {
					isAtBottom = entry.isIntersecting;
				}
			}
		};

		sentinelsObserver = new IntersectionObserver(observerCallback, {
			rootMargin: "0px 0px 0px 0px",
			threshold: 0,
		});

		for (const sentinel of [topSentinel, bottomSentinel]) {
			sentinelsObserver.observe(sentinel);
		}

		return () => {
			sentinelsObserver?.disconnect();
			if (article) {
				article.querySelector(`#${topSentinelId}`)?.remove();
				article.querySelector(`#${bottomSentinelId}`)?.remove();
			}
		};
	});

	$effect(() => {
		if (itemIds.length === 0) return;

		// Disconnect previous observer
		tocObserver?.disconnect();

		for (const id of itemIds) {
			const el = document.getElementById(id);
			if (el) tocElements.set(id, el);
		}

		if (tocElements.size === 0) return;

		// Track elements currently intersecting
		const intersectingElements = new Map<string, IntersectionObserverEntry>();

		const observerCallback: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					intersectingElements.set(entry.target.id, entry);
				} else {
					intersectingElements.delete(entry.target.id);
				}
			}

			const bottomMostId = Array.from(intersectingElements.values())
				.sort((a, b) => getAbsoluteTop(a.target) - getAbsoluteTop(b.target))
				.at(-1)?.target.id;

			intersectingId = bottomMostId ?? null;
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

	$effect(() => {
		if (isAtTop && !intersectingId) {
			activeId = null;
		} else if (isAtBottom) {
			activeId = Array.from(tocElements.values()).at(-1)?.id ?? null;
		} else if (intersectingId) {
			activeId = intersectingId;
		}
	});

	// determine if a specific TOC item is active or contains the active item
	function isActive(item: TocEntry): boolean {
		if (!activeId) return false;
		const currentHash = `#${activeId}`;
		return item.url === currentHash;
		// return item.url === currentHash || !!item.items?.some((child) => child.url === currentHash);
		// !!item.items.some(child => isActive(child)); // for deeper nesting:
	}

	return {
		get activeId() {
			return activeId;
		},
		isActive,
	};
}
