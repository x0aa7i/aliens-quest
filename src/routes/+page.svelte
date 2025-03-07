<script lang="ts">
	import Explore from "$lib/sections/explore.svelte";
	import Hero from "$lib/sections/hero.svelte";

	let { data } = $props();
</script>

<Hero />
<Explore posts={data.posts} />
