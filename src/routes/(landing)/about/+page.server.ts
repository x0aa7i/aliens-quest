import type { PageServerLoad } from "./$types";

import { about } from "$content/index";

export const load: PageServerLoad = async () => {
	return { about };
};
