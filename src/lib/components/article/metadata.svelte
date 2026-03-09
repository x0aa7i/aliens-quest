<script lang="ts">
	import ShieldX from "~icons/bx/shield-x";
	import Target from "~icons/bx/target-lock";

	type Props = {
		probability: number;
		risk: number;
	};

	let { probability, risk }: Props = $props();

	const chips = $derived([
		{ icon: ShieldX, text: `${risk} risk` },
		{ icon: Target, text: `${probability} probability` },
	]);
</script>

<div class="not-prose my-6 flex flex-wrap gap-4 select-none">
	{#each chips as { icon: ChipIcon, text }}
		<span
			class="inline-flex items-center gap-2 border p-2 px-3 font-head text-sm tracking-wide text-zinc-200 capitalize"
		>
			<ChipIcon class="h-4 w-4 shrink-0 opacity-70" />
			{text}
		</span>
	{/each}
</div>
