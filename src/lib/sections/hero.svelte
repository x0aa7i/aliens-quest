<script lang="ts">
	import type { SolutionCardProps } from "$lib/components/solution-card.svelte";
	import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";

	import ChevronLeft from "@lucide/svelte/icons/chevron-left";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";

	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import StatsFooter from "$lib/sections/stats-footer.svelte";

	type Props = {
		cards: SolutionCardProps[];
	};

	let { cards }: Props = $props();

	let emblaApi = $state<CarouselAPI>();

	function scrollLeft() {
		emblaApi?.scrollPrev();
	}

	function scrollRight() {
		emblaApi?.scrollNext();
	}
</script>

<section
	class="relative flex h-[calc(100dvh-5rem)] max-h-275 w-full flex-col overflow-hidden pt-6 pb-6 md:pt-10 md:pb-8"
>
	<!-- Background -->
	<div class="pointer-events-none absolute inset-0">
		<img
			src="/stars.svg"
			alt="background stars"
			class="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
		/>
	</div>

	<!-- Main Container -->
	<div
		class="z-10 container mx-auto flex h-full w-full flex-col gap-6 overflow-hidden px-4 md:gap-8 md:px-8 lg:px-12"
	>
		<!-- Row 1: Title Area & Nav Controls -->
		<div
			class="z-10 flex w-full shrink-0 flex-col items-start justify-between gap-4 md:flex-row md:items-end"
		>
			<div class="flex flex-col border-l-[3px] border-white pl-6 text-left font-head">
				<h2 class="text-sm font-medium tracking-wider text-tertiary uppercase md:text-base">
					If the universe is so vast
				</h2>
				<h1
					class="text-3xl leading-none font-medium tracking-wide text-white uppercase md:text-4xl lg:text-5xl"
				>
					Where is everybody?
				</h1>
			</div>

			<div class="hidden shrink-0 gap-2 md:flex">
				<button
					onclick={scrollLeft}
					aria-label="Scroll left"
					class="flex h-10 w-10 cursor-pointer items-center justify-center border bg-surface-raised text-secondary transition-colors hover:bg-surface-raised-hover hover:text-primary"
				>
					<ChevronLeft class="h-6 w-6" />
				</button>
				<button
					onclick={scrollRight}
					aria-label="Scroll right"
					class="flex h-10 w-10 cursor-pointer items-center justify-center border bg-surface-raised text-secondary transition-colors hover:bg-surface-raised-hover hover:text-primary"
				>
					<ChevronRight class="h-6 w-6" />
				</button>
			</div>
		</div>

		<!-- Row 2: Carousel Track -->
		<Carousel.Root
			class="relative flex min-h-50 w-full flex-1 flex-col overflow-hidden"
			opts={{
				loop: true,
				align: "start",
				slidesToScroll: 3,
				breakpoints: { "(max-width: 767px)": { active: false } },
			}}
			setApi={(api) => (emblaApi = api)}
		>
			<!-- Embla container needs to hold the track flex items -->
			<Carousel.Content class="flex h-full w-full flex-col md:flex-row">
				{#each cards as card, id}
					<Carousel.Item
						class="h-full shrink-0 basis-full pb-4 md:basis-[calc(33%+0.49rem)] md:pb-0 md:pl-4 xl:basis-[calc(25%+0.25rem)]"
					>
						<a
							class="group relative flex h-full min-h-[55vh] w-full flex-col justify-end overflow-hidden border bg-surface md:min-h-0"
							href={card.url}
						>
							<!-- Background Image -->
							<img
								src={card.cover.src}
								alt={card.title}
								width={card.cover.width}
								height={card.cover.height}
								class="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen transition-opacity duration-300 group-hover:opacity-80"
							/>

							<!-- Card Header / Footer -->
							<div
								class="relative flex w-full flex-col border-t bg-surface-raised/90 px-6 py-5 backdrop-blur-md"
							>
								<div class="flex items-center justify-between gap-2 md:gap-4">
									<div class="**:stroke-[1.5] [&_svg]:h-10 [&_svg]:w-10">
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html card.logo}
									</div>

									<span class="font-head text-lg font-medium text-quaternary">
										#{id + 1}
									</span>
								</div>

								<h3
									class="truncate font-head text-xl font-normal text-primary md:text-lg lg:text-xl lg:tracking-wide"
								>
									{card.title}
								</h3>
							</div>
						</a>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>

		<!-- Row 3: Stats Footer (Desktop Only) -->
		<StatsFooter />
	</div>
</section>

<style>
	/* Shadcn Carousel Component Structural Overrides */
	:global([data-slot="carousel-content"]) {
		flex: 1;
		min-height: 0;
	}
	:global([data-embla-container]) {
		height: 100%;
	}

	/* Mobile overrides for Shadcn Carousel to allow native vertical scrolling */
	@media (max-width: 767px) {
		:global([data-slot="carousel-content"]) {
			overflow-y: auto !important;
			overflow-x: hidden !important;
			scroll-snap-type: y mandatory;
			-ms-overflow-style: none;
			scrollbar-width: none;
		}
		:global([data-slot="carousel-content"]::-webkit-scrollbar) {
			display: none;
		}
		:global([data-embla-container]) {
			flex-direction: column !important;
			margin-left: 0 !important;
		}
		:global([data-embla-slide]) {
			padding-left: 0 !important;
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}
	}
</style>
