<script lang="ts">
	import type { TocEntry } from "./toc.svelte";

	import Toc from "./toc.svelte";

	type Props = {
		title?: string;
		items: TocEntry[];
		active?: string;
		class?: string;
	};

	let { title, items, active, class: _class }: Props = $props();
</script>

<div class={_class}>
	<div class="sticky top-8 overflow-y-auto overflow-x-hidden pb-2">
		<span class="font-semibold text-gray-200">{title}</span>
		<Toc {items} {active} class="mt-2" />
	</div>
</div>
