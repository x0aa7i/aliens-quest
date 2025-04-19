<script lang="ts">
	import type { TocEntry, TocState } from "$lib/hooks/use-toc.svelte";

	import DesktopToc from "./desktop-toc.svelte";
	import MobileToc from "./mobile-toc.svelte";

	type Props = {
		items: TocEntry[];
		tocState: TocState;
		type: "desktop" | "mobile";
	};

	let { items, tocState, type = "desktop" }: Props = $props();
</script>

{#if items?.length}
	{#if type === "desktop"}
		<DesktopToc {items} {tocState} />
	{:else}
		<MobileToc {items} {tocState} />
	{/if}
{/if}
