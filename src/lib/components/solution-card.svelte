<script lang="ts">
	// import ChevronDown from "lucide-svelte/icons/chevron-down";
	// import ChevronUp from "lucide-svelte/icons/chevron-up";
	import type { Metadata } from "$lib/solutions";

	import Danger from "$lib/components/icons/danger.svelte";
	import Target from "$lib/components/icons/target.svelte";

	import Progress from "./progress.svelte";

	let { title, probability, mortality, image, slug }: Metadata = $props();
</script>

<article
	itemscope
	itemtype="https://schema.org/BlogPosting"
	itemprop="blogPost"
	class="flex flex-col items-center justify-center gap-2"
>
	<!-- Image container -->
	<div class="image h-32 w-full bg-gray-900">
		<img src={image} alt={title} class="h-full w-full object-cover" />
	</div>

	<div class="flex w-full gap-2">
		<div class="w-full grow space-y-3 border px-6 py-4">
			<!-- Title -->
			<h2 class="font-head text-xl font-bold text-gray-200">
				<a href="/solution/{slug}" class="hover:underline" itemprop="url">
					{title}
				</a>
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
		<!-- <div class="flex h-full flex-col items-center justify-center gap-2 border text-center"> -->
		<!-- 	<div class="inline-flex size-10 items-center justify-center"> -->
		<!-- 		<ChevronUp class="text-gray-300" /> -->
		<!-- 	</div> -->
		<!-- 	<span>49</span> -->
		<!-- 	<div class="inline-flex size-10 items-center justify-center"> -->
		<!-- 		<ChevronDown class="text-gray-300" /> -->
		<!-- 	</div> -->
		<!-- </div> -->
	</div>
</article>

<style>
	.image,
	.image img {
		clip-path: polygon(0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
	}

	.image {
		padding: 1px;
		background-color: var(--color-gray-800);
	}
</style>
