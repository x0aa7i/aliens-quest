import type { Solution } from "$content/index";
import type { Component } from "svelte";

import { error } from "@sveltejs/kit";

import { solutions } from "$content/index";

export type DocResolver = () => Promise<{ default: Component; metadata: Solution }>;

function slugFromPath(path: string) {
	return path.replace("/src/content/solutions/", "").replace("/index.md", "");
}

export function getSolutionMetadata(slug: string) {
	return solutions.find(({ slug: postSlug }) => postSlug === slug);
}

export function getAllSolutions() {
	return solutions.map(({ title, url, cover, logo, slug }) => ({ title, url, cover, logo, slug }));
}

export async function getSolution(slug: string) {
	const modules = import.meta.glob("/src/content/solutions/**/index.md");

	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === slug) {
			match = { path, resolver: resolver as DocResolver };
			break;
		}
	}

	const doc = await match?.resolver?.();
	const metadata = getSolutionMetadata(slug);

	if (!doc || !metadata) {
		error(404, `Solution '${slug}' not found`);
	}

	return {
		component: doc.default,
		metadata,
	};
}
