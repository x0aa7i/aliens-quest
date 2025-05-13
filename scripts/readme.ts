import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const solutionsDir = path.join(process.cwd(), "src/content/solutions");
const readmePath = path.join(process.cwd(), "README.md");

type Solution = {
	title: string;
	overview?: string;
	slug: string;
};

async function getSolutions(): Promise<Solution[]> {
	const slugs = await fs.readdir(solutionsDir);
	const solutions = await Promise.all(
		slugs.map(async (slug) => {
			const filePath = path.join(solutionsDir, slug, "index.md");
			try {
				const file = await fs.readFile(filePath, "utf-8");
				const { data } = matter(file);
				if (!data.title) return null;
				return {
					title: data.title,
					overview: data.overview?.replace(/\n/g, " ") || "",
					slug,
				};
			} catch {
				return null;
			}
		})
	);
	return solutions.filter(Boolean) as Solution[];
}

function formatTable(solutions: Solution[]): string {
	const header = `| Title | Overview | Link |\n|-------|----------|------|`;
	const rows = solutions.map((s) => {
		const title = `[${s.title}](./src/content/solutions/${s.slug}/index.md)`;
		const link = `<a href="https://aliensquest.com/solutions/${s.slug}" target="_blank">↗️</a>`;
		return `| ${title} | ${s.overview} | ${link} |`;
	});
	return [header, ...rows].join("\n");
}

async function updateReadme() {
	try {
		const content = await fs.readFile(readmePath, "utf-8");
		const solutions = await getSolutions();
		const table = formatTable(solutions);

		const startMarker = "## 🌌 Solutions";
		const endMarker = "## "; // next heading (use to detect where solutions section ends)

		const start = content.indexOf(startMarker);
		const end =
			content.indexOf(endMarker, start + startMarker.length) !== -1
				? content.indexOf(endMarker, start + startMarker.length)
				: content.length;

		const updatedContent =
			content.slice(0, start) + startMarker + "\n\n" + table + "\n\n" + content.slice(end);

		await fs.writeFile(readmePath, updatedContent.trim() + "\n");
		console.log("✅ README.md updated with solutions table.");
	} catch (error) {
		console.error("Error updating README.md:", error);
	}
}

updateReadme();
