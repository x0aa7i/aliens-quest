<script lang="ts">
	import "../styles/app.css";

	import { ModeWatcher } from "mode-watcher";

	import Footer from "$lib/sections/footer.svelte";

	let { children } = $props();
</script>

<ModeWatcher defaultMode="dark" />
{@render children()}

<Footer />
