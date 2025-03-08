// code used to generate the stars background
//
import { random, setRandomSeed } from "$lib/utils/random";

function resizeCanvas(canvas: HTMLCanvasElement) {
	if (!canvas || !window.innerWidth || !window.innerHeight) return;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	if (!canvas || !ctx) return;
	resizeCanvas(canvas);

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

			// Removed for svg export
			// Add a small glow effect to the stars
			// if (Math.random() < 0.2) {
			// 	ctx.globalAlpha = 0.3;
			// 	ctx.beginPath();
			// 	ctx.arc(x, y, size * 2, 0, Math.PI * 2);
			// 	ctx.fill();
			// 	ctx.globalAlpha = 1.0;
			// }
		}
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawStars(100);
}

export function renderCanvas(canvas: HTMLCanvasElement) {
	if (!canvas) return;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	resizeCanvas(canvas);
	render(ctx, canvas);

	window.addEventListener("resize", () => {
		render(ctx, canvas);
	});

	return () => {
		window.removeEventListener("resize", () => {
			render(ctx, canvas);
		});
	};
}

export function canvasToSvg(canvas: HTMLCanvasElement) {
	console.log("click");
	const dataUrl = canvas.toDataURL("image/png");
	const img = new Image();
	img.src = dataUrl;
	img.onload = () => {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("width", canvas.width.toString());
		svg.setAttribute("height", canvas.height.toString());
		const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
		foreignObject.setAttribute("width", "100%");
		foreignObject.setAttribute("height", "100%");
		foreignObject.innerHTML = `<img src="${dataUrl}" />`;
		svg.appendChild(foreignObject);
		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(svg);
		const blob = new Blob([svgString], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "canvas.svg";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
}
