import { defineConfig } from "mdsx";
import rehypeSlug from "rehype-slug";

export const mdsxConfig = defineConfig({
	rehypePlugins: [rehypeSlug],
	extensions: [".md"],
});
