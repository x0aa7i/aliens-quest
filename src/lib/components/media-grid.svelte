<script lang="ts">
	import type { Media } from "$lib/data/media";

	import Image from "~icons/bx/image";

	let { media }: { media: Media[] } = $props();
</script>

<div class="not-prose mt-4 flex gap-4 overflow-x-auto">
	{#each media as item (item.id)}
		<div class="group flex max-w-48 min-w-42 flex-1 flex-col gap-2 overflow-hidden border">
			<!-- image area -->
			<div class="relative aspect-4/5 w-full overflow-hidden bg-zinc-900">
				{#if item.cover}
					<img
						src={item.cover}
						alt={item.title ?? item.id}
						loading="lazy"
						class="h-full w-full object-cover"
					/>
				{:else}
					<div class="flex h-full w-full items-center justify-center text-zinc-700">
						<Image class="size-8 text-tertiary" />
					</div>
				{/if}

				<div
					class={[
						"absolute inset-0 z-10 flex flex-col overflow-hidden bg-surface-raised px-4 py-5",
						"opacity-0 transition-opacity duration-400 group-hover:opacity-92",
					]}
				>
					<p class="font-sans text-base text-primary">
						{item.overview}
					</p>
				</div>
			</div>

			<!-- title -->
			<div class="space-y-0.5 px-4 py-1 pb-3">
				<p class="truncate font-sans text-base leading-snug font-medium text-white">
					{item.title}
				</p>
				<p class="truncate font-sans text-sm text-quaternary capitalize">
					{item.year ? `${item.type} · ${item.year}` : item.type}
				</p>
			</div>
		</div>
	{/each}
</div>
