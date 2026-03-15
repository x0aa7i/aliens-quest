<script lang="ts">
	import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
	import type { LayoutSolution } from "$lib/data/content";

	import ChevronLeft from "~icons/bx/chevron-left";
	import ChevronRight from "~icons/bx/chevron-right";

	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import StatsFooter from "$lib/sections/stats-footer.svelte";

	type Cards = (LayoutSolution & {
		score: number;
		rank: number;
		votes: number;
		upvotes: number;
		downvotes: number;
	})[];

	let { cards }: { cards: Cards } = $props();

	let emblaApi = $state<CarouselAPI>();

	function scrollLeft() {
		emblaApi?.scrollPrev();
	}

	function scrollRight() {
		emblaApi?.scrollNext();
	}
</script>

<main class="h-hero relative flex max-h-200 w-full flex-col pt-6 md:pt-10 md:pb-4">
	<!-- Background -->
	<div class="pointer-events-none absolute inset-0">
		<img
			src="/stars.svg"
			alt="background stars"
			class="absolute inset-0 h-full w-full object-cover opacity-30"
		/>
	</div>

	<!-- Main Container -->
	<div class="mx-auto flex h-full w-full flex-col gap-4 px-4 sm:px-8 md:container lg:px-10">
		<!-- Row 1: Title Area & Nav Controls -->
		<div
			class="flex w-full shrink-0 flex-col items-start justify-between gap-4 md:flex-row md:items-end"
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
					class="flex h-10 w-10 cursor-pointer items-center justify-center border bg-surface-raised text-tertiary transition-colors hover:bg-surface-raised-hover hover:text-primary"
				>
					<ChevronLeft class="h-6 w-6" />
				</button>
				<button
					onclick={scrollRight}
					aria-label="Scroll right"
					class="flex h-10 w-10 cursor-pointer items-center justify-center border bg-surface-raised text-tertiary transition-colors hover:bg-surface-raised-hover hover:text-primary"
				>
					<ChevronRight class="h-6 w-6" />
				</button>
			</div>
		</div>

		<!-- Row 2: Carousel Track -->
		<Carousel.Root
			class="flex min-h-72 flex-1 flex-col"
			opts={{
				loop: true,
				align: "start",
				slidesToScroll: 3,
				breakpoints: { "(max-width: 767px)": { active: false } },
			}}
			setApi={(api) => (emblaApi = api)}
		>
			<!-- Embla container needs to hold the track flex items -->
			<Carousel.Content class="flex h-full w-full flex-col sm:flex-row">
				{#each cards as card (card.title)}
					<Carousel.Item
						class="h-full shrink-0 basis-full py-2 md:basis-[calc(33%+0.49rem)] md:py-0 xl:basis-[calc(25%+0.25rem)]"
					>
						<a
							class="group relative flex h-full w-full flex-col justify-end overflow-hidden border bg-surface"
							href={card.url}
						>
							<!-- Background Image -->
							<img
								src={card.cover.src}
								alt={card.title}
								width={card.cover.width}
								height={card.cover.height}
								fetchpriority="high"
								class="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen transition-opacity duration-300 group-hover:opacity-80"
							/>

							<!-- Card Header / Footer -->
							<div
								class="relative flex w-full flex-col gap-1 border-t bg-surface-raised/90 px-6 py-5 backdrop-blur-md"
							>
								<div class="flex items-start gap-2 md:gap-3">
									<div class="**:stroke-[1.5] [&_svg]:h-8 [&_svg]:w-10">
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html card.logo}
									</div>
									<h2
										class="truncate font-head text-xl font-normal text-primary md:text-lg lg:text-xl lg:tracking-wide"
									>
										{card.title}
									</h2>
								</div>

								<div class="pl-1 text-sm text-quaternary">
									<span class="line-clamp-2"> {card.overview} </span>
								</div>
							</div>
						</a>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
		</Carousel.Root>

		<!-- Row 3: Stats Footer (Desktop Only) -->
		<StatsFooter />
	</div>
</main>

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

	.h-hero {
		height: calc(100dvh - 5rem);
		height: calc(100vh - 5rem);
	}
</style>
