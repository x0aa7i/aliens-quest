<script lang="ts">
	import type { SVGAttributes } from "svelte/elements";

	type Props = SVGAttributes<SVGElement>;

	let props: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
	<path
		fill="currentColor"
		d="M19.938 13A8.004 8.004 0 0 1 13 19.938V22h-2v-2.062A8.004 8.004 0 0 1 4.062 13H2v-2h2.062A8.004 8.004 0 0 1 11 4.062V2h2v2.062A8.004 8.004 0 0 1 19.938 11H22v2zM12 18a6 6 0 1 0 0-12a6 6 0 0 0 0 12m0-3a3 3 0 1 0 0-6a3 3 0 0 0 0 6"
	/>
</svg>
