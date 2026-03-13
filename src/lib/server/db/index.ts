import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

/**
 * Get database instance from platform
 * Works with both local development (wrangler dev) and production
 */
export function getDb(platform: App.Platform | undefined) {
	if (!platform?.env?.db) {
		throw new Error(
			"D1 database binding not found. Make sure to run with wrangler dev or deploy to Cloudflare."
		);
	}

	return drizzle(platform.env.db, { schema });
}

// Export schema for convenience
export { schema };
