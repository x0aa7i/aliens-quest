<script lang="ts">
	import type { CardProps } from ".";

	let { title, poster, metadata, overview, type }: CardProps = $props();
</script>

<div class="not-prose flex gap-4 border p-4">
	<div class="aspect-[2/3] w-full max-w-28">
		<img src={poster} alt={title} loading="lazy" class="h-full w-full object-cover" />
	</div>

	<div class="text-tertiary flex flex-col items-start">
		<!-- type -->
		<span class="bg-surface-raised block border px-2 text-xs tracking-wide">
			{type === "movie" ? "Movie" : type === "tv" ? "TV Series" : "Book"}
		</span>
		<!-- title -->
		<h2 class="text-primary mt-1 text-xl font-semibold">{title}</h2>
		<!-- metadata -->
		<div class="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
			{#each metadata as { Icon, value, label } (label)}
				{#if value}
					<span class="flex items-center gap-1.5">
						<Icon aria-hidden="true" class="text-quaternary size-4" />
						<span class="sr-only">{label}</span>
						<span class="text-tertiary">{value}</span>
					</span>
				{/if}
			{/each}
		</div>
		<!-- description -->
		<p class="text-tertiary/90 mt-3 line-clamp-3 text-pretty leading-normal">
			{overview}
		</p>
	</div>
</div>
