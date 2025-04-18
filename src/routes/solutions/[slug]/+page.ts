import { getSolution } from "$lib/utils.js";

export async function load({ params }) {
	const post = await getSolution(params.slug);
	return { post };
}
