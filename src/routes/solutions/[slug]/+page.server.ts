import { error } from "@sveltejs/kit";

import { solutions } from "$content/index";

export async function load({ params }) {
	const post = solutions.find(({ slug }) => slug === params.slug);
	if (!post) {
		throw error(404, "Post not found");
	}

	return { post };
}
