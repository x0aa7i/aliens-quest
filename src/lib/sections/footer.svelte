<script lang="ts">
	import { cn } from "$lib/utils";

	const year = new Date().getFullYear();

	let { class: _class }: { class?: string } = $props();
</script>

<footer class={cn("w-full border-t", _class)}>
	<div class="container mx-auto px-4">
		<p class="w-full py-5 text-center text-sm text-gray-300">
			&copy; {year} Aliens Quest &mdash;
			<a
				class="inline-flex items-center gap-1 font-medium text-gray-100 hover:underline"
				href="https://github.com/x0aa7i/aliens-quest"
				target="_blank"
				rel="noopener noreferrer"
			>
				GitHub
			</a>
		</p>
	</div>
</footer>
