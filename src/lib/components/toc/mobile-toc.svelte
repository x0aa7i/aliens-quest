<script lang="ts">
	import type { TocEntry, TocState } from "$lib/hooks/use-toc.svelte";

	import { MediaQuery } from "svelte/reactivity";

	import TocTree from "$lib/components/toc/toc-tree.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Popover from "$lib/components/ui/popover";

	type Props = {
		title?: string;
		items: TocEntry[];
		tocState: TocState;
		class?: string;
	};

	let { class: _class, items, tocState, title = "On this page" }: Props = $props();

	let popoverOpen = $state(false);
	let xl = new MediaQuery("min-width: 80rem");

	$effect(() => {
		if (xl.current) popoverOpen = false;
	});
</script>

<Popover.Root bind:open={popoverOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="menu" size="none" class="ml-auto">{title}</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="end" sideOffset={8} alignOffset={-8} class="xl:hidden">
		<TocTree {items} {tocState} class="px-4" onItemClick={() => (popoverOpen = false)} />
	</Popover.Content>
</Popover.Root>
