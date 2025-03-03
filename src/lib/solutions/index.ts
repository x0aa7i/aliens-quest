import type { Component } from "svelte";

export async function getAllSolutions() {
	const paths = import.meta.glob("./**/index.md");
	const logos = import.meta.glob("./**/logo.svg", { query: "raw", import: "default" });
	const covers = import.meta.glob("./**/cover.webp");

	const posts = await Promise.all(
		Object.entries(paths).map(async ([path, resolver]) => {
			const slug = path.replace("./", "").replace("/index.md", "") as string;
			const { metadata } = (await resolver()) as { metadata: Metadata };

			const logoPath = `./${slug}/logo.svg`;
			if (logos[logoPath]) {
				metadata.logo = (await logos[logoPath]()) as string;
			}

			const coverPath = `./${slug}/cover.webp`;
			if (covers[coverPath]) {
				try {
					metadata.cover = ((await covers[coverPath]()) as { default: string })?.default;
				} catch (error) {
					console.error("Failed to load cover:", error);
				}
			} else {
				console.warn("Cover not found or not a function for slug:", slug);
			}

			return { ...metadata, slug };
		})
	);

	return posts;
}

export async function getSolution(slug: string) {
	const source = await import(/* @vite-ignore */ `./${slug}/index.md`);
	const cover = await import(/* @vite-ignore */ `./${slug}/cover.webp`);

	return {
		meta: source.metadata as Metadata,
		content: source.default as Component,
		cover: cover.default as string
	};
}

export interface Metadata {
	title: string;
	slug: string;
	date?: string;
	image: string;
	logo?: string;
	cover?: string;
	mortality: number;
	probability: number;
}
