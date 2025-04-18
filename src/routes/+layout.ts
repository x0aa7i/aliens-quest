import { getAllSolutions } from "$lib/utils";

export const prerender = true;

export async function load() {
	const posts = getAllSolutions();
	return { posts };
}
