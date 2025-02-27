<script lang="ts">
	import type { Metadata } from "$lib/solutions";

	import SolutionCard from "$lib/components/solution-card.svelte";

	let { posts }: { posts: Metadata[] } = $props();
</script>

<section class="min-h-150 bg-gray-950">
	<div class="container mx-auto px-8 py-4">
		<div class="mt-10 h-12 bg-gray-900"></div>

		<div class="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
			{#each posts as post}
				<SolutionCard {...post} />
			{/each}
		</div>
	</div>
</section>
