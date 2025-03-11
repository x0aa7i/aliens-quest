import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s } from "velite";

const about = defineCollection({
	name: "About", // collection type name
	single: true,
	pattern: "site/about.md", // content files glob pattern
	schema: s.object({
		title: s.string().max(99),
		content: s.markdown(), // transform markdown to html
	}),
});

const solutions = defineCollection({
	name: "Solution", // collection type name
	pattern: "solutions/**/index.md", // content files glob pattern
	schema: s
		.object({
			title: s.string().max(99),
			slug: s.path(), // auto generate slug from file path
			cover: s.image().optional().default("./cover.webp"), // input image relative path, output image object with blurImage.
			content: s.markdown(), // transform markdown to html
			toc: s.toc(),
			risk: s.number().min(1).max(5).optional(), // risk of the solution
			probability: s.number().min(1).max(5).optional(), // probability of the solution
		})
		// more additional fields (computed fields)
		.transform(async (data) => ({
			...data,
			slug: data.slug.replace(/^.*\//, ""),
			url: `/${data.slug}`,
			logo: await readSvgFile("../content/" + data.slug + "/logo.svg"),
			// sections: splitIntoSections(data.content),
			risk: getScale(data.risk),
			probability: getScale(data.probability),
		})),
});

export default defineConfig({
	output: {
		assets: "./static/assets",
		base: "/assets/",
	},
	markdown: {
		rehypePlugins: [rehypeSlug],
	},
	collections: { solutions, about },
});

const __dirname = dirname(fileURLToPath(import.meta.url));

async function readSvgFile(filePath: string): Promise<string> {
	try {
		const fullPath = join(__dirname, filePath);
		const svgContent = await readFile(fullPath, "utf-8");
		return svgContent;
	} catch (error) {
		console.error("Error reading SVG file:", error);
		throw error;
	}
}

function splitIntoSections(renderedHtml?: string): { title: string; content: string }[] {
	if (!renderedHtml) return [];
	const sections: { title: string; content: string }[] = [];

	// This regex matches an <h2> tag and its content, followed by any text (including newlines)
	// until the next <h2> tag or the end of the string.
	const regex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/gi;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(renderedHtml)) !== null) {
		const title = match[1].trim();
		const content = match[2].trim();
		sections.push({ title, content });
	}

	// Fallback: If no <h2> tags were found, return the entire HTML as one section.
	if (sections.length === 0) {
		sections.push({ title: "Overview", content: renderedHtml.trim() });
	}

	return sections;
}

export function getScale(value?: number): string | undefined {
	if (!value) return undefined;

	const scale = ["low", "medium", "high"] as const;
	return scale[value - 1] ?? (value > 3 ? "high" : "low");
}
