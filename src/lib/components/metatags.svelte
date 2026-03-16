<script module lang="ts">
	interface OgImage {
		url: string;
		width: string;
		height: string;
		type?: string;
	}

	interface TwitterMeta {
		card?: string;
		site?: string; // @handle
		creator?: string; // @handle
		title?: string;
		description?: string;
		image?: string;
		imageAlt?: string;
	}

	interface FacebookMeta {
		appId?: string;
	}

	interface Metadata {
		name: string;
		url: string;
		author?: string;
		description: string;
		keywords: string[];
		ogImage: OgImage;
		twitter: TwitterMeta;
		facebook?: FacebookMeta;
	}

	export const defaultMeta: Metadata = {
		name: "Aliens Quest",
		url: "https://aliensquest.com",
		description:
			"Why the great silence? Aliens Quest explores possible solutions to the Fermi Paradox that might explain our cosmic loneliness.",
		keywords: [
			"Fermi Paradox",
			"Great Filter",
			"Great Silence",
			"Drake Equation",
			"Dark Forest theory",
			"Extraterrestrial intelligence",
			"Alien civilizations",
			"Rare Earth hypothesis",
			"SETI",
			"UAP",
		],
		ogImage: {
			url: "https://aliensquest.com/og.webp",
			width: "1200",
			height: "630",
			type: "image/webp",
		},
		twitter: {
			card: "summary_large_image",
			site: "@x0aa7i",
			creator: "@x0aa7i",
		},
		facebook: {
			appId: undefined, // ← fill in if you have one
		},
	};
</script>

<script lang="ts">
	import { page } from "$app/state";

	let {
		title = defaultMeta.name,
		titleTemplate = "%s | Aliens Quest",
		type = "website",
		ogImage = defaultMeta.ogImage,
		description = defaultMeta.description,
		keywords = defaultMeta.keywords,
		robots = "index,follow",
		canonical = defaultMeta.url + page.url.pathname,
		twitter = defaultMeta.twitter,
		facebook = defaultMeta.facebook,
	}: {
		title?: string;
		titleTemplate?: string;
		type?: string;
		author?: string;
		ogImage?: OgImage;
		description?: string;
		keywords?: string[];
		robots?: string | false;
		canonical?: string;
		twitter?: TwitterMeta;
		facebook?: FacebookMeta;
	} = $props();

	const resolvedTitle = $derived(
		title === defaultMeta.name ? title : titleTemplate.replace("%s", title)
	);
</script>

<svelte:head>
	<title>{resolvedTitle}</title>

	{#if robots}
		<meta name="robots" content={robots} />
	{/if}

	{#if description}
		<meta name="description" content={description} />
	{/if}

	{#if keywords?.length}
		<meta name="keywords" content={keywords.join(", ")} />
	{/if}

	<link rel="canonical" href={canonical} />

	<!-- Twitter -->
	{#if twitter}
		<meta name="twitter:card" content={twitter.card ?? "summary_large_image"} />
		{#if twitter.site}
			<meta name="twitter:site" content={twitter.site} />
		{/if}
		{#if twitter.creator}
			<meta name="twitter:creator" content={twitter.creator} />
		{/if}
		<meta name="twitter:title" content={twitter.title ?? resolvedTitle} />
		<meta name="twitter:description" content={twitter.description ?? description} />
		<meta name="twitter:image" content={twitter.image ?? ogImage?.url} />
		<meta name="twitter:image:alt" content={twitter.imageAlt ?? resolvedTitle} />
	{/if}

	<!-- Facebook -->
	{#if facebook?.appId}
		<meta property="fb:app_id" content={facebook.appId} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:site_name" content={defaultMeta.name} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={resolvedTitle} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	{#if ogImage}
		<meta property="og:image" content={ogImage.url} />
		<meta property="og:image:secure_url" content={ogImage.url} />
		<meta property="og:image:alt" content={resolvedTitle} />
		{#if ogImage.width}
			<meta property="og:image:width" content={ogImage.width} />
		{/if}
		{#if ogImage.height}
			<meta property="og:image:height" content={ogImage.height} />
		{/if}
		{#if ogImage.type}
			<meta property="og:image:type" content={ogImage.type} />
		{/if}
	{/if}
</svelte:head>
