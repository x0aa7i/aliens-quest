<script module lang="ts">
	interface Metadata {
		name: string;
		url: string;
		description: string;
		keywords: string[];
		ogImage: {
			url: string;
			width: string;
			height: string;
		};
	}

	export const defaultMeta: Metadata = {
		name: "Aliens Quest",
		url: "https://aliensquest.com",
		description:
			"Why the great silence? Aliens Quest explores possible solutions to the Fermi Paradox that might explain our cosmic loneliness.",
		keywords: [
			"Fermi Paradox",
			"Fermi Paradox solutions",
			"Fermi Paradox theories",
			"Extraterrestrial life",
			"Alien civilizations",
			"Extraterrestrial intelligence",
			"SETI",
			"Search for Extraterrestrial Intelligence",
			"Are we alone",
		],
		ogImage: {
			url: "https://aliensquest.com/og.png",
			width: "1200",
			height: "630",
		},
	};
</script>

<script lang="ts">
	import { page } from "$app/state";

	let {
		title = defaultMeta.name,
		type = "website",
		ogImage = defaultMeta.ogImage,
		description = defaultMeta.description,
		keywords = defaultMeta.keywords,
	}: {
		title?: string;
		type?: string;
		ogImage?: Metadata["ogImage"];
		description?: string;
		keywords?: string[];
	} = $props();
</script>

<svelte:head>
	<title>{title}</title>

	<meta name="description" content={description} />
	<meta name="keywords" content={keywords?.join(",")} />
	<!-- <meta name="author" content="x0aa7i" /> -->

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={defaultMeta.url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage?.url} />
	<meta name="twitter:image:alt" content={title} />
	<meta name="twitter:creator" content="x0aa7i" />

	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={defaultMeta.url + page.url.pathname} />
	<meta property="og:logo" content={defaultMeta.url + "/logo.svg"} />
	<meta property="og:image" content={ogImage?.url} />
	<meta property="og:image:alt" content={title} />
	<meta property="og:image:width" content={ogImage?.width} />
	<meta property="og:image:height" content={ogImage?.height} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={defaultMeta.name} />
	<meta property="og:locale" content="EN_US" />
</svelte:head>
