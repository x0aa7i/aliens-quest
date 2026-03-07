<script lang="ts">
	const bars = Array.from({ length: 48 }, () => Math.floor(Math.random() * 80) + 10);

	type Stats = { label: string; value: string };

	const upTimeYears = new Date().getFullYear() - 1960;

	const leftStats: Stats[] = [
		{ label: "Signals detected", value: "0" },
		{ label: "Confirmed Civilizations", value: "1" },
		{ label: "Up time", value: `+${upTimeYears} Years` },
	];

	const rightStats: Stats[] = [
		{ label: "Observed Galaxy", value: "Milky Way" },
		{ label: "Estimated Stars", value: "~200 Billion" },
		{ label: "Habitable Planets", value: "~400 Million" },
	];

	const loc = [
		{ label: "R:", value: "26k", unit: "ly" },
		{ label: "A:", value: "0°", unit: "" },
		{ label: "Z:", value: "+55", unit: "ly" },
	];
</script>

<div class="hidden min-h-35 w-full shrink-0 grid-cols-4 gap-4 font-head md:grid" aria-hidden="true">
	<!-- Left Stats Window -->
	{@render stats(leftStats)}

	<!-- Center Monitoring Window -->
	<div class="col-span-2 flex flex-col overflow-hidden border bg-surface-raised font-head">
		<div
			class={[
				"flex shrink-0 items-center justify-between border-b px-4 py-3",
				"bg-linear-to-r from-zinc-900 via-zinc-900/40 via-25% to-zinc-900/0",
			]}
		>
			<div class="flex items-center gap-3">
				<div class="size-1.5 bg-white/90" aria-hidden="true"></div>
				<span class="text-xs font-medium tracking-wider text-primary uppercase">Monitoring</span>
			</div>
			<div class="flex items-end gap-3">
				<span class="text-xs font-medium tracking-wider text-quaternary uppercase">State:</span>
				<span class="text-sm tracking-wider text-primary">Quiet</span>
			</div>
		</div>

		<div class="flex flex-1 items-center justify-between gap-3 px-4 py-3">
			<div class="flex h-full gap-1 py-1">
				<div class="flex w-1 flex-col justify-end bg-surface-overlay">
					<div class="h-1.5 bg-white/90"></div>
				</div>

				<div
					class="flex flex-col justify-between text-xs leading-2 font-medium tracking-wider text-quaternary"
				>
					<span> 100% </span>
					<span> 0% </span>
				</div>
			</div>

			<!-- Animated Bar Chart -->
			<div class="flex h-full flex-row items-center justify-center gap-1">
				{#each bars as barHeight}
					<div class="w-0.5 bg-white/40" style="height: {barHeight}%;"></div>
				{/each}
			</div>

			<div class="flex flex-col justify-center gap-0">
				{#each loc as { label, value, unit }}
					<div class="flex items-center gap-1 text-xs font-medium tracking-wider text-quaternary">
						<span class="w-6 uppercase"> {label} </span>
						<span class="text-secondary/80"> {value} </span>
						<span> {unit} </span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Right Stats Window -->
	{@render stats(rightStats)}
</div>

{#snippet stats(stats: Stats[])}
	<div class="flex flex-1 flex-col border border-b-0 bg-surface-raised font-head">
		{#each stats as { label, value }}
			<div class="flex flex-1 items-center justify-between border-b px-4 py-3">
				<span class="text-xs font-medium tracking-wider text-quaternary uppercase">
					{label}
				</span>
				<span class="text-sm tracking-wide text-secondary"> {value} </span>
			</div>
		{/each}
	</div>
{/snippet}
