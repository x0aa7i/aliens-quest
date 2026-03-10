import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { defineConfig } from "drizzle-kit";

// if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const getSqlitePath = () => {
	try {
		return execSync(
			'find .wrangler/state/v3/d1/miniflare-D1DatabaseObject -type f -name "*.sqlite" -print -quit',
			{ encoding: "utf-8" }
		).trim();
	} catch (e) {
		console.error("Failed to find SQLite database file");
		return "";
	}
};

const getLocalD1 = () => {
	try {
		const basePath = path.resolve(".wrangler/state/v3/d1/miniflare-D1DatabaseObject/");
		const dbFile = fs
			.readdirSync(basePath, { encoding: "utf-8", recursive: false })
			.find((f) => f.endsWith(".sqlite"));

		console.log(dbFile);
		if (!dbFile) {
			throw new Error(`.sqlite file not found in ${basePath}`);
		}

		const url = path.resolve(basePath, dbFile);
		return url;
	} catch (err) {
		console.log(`Error  ${err}`);
	}
};

const localConfig = {
	dbCredentials: {
		url: getSqlitePath(),
	},
} as const;

const prodConfig = {
	driver: "d1-http",
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
		token: process.env.CLOUDFLARE_D1_TOKEN!,
	},
} as const;

export default defineConfig({
	schema: "./src/lib/server/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	verbose: true,
	strict: true,
	...(process.env.NODE_ENV === "production" ? prodConfig : localConfig),
});
