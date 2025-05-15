import { getSolution } from "$lib/data/content";

export async function load({ params }) {
	const post = await getSolution(params.slug);
	return { post };
}
