import { sql } from "drizzle-orm";
import { check, index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 1. Solutions Table
// We store the aggregate score here to keep reads lightning fast.
export const solutions = sqliteTable("solutions", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	// Denormalized score for instant display
	totalScore: integer("total_score").notNull().default(0),
});

// 2. Votes Table
// We use the fingerprint as a unique identifier to prevent double-voting.
export const votes = sqliteTable(
	"votes",
	{
		// Composite Primary Key: One fingerprint per solution
		fingerprint: text("fingerprint").notNull(),
		solutionId: text("solution_id")
			.notNull()
			.references(() => solutions.id, { onDelete: "cascade" }),
		// Value: 1 for upvote, -1 for downvote
		value: integer("value").notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
	},
	(table) => [
		primaryKey({ columns: [table.fingerprint, table.solutionId] }),
		// Critical for aggregation queries: SELECT SUM(value) WHERE solutionId = ?
		index("votes_solution_id_idx").on(table.solutionId),
		// Enforce vote values at the DB level
		check("vote_value_check", sql`${table.value} IN (1, -1)`),
	]
);

export type Solution = typeof solutions.$inferSelect;
export type InsertSolution = typeof solutions.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = typeof votes.$inferInsert;
