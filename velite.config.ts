import type { Movie, Novel, Series } from "./src/lib/data/media";

import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import { defineCollection, defineConfig, s, z } from "velite";

import { remarkDirectivePlaceholders } from "$lib/utils/remark";

import { getMedia } from "./src/lib/data/media";

// Constants

const __root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SCALES = ["low", "moderate", "high"] as const;

// Schemas

const mediaObject = s.object({
	id: s.string(),
	type: s.enum(["movie", "series", "novel"]),
	overview: s.string().optional(),
});

// see docs/tags.md for more info
const tagEnum = s.enum([
	"hiding",
	"invisible",
	"optimistic",
	"pessimistic",
	"philosophical",
	"physical",
	"rare",
	"scientific",
	"sociological",
	"speculative",
	"temporal",
]);

type MediaObject = z.infer<typeof mediaObject>;

// Helpers

async function readSvgFile(filePath: string): Promise<string> {
	try {
		return await readFile(join(__root, filePath), "utf-8");
	} catch (error) {
		console.error("Error reading SVG file:", error);
		throw error;
	}
}

function getScale(value: number | string | undefined): string | undefined {
	if (typeof value === "string") return value;
	if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
	return SCALES[Math.max(1, Math.min(3, value)) - 1];
}

async function loadMedia(media?: MediaObject[]): Promise<(Movie | Series | Novel)[]> {
	if (!media?.length) return [];

	const results = await Promise.all(
		media.map(async (obj) => {
			const data = await getMedia(obj.id, obj.type);
			if (!data) return null;
			return { ...data, ...obj };
		})
	);

	return results.filter((item): item is Movie | Series | Novel => item !== null);
}

// Collections

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
	name: "Solution",
	pattern: "solutions/**/index.md",
	schema: s
		.object({
			title: s.string().max(99),
			slug: s.path(), // auto generate slug from file path
			cover: s.image().optional().default("./cover.webp"), // input image relative path, output image object with blurImage.
			content: s.markdown(), // transform markdown to html
			// excerpt: s.excerpt(), // used in meta description
			toc: s.toc(),
			risk: s.number().min(1).max(3).optional(), // risk of the solution
			maxim: s.string().optional(),
			probability: s.number().min(1).max(3).optional(), // probability of the solution
			media: s.array(mediaObject).optional(),
			tags: s.array(tagEnum).optional(),
		})
		// more additional fields (computed fields)
		.transform(async (data) => ({
			...data,
			slug: data.slug.replace(/^.*\//, ""),
			url: `/${data.slug}`,
			logo: await readSvgFile("./content/" + data.slug + "/logo.svg"),
			risk: getScale(data.risk),
			probability: getScale(data.probability),
			media: await loadMedia(data.media),
		})),
});

// Config

export default defineConfig({
	root: "./content",
	collections: { solutions, about },
	output: {
		assets: "./static/assets",
		base: "/assets/",
		clean: true,
	},
	markdown: {
		rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
		remarkPlugins: [remarkDirective, remarkDirectivePlaceholders],
	},
});
