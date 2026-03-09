<script lang="ts">
	import type { Section } from "$lib/data/content";

	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { cn } from "$lib/utils.js";

	interface Props {
		sections: Section[];
	}

	let { sections = [] }: Props = $props();

	let activeTab = $derived(sections[0]?.id || "");

	$effect(() => {
		if (sections.length > 0 && !sections.find((s) => s.id === activeTab)) {
			activeTab = sections[0].id;
		}
	});

	const currentSection = $derived(sections.find((s) => s.id === activeTab));
</script>

<!-- ═══════════════════════════════════════════════
     3-COLUMN BODY LAYOUT WITH TABS
     left: section tabs (vertical desktop / horizontal mobile)
     center: article content
     right: sidebar
     ═══════════════════════════════════════════════ -->

<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)}>
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-0 lg:grid-cols-[200px_1fr]">
		<!-- ── LEFT: Vertical tabs (desktop) / Hidden on mobile ── -->
		<aside class="hidden border-r border-zinc-800 lg:block">
			<div class="sticky top-8 space-y-0 overflow-y-auto px-0 py-5">
				<Tabs.List
					class={[
						"flex flex-col gap-0 rounded-none border-b-0 bg-transparent p-0",
						"h-auto w-full",
					]}
				>
					{#each sections as section (section.id)}
						<Tabs.Trigger
							value={section.id}
							class={[
								"w-full justify-start rounded-none border-b border-zinc-800 px-6 py-5",
								"font-sans text-base font-normal transition-all duration-200",
								"data-[state=active]:bg-linear-to-r data-[state=active]:from-zinc-900/50 data-[state=active]:to-transparent",
								"data-[state=active]:text-primary",
								"data-[state=inactive]:text-white/40 data-[state=inactive]:hover:text-white/70",
								"focus-visible:rounded-none focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-0 focus-visible:outline-none",
							]}
						>
							{section.title}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
			</div>
		</aside>

		<!-- ── CENTER: Main article content ── -->
		<article class="min-w-0 border-r border-zinc-800">
			<!-- Mobile tabs (horizontal) - visible only on mobile -->
			<div class="border-b border-zinc-800 lg:hidden">
				<Tabs.List
					class={["flex w-full flex-row gap-0 bg-transparent", "no-scrollbar overflow-x-auto"]}
				>
					{#each sections as section (section.id)}
						<Tabs.Trigger
							value={section.id}
							class={cn(
								"shrink-0 px-4 py-3",
								"font-sans text-md font-normal whitespace-nowrap transition-all duration-200",
								"data-[state=active]:border data-[state=active]:text-primary",
								"data-[state=inactive]:border-transparent data-[state=inactive]:text-white/50 data-[state=inactive]:hover:text-white/70",
								"focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-0 focus-visible:outline-none"
							)}
						>
							{section.title}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
			</div>

			<!-- Prose body -->
			<div class="w-full space-y-8 px-4 pt-6 pb-16 sm:px-6 xl:px-8 xl:pt-8">
				{#if currentSection}
					<Tabs.Content value={currentSection.id} class="mt-0 focus-visible:outline-none">
						<h2 class="font-head text-2xl text-white">{currentSection.title}</h2>
						<div class="prose prose-invert mx-auto mt-6 max-w-prose text-pretty">
							{@html currentSection.html}
						</div>
					</Tabs.Content>
				{/if}
			</div>
		</article>

		<!-- ── RIGHT: Sidebar (future use) ── -->
		<aside class="hidden border-t-0 xl:block">
			<!-- Sidebar content here -->
		</aside>
	</div>
</Tabs.Root>

<style>
	/* Smooth transition for tab content */
	:global([data-state="active"]) {
		animation: fadeIn 150ms ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
