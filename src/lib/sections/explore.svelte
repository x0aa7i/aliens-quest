<script lang="ts">
	import type { SolutionCardProps } from "$lib/components/solution-card.svelte";

	// import fuzzysort from "fuzzysort";

	import SolutionCard from "$lib/components/solution-card.svelte";

	type Props = {
		posts: SolutionCardProps[];
	};

	let { posts }: Props = $props();
	// let search = $state("");

	// const posts = $derived.by(() => {
	// 	if (search.length === 0) {
	// 		return data.posts;
	// 	}
	//
	// 	return fuzzysort
	// 		.go(search, data.posts, {
	// 			keys: ["title"],
	// 			limit: 12,
	// 			threshold: 0.3,
	// 		})
	// 		.map((post) => post.obj);
	// });
</script>

<section class="min-h-150 bg-gray-950 pb-12 pt-12 md:pt-20" id="explore">
	<div class="container mx-auto px-4 pb-8 pt-4 md:px-8">
		<!-- <div class="mt-10 h-12 bg-gray-950"> -->
		<!-- 	<input -->
		<!-- 		type="text" -->
		<!-- 		placeholder="Search for solutions" -->
		<!-- 		class="h-full w-full border-none bg-transparent px-4 py-2 text-gray-100 placeholder:text-gray-500 focus:outline-none" -->
		<!-- 		bind:value={search} -->
		<!-- 	/> -->
		<!-- </div> -->

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			{#each posts as post (post.title)}
				<SolutionCard {...post} />
			{/each}
		</div>
	</div>
</section>
