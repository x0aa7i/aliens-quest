import { defineConfig } from "mdsx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

export const mdsxConfig = defineConfig({
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{ properties: { className: ["anchor"], ariaLabel: "Link to section" }, behavior: "append" },
		],
	],
	extensions: [".md"],
});
