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

<section
	class="container mx-auto h-[calc(100vh-5rem)] overflow-hidden px-4 py-4 md:px-8 xl:max-w-7xl"
>
	<!-- Background -->
	<div class="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-gray-950" aria-hidden="true">
		<!-- <svg bind:this={svg} class="absolute left-1/2 -translate-x-1/2 object-cover opacity-75"></svg> -->
		<img
			src="/stars.svg"
			alt="background stars"
			class="fade-in animate-in duration-2000 h-full w-full object-cover opacity-75"
		/>
		<div
			class="glow fade-in animate-in duration-2000 absolute top-0 aspect-square rounded-full"
		></div>
		<div class="container absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2">
			<div class="planet"></div>
		</div>
	</div>

	<div class="grid h-4/5 w-full place-items-center">
		<div class="w-full max-w-full space-y-5 overflow-hidden">
			<h1
				class={[
					"font-head leading-12 sm:leading-16 max-w-[12ch] text-balance text-5xl font-semibold text-gray-200 sm:text-6xl",
					"animate-in fade-in fill-mode-both duration-1700 ease-in-out-cubic",
				]}
			>
				So.. Where Is Everybody?
			</h1>

			<p
				class={[
					"w-full max-w-[36ch] text-lg text-gray-400 sm:text-balance",
					"animate-in fade-in duration-1700 fill-mode-both ease-in-out-cubic delay-100",
				]}
			>
				Are they hiding, extinct, or just ignoring us? Explore the possibilities and decide for
				yourself.
			</p>
		</div>
	</div>

	<div class="absolute bottom-5 left-1/2 -translate-x-1/2">
		<a
			on:click={onClick}
			href="#explore"
			class={[
				"inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-gray-400 transition-colors hover:text-gray-200",
				"animate-in fade-in slide-in-from-top-5 fill-mode-both ease-in-out-cubic delay-300 duration-1000",
			]}
		>
			<ChevronsDown class="h-5 w-5" />
			Explore
		</a>
	</div>
</section>

<style>
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
		transform: translate3d(-50%, -50%, 0);
		will-change: transform;
		width: 500px;
		aspect-ratio: 1;
		border-radius: 100%;
		background-color: var(--color-gray-950);
		pointer-events: none;
		animation: planet-slide 2s ease-in forwards reverse;

		box-shadow:
			inset -40px -16px 40px -16px #4b4f56,
			inset -20px -8px 10px -18px #fff,
			48px 26px 60px #adadad15;
	}

	@keyframes planet-slide {
		to {
			box-shadow: none;
			transform: translate(calc(-50% - 10px), -50%) rotate(25deg);
		}
	}
</style>
