import type { Solution } from "$content/index";

import { solutions } from "$content/index";

export function getSolutionMetadata(slug: string) {
	return solutions.find(({ slug: postSlug }) => postSlug === slug);
}

export function getAllSolutions() {
	return solutions.map(({ title, url, cover, logo, slug }) => ({ title, url, cover, logo, slug }));
}

export function getSolution(slug: string) {
	return solutions.find(({ slug: postSlug }) => postSlug === slug);
}

export function getSimilar(current: Solution) {
	const similarPosts = solutions
		.filter((p) => p.slug !== current.slug)
		.map((a) => ({
			...a,
			score:
				(a.tags?.filter((t) => current.tags?.includes(t)).length || 0) * 2 +
				(a.probability === current.probability ? 1 : 0) +
				(a.risk === current.risk ? 1 : 0),
		}))
		.sort((a, b) => b.score - a.score)
		.slice(0, 3);

	return similarPosts.map(({ title, url, cover, logo, slug }) => ({
		title,
		url,
		cover,
		logo,
		slug,
	}));
}

/**
 * Split HTML by H2 headings
 * Designed for simple, well-formed HTML output from Velite
 */

export interface Section {
	id: string;
	title: string;
	html: string;
}

/**
 * Splits HTML content by H2 headings into sections
 * @param html - HTML string from Velite markdown conversion
 * @returns Array of sections with id, title, and html
 */
export function splitHtmlByH2(html: string): Section[] {
	if (!html || typeof html !== "string") {
		return [];
	}

	const sections: Section[] = [];
	const h2Regex = /<h2[^>]*>([^<]+)<\/h2>/g;
	let lastIndex = 0;
	let match;

	while ((match = h2Regex.exec(html)) !== null) {
		// Add previous section's content if not first heading
		if (sections.length > 0 && lastIndex > 0) {
			sections[sections.length - 1].html = html.substring(lastIndex, match.index).trim();
		}

		const title = match[1].trim();
		const id = title
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-+|-+$/g, "");

		sections.push({
			id: id || "section",
			title,
			html: "",
		});

		lastIndex = match.index + match[0].length;
	}

	// Add final section's content
	if (sections.length > 0) {
		sections[sections.length - 1].html = html.substring(lastIndex).trim();
	}

	return sections;
}
