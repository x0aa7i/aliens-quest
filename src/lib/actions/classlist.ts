// https://github.com/ghostdevv/svelte-body/blob/main/src/lib/actions.ts
//
import type { ClassValue } from "clsx";
import type { Action } from "svelte/action";

import clsx from "clsx";

function clsxList(input: ClassValue) {
	return clsx(input).split(" ").filter(Boolean);
}

export const classList: Action<HTMLElement, ClassValue> = (
	node: HTMLElement,
	input: ClassValue
) => {
	let classes = clsxList(input);

	node.classList.add(...classes);

	return {
		update(input: ClassValue) {
			node.classList.remove(...classes);
			classes = clsxList(input);
			node.classList.add(...classes);
		},
		destroy() {
			node.classList.remove(...classes);
		},
	};
};
