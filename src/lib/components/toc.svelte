<script lang="ts">
	type TocEntry = { title: string; url: string };

	type Props = {
		title: string;
		data: TocEntry[];
		active?: string;
		class?: string;
	};

	let { title, data, active, class: _class }: Props = $props();
</script>

{#if data.length > 0}
	<div class={_class}>
		<div class="sticky top-8">
			<span class="font-semibold text-gray-200">{title}</span>

			<ul class="mt-2 overflow-y-auto overflow-x-hidden overscroll-contain text-gray-400">
				{#each data as toc (toc.title)}
					<li
						class={[
							"text-sm transition-colors hover:text-gray-50",
							active === toc.url && "text-gray-50",
						]}
					>
						<a href={toc.url} class="block truncate py-1.5"> {toc.title} </a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
