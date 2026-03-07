<script lang="ts">
	import { onMount } from "svelte";

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let containerWidth = $state(0);

	// Config
	const BAR_WIDTH = 1;
	const BAR_STEP = 6;
	const UPDATE_INTERVAL = 1000;
	const MAX_H = 28;

	let barHeights = $state<number[]>([]);
	let waveTime = 0;

	function capacity() {
		return containerWidth > 0 ? Math.ceil(containerWidth / BAR_STEP) : 100;
	}

	function generateHeight(step: number) {
		const freq = Math.sin(step * 1.2) * 8;
		const variation = Math.sin(step * 0.5) * 8;
		const noise = (Math.random() - 0.5) * 10;
		const base = 16;
		return Math.max(4, Math.min(MAX_H, base + freq + variation + noise));
	}

	function update() {
		waveTime += 1;
		const cap = capacity();

		// If container grew, pad left with generated bars; if shrank, trim
		if (barHeights.length < cap) {
			const missing = cap - barHeights.length;
			const padding = Array.from({ length: missing }, (_, i) =>
				generateHeight(waveTime - missing + i)
			);
			barHeights = [
				...padding,
				...barHeights.slice(-(cap - missing - 1)),
				generateHeight(waveTime),
			];
		} else {
			barHeights = [...barHeights.slice(-(cap - 1)), generateHeight(waveTime)];
		}

		draw();
	}

	function draw() {
		if (!ctx || !canvas || containerWidth === 0) return;

		const dpr = window.devicePixelRatio || 1;
		const w = containerWidth;
		const h = 28;

		// Set backing store size
		canvas.width = w * dpr;
		canvas.height = h * dpr;

		// Scale context so all drawing uses CSS pixel coordinates
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = "#D9D9D9";
		ctx.globalAlpha = 0.75;

		const centerY = h / 2;
		const cap = capacity();

		barHeights.forEach((barH, i) => {
			// Distribute bars evenly across full width
			const x = (i / cap) * w;
			const y = centerY - barH / 2;
			ctx!.fillRect(Math.floor(x), Math.floor(y), BAR_WIDTH, Math.floor(barH));
		});
	}

	onMount(() => {
		ctx = canvas.getContext("2d");

		// containerWidth is bound and will be set before first effect runs,
		// but guard with fallback anyway
		const cap = capacity();
		const initialWave: number[] = [];
		for (let i = 0; i < cap; i++) {
			initialWave.push(generateHeight(i));
		}
		barHeights = initialWave;
		waveTime = cap;

		const interval = setInterval(update, UPDATE_INTERVAL);
		draw();

		return () => clearInterval(interval);
	});

	// Redraw + resize barHeights array whenever container width changes
	$effect(() => {
		if (!containerWidth) return;

		const cap = capacity();
		if (barHeights.length !== cap) {
			if (barHeights.length < cap) {
				// Pad left with generated history
				const missing = cap - barHeights.length;
				const padding = Array.from({ length: missing }, (_, i) =>
					generateHeight(waveTime - missing + i)
				);
				barHeights = [...padding, ...barHeights];
			} else {
				// Trim oldest (leftmost) bars
				barHeights = barHeights.slice(barHeights.length - cap);
			}
		}

		draw();
	});
</script>

<div class="flex w-full items-center px-12" bind:clientWidth={containerWidth}>
	<canvas bind:this={canvas} style="width: 100%;"></canvas>
</div>
