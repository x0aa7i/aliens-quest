<script module lang="ts">
	export type SolutionCardProps = Pick<Solution, "title" | "url" | "logo" | "cover">;
</script>

<script lang="ts">
	import type { Solution } from "$content/index";

	let { title, logo, cover, url }: SolutionCardProps = $props();
</script>

<a href={url} class="group relative block w-full overflow-hidden border">
	<article
		itemscope
		itemprop="blogPost"
		itemtype="https://schema.org/BlogPosting"
		class="flex h-20 items-center gap-5 px-4 py-2 text-gray-300 group-hover:text-gray-200 md:h-24 md:px-8"
	>
		<!-- bg color -->
		<div class="glow"></div>

		<!-- bg image -->
		{#if cover.src}
			<div class="image">
				<img
					itemprop="image"
					src={cover.src}
					width={cover.width}
					height={cover.height}
					alt="cover"
					loading="lazy"
					class="h-full w-full object-cover"
				/>
			</div>
		{/if}

		{#if logo}
			<div class="duration-250 card-logo z-10 shrink-0 transition-colors">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html logo}
			</div>
		{/if}

		<!-- title -->
		<h2
			itemprop="headline"
			class="font-head duration-250 card-title z-10 truncate text-2xl uppercase transition-colors md:text-3xl"
		>
			{title}
		</h2>
	</article>
</a>

<style>
	.group {
		transition: border-color 0.25s ease-in-out;
	}

	.group:hover .glow {
		opacity: 1;
	}

	.group:hover .image {
		filter: grayscale(0.3) brightness(1);
	}

	.image {
		position: absolute;
		inset: 0;
		left: 40%;
		object-fit: cover;
		filter: grayscale(0.7) brightness(0.5);
		mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1));
		transition: filter 0.25s ease-in-out;
	}

	.glow {
		position: absolute;
		inset: 0;
		background: linear-gradient(165deg, #212429, var(--color-gray-950) 40%);
		opacity: 0.7;
		transition: opacity 0.25s ease-in-out;
	}
</style>
