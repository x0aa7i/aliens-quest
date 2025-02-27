import { getAllSolutions } from "$lib/solutions";

export async function load() {
	return {
		posts: await getAllSolutions()
	};
}
