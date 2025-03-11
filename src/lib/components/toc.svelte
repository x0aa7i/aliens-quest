<script module lang="ts">
	export type TocEntry = { title: string; url: string; items?: TocEntry[] };
</script>

<script lang="ts">
	type Props = {
		items: TocEntry[];
		active?: string;
		class?: string;
	};

	let { items, active, class: _class }: Props = $props();
</script>

<nav class={_class}>
	{@render list(items)}
</nav>

{#snippet list(items?: TocEntry[], className?: string)}
	{#if items?.length}
		<ul class={["text-gray-400", className]}>
			{#each items as item (item.title)}
				<li
					class={[
						"text-sm transition-colors hover:text-gray-50",
						active === item.url && "text-gray-50",
					]}
				>
					<a href={item.url} class="block truncate py-1.5"> {item.title} </a>
					{@render list(item.items, "pl-5")}
				</li>
			{/each}
		</ul>
	{/if}
{/snippet}
