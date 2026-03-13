<script lang="ts">
	import type { Solution } from "$content/index";

	type Post = Pick<Solution, "title" | "slug" | "url">;

	type Props = {
		posts: Post[];
		current: string;
	};

	let { posts, current }: Props = $props();

	const [prev, next] = $derived.by(() => {
		const currentIndex = posts.findIndex((post) => post.slug === current);
		return currentIndex >= 0 ? [posts[currentIndex - 1], posts[currentIndex + 1]] : [];
	});
</script>

{#snippet PostNavigation(post: Post | undefined, label: string)}
	{#if post}
		<a
			href={post.url}
			class={[
				"flex flex-1 flex-col border px-4 py-3 text-quaternary first:items-start last:items-end last:text-right",
				"transition-colors duration-300 hover:border-gray-700 hover:text-tertiary",
			]}
		>
			<span class="truncate text-sm">{label}</span>
			<span class="truncate whitespace-nowrap text-primary">{post.title}</span>
		</a>
	{:else}
		<div class="flex-1"></div>
	{/if}
{/snippet}

<div class="flex flex-wrap items-stretch justify-between gap-3 @max-sm:flex-col-reverse">
	{@render PostNavigation(prev, "Previous")}
	{@render PostNavigation(next, "Next")}
</div>
