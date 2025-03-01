import type { Component } from "svelte";

export async function getAllSolutions() {
	const paths = import.meta.glob("./*.md");
	const logos = import.meta.glob("./logos/*.svg", { query: "raw", import: "default" });

	const posts = await Promise.all(
		Object.entries(paths).map(async ([path, resolver]) => {
			const slug = path.replace("./", "").replace(".md", "") as string;
			const { metadata } = (await resolver()) as { metadata: Metadata };

			const logo = logos[`./logos/${slug}.svg`];
			if (logo !== undefined) {
				metadata.logo = (await logo()) as string;
			}

			return { ...metadata, slug };
		})
	);

	return posts;
}

export async function getSolution(slug: string) {
	const source = await import(/* @vite-ignore */ `./${slug}.md`);

	return {
		meta: source.metadata as Metadata,
		content: source.default as Component
	};
}

export interface Metadata {
	title: string;
	slug: string;
	date?: string;
	image: string;
	logo?: string;
	mortality: number;
	probability: number;
}
