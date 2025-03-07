<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";

	import { cn } from "$lib/utils.js";

	let { ref = $bindable(null), class: className, ...restProps }: TabsPrimitive.ListProps = $props();
</script>

<TabsPrimitive.List
	bind:ref
	class={cn(
		"inline-flex h-10 items-center justify-center border-b border-b-gray-700 p-1 text-gray-500",
		className
	)}
	{...restProps}
/>
