// code used to generate the stars background

import { random, setRandomSeed } from "$lib/utils/random";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const DEFAULT_STAR_COUNT = 60;
const RANDOM_SEED = 54; // 54

const WIDTH = 1600;
const HEIGHT = 900;

// Function to generate stars SVG
export function generateStars(svg?: SVGSVGElement | undefined) {
	svg = svg || document.createElementNS(SVG_NAMESPACE, "svg");
	svg.setAttribute("width", WIDTH.toString());
	svg.setAttribute("height", HEIGHT.toString());
	svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

	setRandomSeed(RANDOM_SEED);

	for (let i = 0; i < DEFAULT_STAR_COUNT; i++) {
		const x = random() * WIDTH;
		const y = random() * HEIGHT;
		const size = random() * 1.4;
		const opacity = random();

		const circle = document.createElementNS(SVG_NAMESPACE, "circle");
		circle.setAttribute("cx", Math.round(x).toString());
		circle.setAttribute("cy", Math.round(y).toString());
		circle.setAttribute("r", size.toFixed(2));
		circle.setAttribute("fill", `rgba(255,255,255,${opacity.toFixed(2)})`);

		svg.appendChild(circle);
	}
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
