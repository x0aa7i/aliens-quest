import { random, setRandomSeed } from "$lib/utils/random";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

// Function to generate stars SVG
export function generateStars(svg?: SVGSVGElement | undefined) {
	const DEFAULT_STAR_COUNT = 200;
	const RANDOM_SEED = 55; // 54
	const WIDTH = 1600;
	const HEIGHT = 900;

	svg = svg || document.createElementNS(SVG_NAMESPACE, "svg");
	svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
	setRandomSeed(RANDOM_SEED);

	const defs = document.createElementNS(SVG_NAMESPACE, "defs");
	// Define discrete sizes
	const sizes = [0.4, 0.8, 1.2, 1.4];
	sizes.forEach((r, i) => {
		const circle = document.createElementNS(SVG_NAMESPACE, "circle");
		circle.setAttribute("id", `s${i}`);
		circle.setAttribute("r", r.toString());
		// circle.setAttribute("cx", "0");
		// circle.setAttribute("cy", "0");
		circle.setAttribute("fill", "white");
		defs.appendChild(circle);
	});
	svg.appendChild(defs);

	// Bucket stars by quantized opacity
	const buckets = new Map<string, { sizeIdx: number; x: number; y: number }[]>();

	for (let i = 0; i < DEFAULT_STAR_COUNT; i++) {
		const x = Math.round(random() * WIDTH);
		const y = Math.round(random() * HEIGHT);
		const sizeIdx = Math.floor(random() * sizes.length);
		const opacity = (Math.round(random(0.25, 1) * 20) / 20).toFixed(2); // 0.05 steps

		if (!buckets.has(opacity)) buckets.set(opacity, []);
		buckets.get(opacity)!.push({ sizeIdx, x, y });
	}

	// One <g fill-opacity="X"> per bucket, <use> elements inside have no opacity attr
	for (const [opacity, stars] of buckets) {
		const g = document.createElementNS(SVG_NAMESPACE, "g");
		g.setAttribute("fill-opacity", opacity);

		for (const { sizeIdx, x, y } of stars) {
			const use = document.createElementNS(SVG_NAMESPACE, "use");
			use.setAttribute("href", `#s${sizeIdx}`);
			use.setAttribute("x", x.toString());
			use.setAttribute("y", y.toString());
			g.appendChild(use);
		}

		svg.appendChild(g);
	}
}

export function generateWaves({
	svg,
	width = 900,
	seed = 1,
}: {
	svg?: SVGSVGElement;
	width?: number;
	seed?: number;
} = {}) {
	svg = svg || document.createElementNS(SVG_NAMESPACE, "svg");

	const BAR_STEP = 6;
	const MAX_H = 28;
	const HEIGHT = 28;
	const centerY = HEIGHT / 2;

	setRandomSeed(seed);

	const barsNeeded = Math.ceil(width / BAR_STEP);

	function generateHeight(step: number) {
		const freq = Math.sin(step * 1.2) * 8;
		const variation = Math.sin(step * 0.5) * 8;
		const noise = (random() - 0.5) * 10;
		return Math.max(4, Math.min(MAX_H, 16 + freq + variation + noise));
	}

	// Build a single path: M x y h 1 v barH h -1 z per bar
	const d = Array.from({ length: barsNeeded }, (_, i) => {
		const barH = Math.floor(generateHeight(i));
		const x = i * BAR_STEP;
		const y = Math.round(centerY - barH / 2);
		return `M${x},${y}h1v${barH}h-1z`;
	}).join("");

	svg.setAttribute("viewBox", `0 0 ${width} ${HEIGHT}`);
	svg.setAttribute("width", width.toString());
	svg.setAttribute("height", HEIGHT.toString());
	svg.setAttribute("preserveAspectRatio", "none");
	svg.setAttribute("style", `width: ${width}px; height: 100%; display: block;`);

	const path = document.createElementNS(SVG_NAMESPACE, "path");
	path.setAttribute("d", d);
	path.setAttribute("fill", "white");

	svg.appendChild(path);

	return svg;
}

// Function to download the generated SVG
export function saveSvgToFile(svg: SVGSVGElement) {
	const serializer = new XMLSerializer();
	const svgString = serializer.serializeToString(svg);
	const blob = new Blob([svgString], { type: "image/svg+xml" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "stars.svg";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
