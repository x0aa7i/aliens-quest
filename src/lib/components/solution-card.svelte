<script lang="ts">
	import type { Metadata } from "$lib/solutions";

	import Danger from "$lib/components/icons/danger.svelte";
	import Target from "$lib/components/icons/target.svelte";

	import Progress from "./progress.svelte";

	let { title, probability, mortality, image, slug }: Metadata = $props();
</script>

<a href="/solution/{slug}" class="group block">
	<article
		itemscope
		itemtype="https://schema.org/BlogPosting"
		itemprop="blogPost"
		class="flex flex-col items-center justify-center gap-2"
	>
		<!-- Image container -->
		<div class="image h-32 w-full transition-all">
			<img src={image} alt={title} />
		</div>

		<div class="w-full grow space-y-3 border border-[var(--border-color)] px-6 py-4 transition-all">
			<!-- Title -->
			<h2 class="font-head text-xl font-semibold text-gray-200">
				{title}
			</h2>
			<!-- <span class="text-gray-400">001</span> -->

			<div class="mt-1 flex flex-wrap gap-5 text-sm text-gray-300">
				{#if probability > 0}
					<div class="flex items-center gap-1.5 text-sm text-gray-300">
						<Target width="20" height="20" class="shrink-0" />
						<Progress value={probability} />
						<span class="ml-0.5 text-sm font-medium"> {probability * 100}% </span>
					</div>
				{/if}
				{#if mortality > 0}
					<div class="flex items-center gap-1.5 text-sm text-gray-300">
						<Danger width="20" height="20" class="shrink-0" />
						<Progress value={mortality} />
						<span class="ml-0.5 text-sm font-medium"> {mortality * 100}% </span>
					</div>
				{/if}
			</div>
		</div>
	</article>
</a>

<style>
	.image {
		--clip: polygon(0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);

		width: 100%;
		position: relative;
		z-index: 1;
		background: none;
		overflow: hidden;
		box-sizing: border-box;

		clip-path: var(--clip);
		-webkit-clip-path: var(--clip);
		background-color: var(--border-color);

		img {
			position: absolute;
			top: 1px;
			left: 1px;
			width: calc(100% - 2px);
			height: calc(100% - 2px);
			object-fit: cover;
			object-position: center;
			clip-path: var(--clip);
			-webkit-clip-path: var(--clip);
		}
	}

	a {
		--border-color: var(--color-gray-700);

		&:hover {
			--border-color: var(--color-gray-600);
		}
	}
</style>
