import type { Component } from "svelte";
import type { SVGAttributes } from "svelte/elements";

export type Metadata = {
	Icon: Component<SVGAttributes<SVGSVGElement>>;
	value?: string | number;
	label: string;
};

export type CardProps = {
	title: string;
	poster: string;
	metadata: Metadata[];
	overview?: string;
	badges: string[];
};
