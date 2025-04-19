<script lang="ts">
	import type { TocEntry, TocState } from "$lib/hooks/use-toc.svelte";

	import TocTree from "./toc-tree.svelte";

	type Props = {
		items: TocEntry[];
		class?: string;
		level?: number;
		tocState: TocState;
		onItemClick?: () => void;
	};

	let { class: _class, items, level = 1, tocState, onItemClick }: Props = $props();
</script>

{#if items?.length && level < 3}
	<ul class={["text-gray-400", level !== 1 && "pl-5", _class]}>
		{#each items as item (item.title)}
			{@const active = tocState.isActive(item)}
			<li class={["text-sm transition-colors hover:text-gray-50", active && "text-gray-50"]}>
				<a href={item.url} class="block truncate py-1.5" onclick={() => onItemClick?.()}>
					{item.title}
				</a>

				{#if item.items?.length}
					<TocTree items={item.items} {tocState} level={level + 1} {onItemClick} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}
