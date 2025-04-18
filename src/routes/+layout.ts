import { getAllSolutions } from "$lib/utils/content";

export const prerender = true;

export async function load() {
	const posts = getAllSolutions();
	return { posts };
}
