import type { Solution } from "$content/index";

export type SidebarItem = Pick<Solution, "title" | "url" | "logo">;
