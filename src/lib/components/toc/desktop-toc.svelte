<script lang="ts">
	import type { TocEntry, TocState } from "$lib/hooks/use-toc.svelte";

	import TocTree from "./toc-tree.svelte";

	type Props = {
		title?: string;
		items: TocEntry[];
		tocState: TocState;
		class?: string;
	};

	let { class: _class, items, tocState, title = "On this page" }: Props = $props();
</script>

<aside class="hidden pl-6 pt-4 xl:block">
	<div class="sticky top-8 overflow-y-auto overflow-x-hidden pb-2">
		<span class="font-semibold text-gray-200">{title}</span>
		<TocTree {items} {tocState} class="mt-2" />
	</div>
</aside>
