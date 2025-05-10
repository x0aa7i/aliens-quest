import { defineMDSveXConfig } from "mdsvex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

export const mdsvexConfig = defineMDSveXConfig({
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{ properties: { className: ["anchor"], ariaLabel: "Link to section" }, behavior: "append" },
		],
	],
	extensions: [".md"],
});
