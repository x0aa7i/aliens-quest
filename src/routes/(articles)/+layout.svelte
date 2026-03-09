<script lang="ts">
	// import Footer from "$lib/sections/footer.svelte";
	import Header from "$lib/sections/header.svelte";

	let { children } = $props();
</script>

<Header />
{@render children()}
<!-- <Footer /> -->
