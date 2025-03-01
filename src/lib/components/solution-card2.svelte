<script lang="ts">
	import type { Metadata } from "$lib/solutions";

	import Danger from "$lib/components/icons/danger.svelte";
	import Target from "$lib/components/icons/target.svelte";

	import Progress from "./progress.svelte";

	let { title, probability, mortality, image, slug }: Metadata = $props();

	const stats = [
		{ name: "Probability", value: probability, Icon: Target },
		{ name: "Mortality", value: mortality, Icon: Danger }
	];
</script>

<a href="/solution/{slug}" class="group block">
	<article
		itemscope
		itemtype="https://schema.org/BlogPosting"
		itemprop="blogPost"
		class="flex flex-col items-center justify-center gap-0"
	>
		<!-- Title -->
		<div class="w-full border px-4 py-3">
			<h2 class="font-head text-center text-xl font-semibold text-gray-200">
				{title}
			</h2>
		</div>

		<!-- Image -->
		<div class="image h-32 w-full transition-all">
			<img src={image} alt={title} class="h-full w-full object-cover" />
		</div>

		<!-- Stats -->
		<div class="grid w-full grid-cols-2 border text-gray-300 transition-all">
			{#each stats as { name, value, Icon }}
				{#if value > 0}
					<div
						class="flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-400 first:border-r"
					>
						<span class="sr-only">{name} = {value * 100}%</span>
						<Icon width="20" height="20" class="shrink-0" />
						<span class="mr-auto hidden sm:block md:hidden">{name}</span>
						<Progress {value} />
						<span class="ml-0.5 text-sm font-medium"> {value * 100}% </span>
					</div>
				{/if}
			{/each}
		</div>
	</article>
</a>
