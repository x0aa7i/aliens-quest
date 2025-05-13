<script lang="ts">
	import Footer from "$lib/sections/footer.svelte";
	import Header from "$lib/sections/header.svelte";

	let { children } = $props();
</script>

<div class="bg-surface-raised">
	<Header />
	{@render children()}
	<Footer />
</div>
