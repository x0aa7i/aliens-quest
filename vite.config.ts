import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), Icons({ compiler: "svelte" })],
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: [".."],
		},
	},
});
