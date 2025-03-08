<script lang="ts">
	import type { EventHandler } from "svelte/elements";

	import ChevronsDown from "lucide-svelte/icons/chevrons-down";

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
	<!-- Background -->
	<div class="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-gray-950">
		<img src="/stars.svg" alt="" class="h-full w-full object-cover" />
		<div class="glow absolute top-0 aspect-square rounded-full"></div>
		<div class="container absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2">
			<div class="planet"></div>
		</div>
	</div>

	<div class="grid h-4/5 w-full place-items-center">
		<div class="w-full space-y-6">
			<h1 class="font-head max-w-[12ch] text-balance text-6xl font-semibold text-gray-200">
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

	.glow {
		left: -24rem;
		top: -12rem;
		width: 36rem;
		height: 36rem;
		background: var(--color-gray-400);
		opacity: 0.1;
		filter: blur(130px);
		pointer-events: none;
	}

	.planet {
		position: absolute;
		left: 75%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 500px;
		aspect-ratio: 1;
		border-radius: 100%;
		background-color: var(--color-gray-950);
		pointer-events: none;

		box-shadow:
			inset -40px -16px 40px -16px #4b4f56,
			inset -20px -8px 10px -18px #fff,
			48px 26px 60px #adadad15;
	}
</style>
