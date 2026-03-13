<script lang="ts">
	import Hero from "$lib/sections/hero.svelte";

	let { data } = $props();
</script>

<Hero cards={data.posts} />
