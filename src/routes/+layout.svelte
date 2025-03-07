<script lang="ts">
	import "../styles/app.css";

	import { ModeWatcher } from "mode-watcher";

	import Footer from "$lib/sections/footer.svelte";
	import Header from "$lib/sections/header.svelte";

	let { children } = $props();
</script>

<ModeWatcher defaultMode="dark" />

<Header />
{@render children()}
<Footer />
