import { error } from "node:console";

import { getSolution } from "$lib/data/content";
import { renderContent } from "$lib/data/render.js";

export function load({ params }) {
	const post = getSolution(params.slug);

	if (!post) throw error(404, "Not found");

	const content = renderContent(post);
	return { post: { ...post, content } };
}
