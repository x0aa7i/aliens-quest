<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	type Props = HTMLAttributes<HTMLDivElement> & { value: number };
	let { value }: Props = $props();
</script>

<div class="flex items-center justify-center gap-1">
	{#each Array(5) as _, i}
		<div class={["h-3 w-2", i <= value * 5 ? "bg-current" : "bg-gray-700"]}></div>
	{/each}
</div>
