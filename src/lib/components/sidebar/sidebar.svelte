<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";

	import Button from "$lib/components/ui/button/button.svelte";
	import * as Drawer from "$lib/components/ui/drawer";

	import SidebarItems from "./sidebar-items.svelte";

	type Props = {
		items: { title: string; url: string }[];
		type?: "desktop" | "mobile";
	};

	let { items, type = "desktop" }: Props = $props();
	let drawerOpen = $state(false);
	let lg = new MediaQuery("min-width: 64rem");

	$effect(() => {
		if (lg.current) drawerOpen = false;
	});
</script>

{#if type === "desktop"}
	<div class="sticky top-8 overflow-y-auto overflow-x-hidden pb-2">
		<SidebarItems {items} />
	</div>
{:else}
	<Drawer.Root direction="left" bind:open={drawerOpen}>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="menu" size="none">Menu</Button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content class="h-full min-w-[220px] overflow-y-auto p-6 pr-12">
			<SidebarItems {items} onItemClick={() => (drawerOpen = false)} />
		</Drawer.Content>
	</Drawer.Root>
{/if}
