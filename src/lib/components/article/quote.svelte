<script lang="ts">
	let { innerHtml, author } = $props();
</script>

<div
	class={[
		"not-prose my-6 flex w-full flex-col justify-start gap-3 border px-8 py-6",
		"bg-linear-to-l from-stone-900/0 via-stone-900/20 via-75% to-stone-900/50",
	]}
>
	<p class="font-sans text-xl leading-snug font-normal text-primary capitalize">
		{@html innerHtml}
	</p>

	<p class="font-head text-sm leading-snug font-normal text-tertiary capitalize">
		― {author}
	</p>
</div>
