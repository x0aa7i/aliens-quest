import { error } from "@sveltejs/kit";

import { getSolution } from "$lib/solutions";

export async function load({ params }) {
	try {
		return getSolution(params.slug);
	} catch {
		throw error(404, "Post not found");
	}
}
