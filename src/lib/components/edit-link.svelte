<script lang="ts">
	import Edit from "lucide-svelte/icons/pencil-line";

	type Props = {
		slug: string;
	};

	const { slug }: Props = $props();
</script>

<a
	href={`https://github.com/x0aa7i/aliens-quest/edit/main/src/content/solutions/${slug}/index.md`}
	class="inline-flex items-center gap-1 font-normal text-indigo-300 transition-colors hover:text-indigo-200"
	target="_blank"
>
	<Edit class="mr-2 inline-block h-4 w-4" />
	Edit Page on GitHub
</a>
