<script lang="ts">
	import type { Solution } from "$content/index";

	import fuzzysort from "fuzzysort";

	import SolutionCard from "$lib/components/solution-card.svelte";

	let data: { posts: Omit<Solution, "content">[] } = $props();
	let search = $state("");

	const posts = $derived.by(() => {
		if (search.length === 0) {
			return data.posts;
		}

		return fuzzysort
			.go(search, data.posts, {
				keys: ["title"],
				limit: 12,
				threshold: 0.3,
			})
			.map((post) => post.obj);
	});
</script>

<section class="min-h-150 bg-gray-950" id="explore">
	<div class="container mx-auto px-8 py-4">
		<div class="mt-10 h-12 bg-gray-900">
			<input
				type="text"
				placeholder="Search for solutions"
				class="h-full w-full border-none bg-transparent px-4 py-2 text-gray-100 placeholder:text-gray-500 focus:outline-none"
				bind:value={search}
			/>
		</div>

		<div class="mt-10 grid grid-cols-1 gap-4">
			{#each posts as post (post.slug)}
				<SolutionCard {...post} />
			{/each}
		</div>
	</div>
</section>
