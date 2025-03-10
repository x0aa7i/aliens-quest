<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: _class }: Props = $props();

	type NavLink = { label: string; href: string };

	const navLinks: NavLink[] = [
		// { label: "Explore", href: "/solutions" },
		// { label: "About", href: "/about" },
	];
</script>

<header class={["container mx-auto px-4 py-4 lg:px-6 xl:px-8", _class]}>
	<nav class="mx-auto flex items-center justify-between">
		<a href="/" class="text-xl font-bold text-gray-50">
			<img src="/logo.svg" alt="logo" class="h-8 w-auto" />
		</a>
		<ul class="flex items-center gap-8 text-sm font-medium text-gray-200">
			{#each navLinks as link (link.label)}
				<li><a href={link.href}>{link.label}</a></li>
			{/each}
		</ul>
	</nav>
</header>
