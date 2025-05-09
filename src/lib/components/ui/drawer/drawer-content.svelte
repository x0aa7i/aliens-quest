<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";

	import { cn } from "$lib/utils.js";

	import DrawerOverlay from "./drawer-overlay.svelte";

	let {
		ref = $bindable(null),
		class: className,
		portalProps,
		children,
		...restProps
	}: DrawerPrimitive.ContentProps & {
		portalProps?: DrawerPrimitive.PortalProps;
	} = $props();
</script>

<DrawerPrimitive.Portal {...portalProps}>
	<DrawerOverlay />
	<DrawerPrimitive.Content
		bind:ref
		class={cn(
			"bg-surface max-w-4/5 fixed inset-y-0 left-0 z-50 flex h-full flex-col border",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
