import type { Actions } from "./$types";
import type { BatchItem } from "drizzle-orm/batch";

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
	const { rank, upvotes, downvotes, votes } = layoutData.posts.find((p) => p.slug === params.slug)!;

	return {
		post: {
			...post,
			content: renderContent(post),
			similar: getSimilar(post),
			upvotes,
			downvotes,
			votes,
			rank,
		},
	};
}

export const actions = {
	default: async ({ request, platform }) => {
		const formData = await request.formData();
		const fingerprint = formData.get("fingerprint")?.toString();
		const solutionId = formData.get("solutionId")?.toString();
		const newValue = parseInt(formData.get("value")?.toString() || "");

		if (!fingerprint || !solutionId || !platform?.env.db) {
			return fail(400, { message: "Missing data" });
		}

		if (newValue !== 1 && newValue !== -1) {
			return fail(400, { message: "Invalid vote value" });
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
			const ops: BatchItem<"sqlite">[] = [];
			let upvoteDelta = 0;
			let downvoteDelta = 0;

			if (!existing) {
				// New vote
				upvoteDelta = newValue === 1 ? 1 : 0;
				downvoteDelta = newValue === -1 ? 1 : 0;

				ops.push(db.insert(votes).values({ fingerprint, solutionId, value: newValue }));
			} else if (existing.value === newValue) {
				// Remove vote (Toggle off)
				upvoteDelta = newValue === 1 ? -1 : 0;
				downvoteDelta = newValue === -1 ? -1 : 0;

				ops.push(
					db
						.delete(votes)
						.where(and(eq(votes.fingerprint, fingerprint), eq(votes.solutionId, solutionId)))
				);
			} else {
				// Switch vote (e.g., Up -> Down)
				// If switching to Down (-1), upvote goes -1 and downvote goes +1
				upvoteDelta = newValue === 1 ? 1 : -1;
				downvoteDelta = newValue === -1 ? 1 : -1;
				ops.push(
					db
						.update(votes)
						.set({ value: newValue })
						.where(and(eq(votes.fingerprint, fingerprint), eq(votes.solutionId, solutionId)))
				);
			}

			// 3. Update both upvotes and downvotes
			ops.push(
				db
					.update(solutions)
					.set({
						upvotes: sql`${solutions.upvotes} + ${upvoteDelta}`,
						downvotes: sql`${solutions.downvotes} + ${downvoteDelta}`,
					})
					.where(eq(solutions.id, solutionId))
			);

			// 4. Run as batch (atomic transaction)
			await db.batch(ops as any);

			return { success: true };
		} catch (err) {
			console.error(err);
			return fail(500, { message: "Database error" });
		}
	},
} satisfies Actions;
