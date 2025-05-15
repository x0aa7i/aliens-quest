import { getAllSolutions } from "$lib/data/content";

export const prerender = true;

export async function load() {
	const posts = getAllSolutions();
	return { posts };
}
