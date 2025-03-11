<script lang="ts">
	import "../styles/app.css";

	import Footer from "$lib/sections/footer.svelte";

	let { children } = $props();
</script>

{@render children()}
<Footer />
