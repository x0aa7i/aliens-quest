<script lang="ts">
	import Edit from "~icons/bx/edit-alt";

	type Props = {
		slug: string;
	};

	const { slug }: Props = $props();
</script>

<a
	href={`https://github.com/x0aa7i/aliens-quest/edit/main/content/solutions/${slug}/index.md`}
	class="inline-flex items-center gap-1 text-base font-normal text-indigo-300 transition-colors hover:text-indigo-200"
	target="_blank"
>
	<Edit class="mt-px mr-2 inline-block h-4 w-4" />
	Edit Page on GitHub
</a>
