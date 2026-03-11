import { eq } from "drizzle-orm";

import { getAllSolutions } from "$lib/data/content";
import { VISITOR_ID_COOKIE_NAME } from "$lib/hooks/fingerprint.svelte.js";
import { getDb } from "$lib/server/db/index.js";
import { solutions, votes } from "$lib/server/db/schema.js";

export async function load({ platform, cookies }) {
	const posts = getAllSolutions();
	const fingerprint = cookies.get(VISITOR_ID_COOKIE_NAME);

	const db = getDb(platform);
	const score = await db
		.select({ id: solutions.id, upvotes: solutions.upvotes, downvotes: solutions.downvotes })
		.from(solutions);

	const scoreMap = new Map(score.map((s) => [s.id, s]));

	const mergedPosts = posts
		.map((post) => {
			const voteData = scoreMap.get(post.slug);
			const upvotes = voteData?.upvotes ?? 0;
			const downvotes = voteData?.downvotes ?? 0;

			return {
				...post,
				upvotes,
				downvotes,
				score: upvotes - downvotes,
				votes: upvotes + downvotes,
			};
		})
		.sort((a, b) => b.votes - a.votes || b.score - a.score || a.slug.localeCompare(b.slug))
		.map((post, index) => ({
			...post,
			rank: index + 1,
		}));

	// const userVotesRes = await fetch("/api/votes");
	// const userVotes = (await userVotesRes.json()) as Record<string, number>;

	let userVotes: Record<string, number> = {};
	if (fingerprint) {
		// Fetch all votes for this specific device
		const result = await db
			.select({ solutionId: votes.solutionId, value: votes.value })
			.from(votes)
			.where(eq(votes.fingerprint, fingerprint));

		// Convert to a clean object: { "sol_1": 1, "sol_2": -1 }
		userVotes = Object.fromEntries(result.map((v) => [v.solutionId, v.value]));
	}

	return { posts: mergedPosts, userVotes };
}
