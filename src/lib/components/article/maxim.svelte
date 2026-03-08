<script lang="ts">
	let { innerHtml } = $props();
</script>

<div
	class={[
		"not-prose mb-6 flex items-center px-6 py-6 xl:px-8",
		"bg-linear-to-r from-violet-900/15 via-violet-900/5 via-25% to-violet-900/0",
		"border-l-2 border-violet-800",
		"font-head text-primary [&_p]:text-xl [&_p]:leading-snug [&_p]:tracking-wide [&_p]:md:text-2xl",
	]}
>
	{@html innerHtml}
</div>
