import type { Book, Movie, Tv } from "./src/lib/utils/media";

import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { defineCollection, defineConfig, s, z } from "velite";

import { getBook, getMovie, getTv } from "./src/lib/utils/media";

const currentDir = dirname(fileURLToPath(import.meta.url));
const __dirname = join(currentDir, "..");

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

const fetcherMap = {
	movie: getMovie,
	tv: getTv,
	book: getBook,
};

const formatBadges = ({ badges, type }: MediaObject): string[] => {
	return badges ?? [type === "tv" ? "TV Series" : type === "book" ? "Novel" : type];
};

async function loadMedia(media?: MediaObject[]): Promise<(Movie | Tv | Book)[]> {
	if (!media?.length) return [];

	const fetchMedia = async (obj: MediaObject) => {
		if (!obj) return;
		const fetcher = fetcherMap[obj.type];
		if (!fetcher) return;
		return { ...(await fetcher(obj.id)), ...obj, badges: formatBadges(obj) };
	};

	const result = await Promise.all(media.map(fetchMedia));
	return result.filter((item): item is Movie | Tv | Book => !!item);
}

const SCALES = {
	risk: ["trivial", "marginal", "significant", "catastrophic", "existential"] as const,
	probability: ["extremely unlikely", "unlikely", "plausible", "likely", "highly likely"] as const,
};

function getScale(value: number | undefined, type: "risk" | "probability"): string | undefined {
	if (!value || value < 1 || value > 5) return undefined;
	return SCALES[type][value - 1];
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

const mediaObject = s.object({
	type: s.enum(["movie", "tv", "book"]),
	id: s.string(),
	overview: s.string().optional(),
	badges: s.string().array().optional(),
});

type MediaObject = z.infer<typeof mediaObject>;

const solutions = defineCollection({
	name: "Solution",
	pattern: "solutions/**/index.md",
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
			media: mediaObject.array().optional(),
		})
		// more additional fields (computed fields)
		.transform(async (data) => ({
			...data,
			slug: data.slug.replace(/^.*\//, ""),
			url: `/${data.slug}`,
			logo: await readSvgFile("./src/content/" + data.slug + "/logo.svg"),
			risk: getScale(data.risk, "risk"),
			probability: getScale(data.probability, "probability"),
			media: await loadMedia(data.media),
		})),
});

export default defineConfig({
	root: "./src/content",
	output: {
		assets: "./static/assets",
		base: "/assets/",
	},
	markdown: {
		rehypePlugins: [],
	},
	collections: { solutions, about },
});
