import { getAllSolutions } from "$lib/solutions";

export const prerender = true;

export async function load() {
	return {
		posts: await getAllSolutions()
	};
}
