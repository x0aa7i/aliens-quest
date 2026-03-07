<script lang="ts">
	import type { CardProps } from ".";

	let { title, cover, metadata, overview, badges }: CardProps = $props();
</script>

<div class="not-prose flex gap-4 border p-4">
	<div class="aspect-2/3 w-full max-w-28">
		<img src={cover} alt={title} loading="lazy" class="h-full w-full object-cover" />
	</div>

	<div class="flex flex-col items-start text-tertiary">
		<!-- badges -->
		<div class="flex flex-wrap gap-1.5">
			{#each badges as badge (badge)}
				<span class="border bg-surface-raised px-1.5 text-xs tracking-wide capitalize">
					{badge}
				</span>
			{/each}
		</div>
		<!-- title -->
		<h2 class="mt-1 text-md font-semibold text-primary">{title}</h2>
		<!-- metadata -->
		<div class="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
			{#each metadata as { Icon, value, label } (label)}
				{#if value}
					<span class="flex items-center gap-1.5">
						<Icon aria-hidden="true" class="size-4 text-quaternary" />
						<span class="sr-only">{label}</span>
						<span class="text-tertiary">{value}</span>
					</span>
				{/if}
			{/each}
		</div>
		<!-- description -->
		<p class="mt-3 line-clamp-3 leading-normal text-pretty text-tertiary/90">
			{overview}
		</p>
	</div>
</div>
