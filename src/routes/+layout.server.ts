import { solutions } from "$content/index";

export const prerender = true;

export async function load() {
	const posts = solutions.map((post) => ({
		title: post.title,
		url: post.url,
		cover: post.cover,
		logo: post.logo,
	}));

	return { posts };
}
