<script lang="ts">
	import { cn } from "$lib/utils";

	const year = new Date().getFullYear();

	let { class: _class }: { class?: string } = $props();
</script>

<footer class={cn("w-full border-t", _class)}>
	<div class="container mx-auto px-4">
		<p class="w-full py-5 text-center text-sm text-gray-300">
			&copy; {year} Aliens Quest &mdash; Made by
			<a
				class="font-medium text-gray-100 hover:underline"
				href="https://achak.dev"
				target="_blank"
				rel="noopener noreferrer">ABDO</a
			>
			.
		</p>
	</div>
</footer>
