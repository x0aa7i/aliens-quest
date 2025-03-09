<script lang="ts">
	type TocEntry = { title: string; url: string; items?: TocEntry[] };

	type Props = {
		title: string;
		data: TocEntry[];
		active?: string;
		class?: string;
	};

	let { title, data, active, class: _class }: Props = $props();
</script>

<nav class={_class}>
	<div class="sticky top-8 overflow-y-auto overflow-x-hidden pb-2">
		<span class="font-semibold text-gray-200">{title}</span>
		{@render list(data, "mt-2")}
	</div>
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
