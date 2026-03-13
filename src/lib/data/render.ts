import type { Solution } from "$content/index";

import { render } from "svelte/server";

import Maxim from "$lib/components/article/maxim.svelte";
import Metadata from "$lib/components/article/metadata.svelte";
import Quote from "$lib/components/article/quote.svelte";
import MediaGrid from "$lib/components/media-grid.svelte";

const componentMap = {
	metadata: Metadata,
	maxim: Maxim,
	quote: Quote,
	media: MediaGrid,
} as const;

const componentProps = {
	metadata: ["risk", "probability"],
	media: ["media"],
	maxim: [],
	quote: [],
} as const satisfies Record<keyof typeof componentMap, string[]>;

type ComponentType = keyof typeof componentMap;
type ComponentPayload = { type: ComponentType; props: Record<string, unknown> };
type MetaType = Omit<Solution, "content">;

function cleanInnerHtml(html: string, unwrapP = true): string {
	let result = html
		.replace(/<p>\s*<\/p>/g, "")
		.replace(/(<br\s*\/?>\s*){2,}/g, "<br>")
		.trim();

	if (unwrapP) {
		result = result.replace(/^<p>([\s\S]*?)<\/p>$/g, "$1").trim();
	}

	return result;
}

function extractMeta(type: ComponentType, meta: MetaType): Record<string, unknown> {
	const allowed = componentProps[type] as readonly string[];
	return Object.fromEntries(
		allowed.map((key) => [key, meta[key as keyof typeof meta]]).filter(([, v]) => v != null)
	);
}

function renderComponent(payload: ComponentPayload, innerHtml: string, meta: MetaType): string {
	const { type, props } = payload;
	const Component = componentMap[type];

	if (!Component) {
		console.warn(`Unknown component type: "${type}"`);
		return "";
	}

	const mergedProps = {
		...extractMeta(type, meta),
		...props,
		innerHtml: cleanInnerHtml(innerHtml),
	};

	return render(Component, { props: mergedProps as any }).body;
}

export function renderContent({ content, ...meta }: Solution): string {
	const regex = /<!--component-start:(.*?)-->([\s\S]*?)<!--component-end-->/g;

	return content.replace(regex, (_, json, innerHtml) => {
		try {
			const payload = JSON.parse(json) as ComponentPayload;

			if (!(payload.type in componentMap)) {
				console.warn(`Unknown component type: "${payload.type}"`);
				return "";
			}

			return renderComponent(payload, innerHtml, meta);
		} catch (err) {
			console.error("Failed to render component:", err, { json, innerHtml });
			return "";
		}
	});
}
