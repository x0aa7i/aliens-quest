import { eq } from "drizzle-orm";

import { getAllSolutions } from "$lib/data/content";
import { getDb } from "$lib/server/db/index.js";
import { solutions, votes } from "$lib/server/db/schema.js";

export async function load({ platform, cookies }) {
	const posts = getAllSolutions();

	const db = getDb(platform);
	const score = await db
		.select({ id: solutions.id, totalScore: solutions.totalScore })
		.from(solutions);

	const scoreMap = new Map(score.map((s) => [s.id, s.totalScore]));
	const mergedPosts = posts.map((post) => ({
		...post,
		score: scoreMap.get(post.slug) ?? 0,
	}));

	// const userVotesRes = await fetch("/api/votes");
	// const userVotes = (await userVotesRes.json()) as Record<string, number>;

	const fingerprint = cookies.get("alienId");
	if (!fingerprint) return { posts: mergedPosts, userVotes: {} };

	// Fetch all votes for this specific device
	const results = await db
		.select({ solutionId: votes.solutionId, value: votes.value })
		.from(votes)
		.where(eq(votes.fingerprint, fingerprint));

	// Convert to a clean object: { "sol_1": 1, "sol_2": -1 }
	const userVotes = results.reduce(
		(acc, curr) => {
			acc[curr.solutionId] = curr.value;
			return acc;
		},
		{} as Record<string, number>
	);

	return { posts: mergedPosts, userVotes };
}
