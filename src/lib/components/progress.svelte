<script lang="ts">
	let { value }: { value: number } = $props();
</script>

<div class="flex h-full w-full items-center justify-center gap-1">
	{#each Array(5) as _, i}
		<div class={["h-3 w-2", i <= value * 5 ? "bg-gray-400" : "bg-gray-700"]}></div>
	{/each}
</div>
