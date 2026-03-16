<script lang="ts">
	import { onMount } from "svelte";
	import { onNavigate } from "$app/navigation";

	import "../styles/app.css";

	import Metatags from "$lib/components/metatags.svelte";
	import { initializeVisitorId } from "$lib/hooks/fingerprint.svelte";
	import Header from "$lib/sections/header.svelte";

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	onMount(async () => {
		await initializeVisitorId();
	});
</script>

<Metatags title="Exploring the Fermi Paradox Solutions" titleTemplate="Aliens Quest | %s" />

<div class="relative min-h-svh bg-surface-raised">
	<Header />
	{@render children()}
</div>
