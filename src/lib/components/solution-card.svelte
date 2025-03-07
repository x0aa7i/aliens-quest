<script lang="ts">
	import type { Solution } from "$content/index";

	// import Danger from "$lib/components/icons/danger.svelte";
	// import Target from "$lib/components/icons/target.svelte";

	let { title, permalink, logo: Logo, cover }: Omit<Solution, "content"> = $props();

	// const stats = [
	// 	{ name: "Probability", value: probability, Icon: Target },
	// 	{ name: "Mortality", value: mortality, Icon: Danger }
	// ];
</script>

<a href={permalink} class="group relative block w-full overflow-hidden border">
	<article
		itemscope
		itemtype="https://schema.org/BlogPosting"
		itemprop="blogPost"
		class="flex h-24 items-center gap-5 px-8 py-3 text-gray-300 group-hover:text-gray-200 md:px-10"
	>
		<!-- bg color -->
		<div class="glow"></div>

		<!-- bg image -->
		{#if cover}
			<div class="image">
				<img src={cover.src} alt="" class="h-full w-full object-cover" />
			</div>
		{/if}

		<div class={["duration-250 z-10 shrink-0 transition-colors", !Logo && "hidden"]}>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html Logo}
		</div>

		<!-- Info -->
		<h2 class="font-head duration-250 z-10 truncate text-3xl uppercase transition-colors">
			{title}
		</h2>

		<!-- Stats -->
		<!-- <div class="z-10 ml-auto hidden grid-cols-2 gap-6 text-gray-400 transition-all md:grid"> -->
		<!-- 	{#each stats as { name, value, Icon }} -->
		<!-- 		{#if value > 0} -->
		<!-- 			<div class="flex items-center justify-center gap-1 text-sm"> -->
		<!-- 				<span class="sr-only">{name} = {value * 100}%</span> -->
		<!-- 				<Icon width="20" height="20" class="shrink-0" /> -->
		<!-- 				<span class="text-md"> {value * 100}% </span> -->
		<!-- 			</div> -->
		<!-- 		{/if} -->
		<!-- 	{/each} -->
		<!-- </div> -->
	</article>
</a>

<style>
	.group {
		transition: border-color 0.25s ease-in-out;

		&:hover {
			.glow {
				opacity: 1;
			}

			.image {
				filter: grayscale(0.3) brightness(1);
			}
		}
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
