import { writeFileSync } from "fs";

import data from "../.velite/solutions.json";

const values = data.map((s) => `('${s.slug}', '${s.title.replace(/'/g, "''")}')`).join(",\n  ");
const sql = `INSERT OR REPLACE INTO solutions (id, title) VALUES\n  ${values};`;

writeFileSync("scripts/seed.sql", sql);
console.log(`Generated seed.sql with ${data.length} solutions.`);
