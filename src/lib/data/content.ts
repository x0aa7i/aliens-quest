import { solutions } from "$content/index";

export function getSolutionMetadata(slug: string) {
	return solutions.find(({ slug: postSlug }) => postSlug === slug);
}

export function getAllSolutions() {
	return solutions.map(({ title, url, cover, logo, slug }) => ({ title, url, cover, logo, slug }));
}

export function getSolution(slug: string) {
	return solutions.find(({ slug: postSlug }) => postSlug === slug);
}
