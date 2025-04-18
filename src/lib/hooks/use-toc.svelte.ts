import { untrack } from "svelte";

import { page } from "$app/state";

export type TocEntry = {
	title: string;
	url: string;
	items?: TocEntry[];
};

export type TableOfContents = {
	items?: TocEntry[];
};

function getAbsoluteTop(element: Element): number {
	let offsetTop = 0;
	let currentElement: HTMLElement | null = element as HTMLElement;

	while (currentElement && currentElement !== document.body) {
		offsetTop += currentElement.offsetTop;
		currentElement = currentElement.offsetParent as HTMLElement | null;
	}

	return offsetTop;
}

export function useToc(tocItems: TocEntry[]) {
	let activeId = $state<string | null>(null);
	const urlHash = $derived(page.url.hash);
	const itemIds = $derived(
		tocItems.flatMap((item) => [item.url, ...(item.items?.map((i) => i.url) ?? [])]).filter(Boolean)
	);

	function isActive(item: TocEntry) {
		return (
			(item.url === urlHash && `#${activeId}` === urlHash) ||
			isParentOfActiveItem(item) ||
			item.url === `#${activeId}`
		);
	}

	function isParentOfActiveItem(item: TocEntry) {
		return Boolean(item.items?.some((item) => item.url === `#${activeId}`));
	}

	function setActiveId() {
		const scrollY = window.scrollY;
		const innerHeight = window.innerHeight;
		const offsetHeight = document.body.offsetHeight;
		const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;

		const nodes = [...document.querySelectorAll(itemIds.join(","))]
			.map((el) => ({ id: el.id, top: getAbsoluteTop(el) }))
			.filter(({ top }) => !Number.isNaN(top))
			.sort((a, b) => a.top - b.top);

		if (!nodes.length) {
			activeId = null;
			return;
		}

		if (scrollY < 1) {
			activeId = null;
			return;
		}

		if (isBottom) {
			activeId = nodes[nodes.length - 1].id;
			return;
		}

		// Find the closest header to the current scroll position (within 33% of the viewport height)
		let current: string | null = null;
		for (const { id, top } of nodes) {
			if (top > scrollY + innerHeight / 4) break;
			current = id;
		}

		activeId = current;
	}

	$effect(() => {
		untrack(() => setActiveId()); // run once on mount
		window.addEventListener("scroll", setActiveId, { passive: true });
		return () => window.removeEventListener("scroll", setActiveId);
	});

	return {
		get activeId() {
			return activeId;
		},
		isActive,
	};
}

export type TocState = ReturnType<typeof useToc>;
