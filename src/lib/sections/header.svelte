<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: _class }: Props = $props();

	type NavLink = { label: string; href: string };

	const navLinks: NavLink[] = [
		{ label: "Explore", href: "/#explore" },
		{ label: "About", href: "/about" },
	];
</script>

<header class={["container mx-auto px-4 py-4 lg:px-6 xl:px-8", _class]}>
	<nav class="mx-auto flex items-center justify-between">
		<a href="/" class="text-xl font-bold text-gray-50">
			<img src="/logo.svg" width="87" height="28" alt="logo" class="h-8 w-auto" />
		</a>
		<ul class="flex items-center gap-6 text-sm font-medium uppercase text-gray-300 md:gap-8">
			{#each navLinks as link (link.label)}
				<li><a href={link.href} class="transition-colors hover:text-gray-50">{link.label}</a></li>
			{/each}
		</ul>
	</nav>
</header>
