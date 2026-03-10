CREATE TABLE `solutions` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`total_score` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`fingerprint` text NOT NULL,
	`solution_id` text NOT NULL,
	`value` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`fingerprint`, `solution_id`),
	FOREIGN KEY (`solution_id`) REFERENCES `solutions`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "vote_value_check" CHECK("votes"."value" IN (1, -1))
);
--> statement-breakpoint
CREATE INDEX `votes_solution_id_idx` ON `votes` (`solution_id`);