import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
// import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s } from "velite";

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

export function getScale(value?: number): string | undefined {
	if (!value) return undefined;

	const scale = ["low", "medium", "high"] as const;
	return scale[value - 1] ?? (value > 3 ? "high" : "low");
}

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
			// content: s.markdown(), // transform markdown to html
			excerpt: s.excerpt(), // used in meta description
			toc: s.toc(),
			risk: s.number().min(1).max(5).optional(), // risk of the solution
			probability: s.number().min(1).max(5).optional(), // probability of the solution
		})
		// more additional fields (computed fields)
		.transform(async (data) => ({
			...data,
			slug: data.slug.replace(/^.*\//, ""),
			url: `/${data.slug}`,
			logo: await readSvgFile("../src/content/" + data.slug + "/logo.svg"),
			risk: getScale(data.risk),
			probability: getScale(data.probability),
		})),
});

export default defineConfig({
	root: "./src/content",
	output: {
		assets: "./static/assets",
		base: "/assets/",
	},
	// markdown: {
	// 	rehypePlugins: [rehypeSlug],
	// },
	collections: { solutions, about },
});
