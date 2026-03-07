<script lang="ts">
	// import Footer from "$lib/sections/footer.svelte";
	import Header from "$lib/sections/header.svelte";

	let { children } = $props();
</script>

<div class="min-h-svh">
	<Header />
	{@render children()}
	<!-- <Footer class="bg-gray-900" /> -->
</div>
