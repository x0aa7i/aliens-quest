import process from "process";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	return {
		plugins: [sveltekit(), tailwindcss(), Icons({ compiler: "svelte" })],
		server: {
			allowedHosts: env.VITE_ALLOWED_HOSTS?.split(",") ?? [],
			fs: {
				// Allow serving files from one level up to the project root
				allow: [".."],
			},
		},
	};
});
