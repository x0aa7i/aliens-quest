<script lang="ts">
	import type { HTMLCanvasAttributes } from "svelte/elements";

	import { onMount } from "svelte";

	import { random, setRandomSeed } from "$lib/utils/random";

	let canvas: HTMLCanvasElement;
	type Props = HTMLCanvasAttributes;

	let props: Props = $props();

	onMount(() => {
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		resizeCanvas(canvas);
		render(ctx, canvas);

		window.addEventListener("resize", () => {
			resizeCanvas(canvas);
			render(ctx, canvas);
		});

		return () => {
			if (!canvas) return;
			canvas.remove();

			window.removeEventListener("resize", () => {
				resizeCanvas(canvas);
				render(ctx, canvas);
			});
		};
	});

	function resizeCanvas(canvas: HTMLCanvasElement) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		setRandomSeed(8);

		function drawStars(count: number) {
			for (let i = 0; i < count; i++) {
				const x = random() * canvas.width;
				const y = random() * canvas.height;
				const size = random() * 1.5;
				ctx.fillStyle = `rgba(255, 255, 255, ${random()})`;
				ctx.beginPath();
				ctx.arc(x, y, size, 0, Math.PI * 2);
				ctx.fill();

				// Add a small glow effect to the stars
				if (Math.random() < 0.2) {
					ctx.globalAlpha = 0.3;
					ctx.beginPath();
					ctx.arc(x, y, size * 2, 0, Math.PI * 2);
					ctx.fill();
					ctx.globalAlpha = 1.0;
				}
			}
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawStars(100);
	}
</script>

<canvas bind:this={canvas} {...props}></canvas>

<div class="glow absolute top-0 aspect-square rounded-full"></div>

<div class="container absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2">
	<div class="planet"></div>
</div>

<style>
	.glow {
		left: -24rem;
		top: -12rem;
		width: 36rem;
		height: 36rem;
		background: var(--color-gray-400);
		opacity: 0.1;
		filter: blur(130px);
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

		box-shadow:
			inset -40px -16px 40px -16px #4b4f56,
			inset -20px -8px 10px -18px #fff,
			48px 26px 60px #adadad15;
	}
</style>
