<script lang="ts">
	let { innerHtml } = $props();
</script>

<div
	class={[
		"not-prose my-6 flex items-center px-6 py-6 xl:px-8",
		"bg-linear-to-r from-violet-900/15 via-violet-900/5 via-25% to-violet-900/0",
		"border-l-2 border-violet-800",
	]}
>
	<p class="font-head text-xl leading-snug tracking-wide text-primary capitalize md:text-2xl">
		{@html innerHtml}
	</p>
</div>
