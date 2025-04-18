<script lang="ts">
	import Footer from "$lib/sections/footer.svelte";
	import Header from "$lib/sections/header.svelte";

	let { children } = $props();
</script>

<div class="flex min-h-svh flex-col justify-between">
	<Header class="xl:max-w-7xl" />
	{@render children()}
	<Footer class="bg-gray-900" />
</div>
