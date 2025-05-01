<script lang="ts">
	type Post = { title: string; url: string };
	type Props = {
		posts: Post[];
		current: string;
	};

	let { posts, current }: Props = $props();

	const [prev, next] = $derived.by(() => {
		const currentIndex = posts.findIndex((post) => post.url.replace("/solutions/", "") === current);
		return currentIndex >= 0 ? [posts[currentIndex - 1], posts[currentIndex + 1]] : [];
	});
</script>

{#snippet PostNavigation(post: Post | undefined, label: string)}
	{#if post}
		<a
			href={post.url}
			class={[
				"flex flex-1 flex-col border px-4 py-2 text-gray-400 first:items-start last:items-end",
				"transition-colors duration-300 hover:border-gray-500 hover:text-gray-500",
			]}
		>
			<span class="truncate text-sm text-gray-500">{label}</span>
			<span class="text-primary">{post.title}</span>
		</a>
	{:else}
		<div class="flex-1"></div>
	{/if}
{/snippet}

<div class="not-prose mt-4 flex items-center justify-between gap-3">
	{@render PostNavigation(prev, "Previous")}
	{@render PostNavigation(next, "Next")}
</div>
