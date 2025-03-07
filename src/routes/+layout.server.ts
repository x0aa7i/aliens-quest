import { solutions } from "$content/index";

export const prerender = true;

export async function load() {
	const posts = solutions.map(({ content: _, ...rest }) => ({
		...rest,
	}));

	return { posts };
}
