<script lang="ts">
	import type { EventHandler } from "svelte/elements";

	import ChevronsDown from "lucide-svelte/icons/chevrons-down";

	import Background from "$lib/components/hero-bg.svelte";

	const onClick: EventHandler<MouseEvent, HTMLAnchorElement> = (e) => {
		e.preventDefault();

		const targetId = e.currentTarget.getAttribute("href")?.substring(1);
		if (!targetId) return;

		const target = document.getElementById(targetId);
		if (!target) return;

		target.scrollIntoView({ behavior: "smooth", block: "start" });
	};
</script>

<section class="container mx-auto px-8 py-4">
	<div class="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-gray-950">
		<Background />
	</div>

	<div class="grid h-4/5 w-full place-items-center">
		<div class="w-full space-y-6 text-gray-300">
			<h1 class="font-head max-w-[12ch] text-balance text-6xl font-semibold">
				But.. Where Is Everybody?
			</h1>

			<p class="w-full max-w-[36ch] text-balance text-lg text-gray-400">
				Are they hiding, extinct, or just ignoring us? Explore the possibilities and decide for
				yourself.
			</p>
		</div>
	</div>

	<div class="absolute bottom-2 left-1/2 -translate-x-1/2">
		<a
			on:click={onClick}
			href="#explore"
			class="inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-gray-500"
		>
			<ChevronsDown class="h-5 w-5" />
			Explore
		</a>
	</div>
</section>

<style>
	section {
		height: calc(100vh - 5rem);
		height: calc(100dvh - 5rem);
	}
</style>
