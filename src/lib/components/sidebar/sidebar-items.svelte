<script lang="ts">
	import { page } from "$app/state";

	type Props = {
		items: { title: string; url: string }[];
		class?: string;
		onItemClick?: () => void;
	};

	let { class: _class, items, onItemClick }: Props = $props();
</script>

<nav>
	<span class="font-semibold text-gray-200">All Solutions</span>

	<ul class="mt-2 text-gray-400">
		{#each items as item (item.title)}
			<li
				class={[
					"text-sm transition-colors hover:text-gray-50",
					page.url.pathname === item.url && "text-gray-50",
				]}
			>
				<a href={item.url} class="block truncate py-1.5" onclick={() => onItemClick?.()}>
					{item.title}
				</a>
			</li>
		{/each}
	</ul>
</nav>
