<script lang="ts">
	import { onNavigate } from "$app/navigation";

	import "../styles/app.css";

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
</script>

<div class="relative min-h-svh bg-surface-raised">
	{@render children()}
</div>
