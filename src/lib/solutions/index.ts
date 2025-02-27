import type { Component } from "svelte";

export async function getAllSolutions() {
	const paths = import.meta.glob("./*.md");

	const posts = await Promise.all(
		Object.entries(paths).map(async ([path, resolver]) => {
			const slug = path.replace("./", "").replace(".md", "");
			const { metadata } = (await resolver()) as { metadata: Metadata };
			return { slug, ...metadata };
		})
	);

	return posts;
}

export async function getSolution(slug: string) {
	const source = await import(`./${slug}.md`);

	return {
		meta: source.metadata as Metadata,
		content: source.default as Component
	};
}

export interface Metadata {
	title: string;
	slug?: string;
	date?: string;
	image: string;
	mortality: number;
	probability: number;
}
