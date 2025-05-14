<script lang="ts">
	import type { SidebarItem } from ".";

	import { page } from "$app/state";

	type Props = {
		items: SidebarItem[];
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
				<a
					href={item.url}
					class="flex items-center gap-2 truncate py-1.5"
					onclick={() => onItemClick?.()}
				>
					<div class="[&>svg]:h-6 [&>svg]:w-6 [&>svg]:stroke-2">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html item.logo}
					</div>

					<span> {item.title} </span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
