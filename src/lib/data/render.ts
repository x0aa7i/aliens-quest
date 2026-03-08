import type { Solution } from "$content/index";

import { render } from "svelte/server";

import Maxim from "$lib/components/article/maxim.svelte";
import Metadata from "$lib/components/article/metadata.svelte";

const componentMap = {
	metadata: Metadata,
	maxim: Maxim,
} as const;

const componentProps = {
	metadata: ["risk", "probability"],
	maxim: [],
} as const satisfies Record<keyof typeof componentMap, string[]>;

type ComponentPayload = {
	type: keyof typeof componentMap;
	props: Record<string, unknown>;
};

export function renderContent({ content, ...meta }: Solution) {
	const regex = /<!--component-start:(.*?)-->([\s\S]*?)<!--component-end-->/g;

	return content.replace(regex, (_, json, innerHtml) => {
		try {
			const { type, props } = JSON.parse(json) as ComponentPayload;
			const Component = componentMap[type];

			if (!Component) {
				console.warn(`Component type "${type}" not found in componentMap.`);
				return "";
			}

			// filter allowed fields
			const allowedFields = componentProps[type] || [];
			const filteredMeta = Object.fromEntries(
				allowedFields.map((key) => [key, meta[key]]).filter(([, v]) => v !== undefined)
			);

			const mergedProps = { ...filteredMeta, ...props, innerHtml };
			const { body } = render(Component, { props: mergedProps as any });

			return body;
		} catch (error) {
			console.error("Failed to parse component JSON:", error);
			return "";
		}
	});
}
