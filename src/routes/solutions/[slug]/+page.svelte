<script lang="ts">
	import { onMount } from "svelte";

	import { page } from "$app/state";

	import Danger from "$lib/components/icons/danger.svelte";
	import Target from "$lib/components/icons/target.svelte";
	import Toc from "$lib/components/toc.svelte";
	import Footer from "$lib/sections/footer.svelte";

	let { data } = $props();
	const post = $derived(data.post);

	const stats = $derived([
		{ name: "risk", value: data.post.risk, Icon: Danger },
		{ name: "probability", value: data.post.probability, Icon: Target },
	]);

	let activeToc: string | null = $state(null);

	function getAbsoluteTop(element: Element): number {
		let offsetTop = 0;
		let currentElement: HTMLElement | null = element as HTMLElement;

		while (currentElement && currentElement !== document.body) {
			offsetTop += currentElement.offsetTop;
			currentElement = currentElement.offsetParent as HTMLElement | null;
		}

		return offsetTop;
	}

	function setActiveLink() {
		const scrollY = window.scrollY;
		const innerHeight = window.innerHeight;
		const offsetHeight = document.body.offsetHeight;
		const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;

		const headers = [...document.querySelectorAll("h2[id], h3[id], h4[id]")]
			.map((el) => ({ id: el.id, top: getAbsoluteTop(el) }))
			.filter(({ top }) => !Number.isNaN(top))
			.sort((a, b) => a.top - b.top);

		if (!headers.length) {
			activeToc = null;
			return;
		}

		if (scrollY < 1) {
			activeToc = null;
			return;
		}

		if (isBottom) {
			activeToc = headers[headers.length - 1].id;
			return;
		}

		// Find the closest header to the current scroll position (within 33% of the viewport height)
		let current: string | null = null;
		for (const { id, top } of headers) {
			if (top > scrollY + innerHeight / 3) break;
			current = id;
		}
		activeToc = current;
	}

	onMount(() => {
		setActiveLink();
		window.addEventListener("scroll", setActiveLink, { passive: true });

		return () => window.removeEventListener("scroll", setActiveLink);
	});
</script>

<svelte:head>
	<title>{post.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={post.title} />
</svelte:head>

<article class="container mx-auto mt-10 flex min-h-[calc(100vh-220px)] flex-col lg:px-8">
	<div
		class="grid flex-1 auto-rows-fr grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,1fr)_240px]"
	>
		<Toc
			title="Solutions"
			data={data.posts}
			active={page.url.pathname}
			class="hidden border-r pr-6 lg:block"
		/>

		<div class="space-y-8">
			<div class=" space-y-2 px-4 lg:px-6 xl:px-8">
				<div class="mx-auto flex max-w-prose flex-wrap items-center gap-3">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html post.logo}
					<h1 class="not-prose font-head text-3xl font-semibold">{post.title}</h1>
				</div>

				<div class="mx-auto flex max-w-prose flex-wrap gap-x-4 text-gray-400">
					{#each stats as { name, value, Icon } (name)}
						{#if value}
							<div class="inline-flex items-center justify-center gap-1">
								<Icon width="16" height="16" class="shrink-0" aria-hidden="true" />
								<span class="text-sm"> {value} {name} </span>
							</div>
						{/if}
					{/each}
				</div>
			</div>

			<div class="w-full space-y-8 border-t px-4 pb-24 pt-6 lg:px-6 xl:px-8 xl:pt-8">
				<img
					src={post.cover.src}
					alt="cover"
					class="mx-auto max-h-44 w-full max-w-prose object-cover"
				/>

				<div class="prose mx-auto max-w-prose text-pretty">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html post.content}
				</div>
			</div>
		</div>

		<Toc
			title="On this page"
			data={post.toc}
			active={`#${activeToc}`}
			class="hidden border-l pl-6 xl:block"
		/>
	</div>
</article>

<Footer />
