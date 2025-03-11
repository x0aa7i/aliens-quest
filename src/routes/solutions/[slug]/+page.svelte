<script lang="ts">
	import { onMount } from "svelte";
	import { MediaQuery } from "svelte/reactivity";

	import { page } from "$app/state";

	import { classList } from "$lib/actions/classlist.js";
	import Danger from "$lib/components/icons/danger.svelte";
	import Target from "$lib/components/icons/target.svelte";
	import SidebarToc from "$lib/components/sidebar-toc.svelte";
	import Toc from "$lib/components/toc.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Drawer from "$lib/components/ui/drawer";
	import * as Popover from "$lib/components/ui/popover";
	import Header from "$lib/sections/header.svelte";

	let { data } = $props();
	const post = $derived(data.post);

	const screen = {
		lg: new MediaQuery("min-width: 64rem"),
		xl: new MediaQuery("min-width: 80rem"),
	};

	let popoverOpen = $state(false);
	let drawerOpen = $state(false);

	$effect(() => {
		if (screen.lg.current) drawerOpen = false;
		if (screen.xl.current) popoverOpen = false;
	});

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
			if (top > scrollY + innerHeight / 4) break;
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
	<meta property="og:title" content={post.title} />
	<meta property="og:type" content="article" />
	<meta property="og:description" content={post.excerpt} />
	<meta name="description" content={post.excerpt} />
	<!-- <meta property="og:url" content={post.url} /> -->
	<meta property="og:image" content={post.cover.src} />
</svelte:head>

<!-- update page background color -->
<svelte:body use:classList={"bg-gray-900"} />

<Header />

<article class="container mx-auto flex min-h-[calc(100vh-220px)] flex-col md:pt-4 lg:px-8">
	<div
		class="grid flex-1 auto-rows-fr grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,1fr)_240px]"
	>
		<SidebarToc
			title="Solutions"
			items={data.posts}
			active={page.url.pathname}
			class="hidden pr-6 pt-4 lg:block"
		/>

		<div class="border-t sm:border-l sm:border-r">
			<div class="sticky top-0 border-b bg-gray-900 px-4 lg:px-6 xl:hidden xl:px-8">
				<div
					class="mx-auto flex h-14 max-w-prose items-center justify-end font-medium text-gray-300"
				>
					<Drawer.Root direction="left" bind:open={drawerOpen}>
						<Drawer.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="menu" size="none" class="lg:hidden">Menu</Button>
							{/snippet}
						</Drawer.Trigger>
						<Drawer.Content>
							<SidebarToc
								title="Solutions"
								items={data.posts}
								active={page.url.pathname}
								class="h-full overflow-y-auto p-6 pr-12"
							/>
						</Drawer.Content>
					</Drawer.Root>

					<!-- on this page -->
					<Popover.Root bind:open={popoverOpen}>
						<Popover.Trigger>
							{#snippet child({ props })}
								<Button {...props} variant="menu" size="none" class="ml-auto">On this page</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content align="end" sideOffset={8} alignOffset={-8} class="xl:hidden">
							<Toc items={post.toc} active={`#${activeToc}`} class="px-4" />
						</Popover.Content>
					</Popover.Root>
				</div>
			</div>

			<div class="space-y-2 px-4 py-8 lg:px-6 xl:px-8">
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
				<div class="mx-auto h-44 w-full max-w-prose overflow-hidden bg-cover">
					<img
						src={post.cover.src}
						width={post.cover.width}
						height={post.cover.height}
						alt="cover"
						class="h-full w-full object-cover"
					/>
				</div>

				<div class="prose mx-auto max-w-prose text-pretty">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html post.content}
				</div>
			</div>
		</div>

		<SidebarToc
			title="On this page"
			items={post.toc}
			active={`#${activeToc}`}
			class="hidden pl-6 pt-4 xl:block"
		/>
	</div>
</article>
