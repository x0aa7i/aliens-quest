import { getSolution } from "$lib/utils/content";

export async function load({ params }) {
	const post = await getSolution(params.slug);
	return { post };
}
