import type { Actions } from "./$types";

import { error } from "node:console";
import { fail } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";

import { getSimilar, getSolution } from "$lib/data/content";
import { renderContent } from "$lib/data/render.js";
import { getDb } from "$lib/server/db/index.js";
import { solutions, votes } from "$lib/server/db/schema";

export async function load({ params, parent }) {
	const post = getSolution(params.slug);
	if (!post) throw error(404, "Not found");

	const layoutData = await parent();
	const { score, rank } = layoutData.posts.find((p) => p.slug === params.slug)!;

	return {
		post: {
			...post,
			content: renderContent(post),
			similar: getSimilar(post),
			score,
			rank,
		},
	};
}

export const actions = {
	default: async ({ request, platform }) => {
		const formData = await request.formData();
		const fingerprint = formData.get("fingerprint")?.toString();
		const solutionId = formData.get("solutionId")?.toString();
		const newValue = parseInt(formData.get("value")?.toString() || "0");

		if (!fingerprint || !solutionId || !platform?.env.db) {
			return fail(400, { message: "Missing data" });
		}

		const db = getDb(platform);

		try {
			// 1. Check if an existing vote exists
			const existing = await db
				.select()
				.from(votes)
				.where(and(eq(votes.fingerprint, fingerprint), eq(votes.solutionId, solutionId)))
				.get();

			// 2. Determine action & calculate score delta
			let scoreDelta = 0;
			const operations: any[] = [];

			if (existing) {
				if (existing.value === newValue) {
					// User clicked same button again → REMOVE vote
					scoreDelta = -existing.value;
					operations.push(
						db
							.delete(votes)
							.where(and(eq(votes.fingerprint, fingerprint), eq(votes.solutionId, solutionId)))
					);
				} else {
					// User switched vote (e.g., -1 → 1)
					scoreDelta = newValue - existing.value;
					operations.push(
						db
							.insert(votes)
							.values({ fingerprint, solutionId, value: newValue })
							.onConflictDoUpdate({
								target: [votes.fingerprint, votes.solutionId],
								set: { value: newValue },
							})
					);
				}
			} else {
				// First time voting
				scoreDelta = newValue;
				operations.push(db.insert(votes).values({ fingerprint, solutionId, value: newValue }));
			}

			// 3. Always update the score
			operations.push(
				db
					.update(solutions)
					.set({ totalScore: sql`${solutions.totalScore} + ${scoreDelta}` })
					.where(eq(solutions.id, solutionId))
			);

			// 4. Run as batch (atomic transaction)
			await db.batch(operations as any);

			return { success: true };
		} catch (err) {
			console.error(err);
			return fail(500, { message: "Database error" });
		}
	},
} satisfies Actions;
