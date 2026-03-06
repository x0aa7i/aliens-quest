<script lang="ts">
	type Props = {
		class?: string;
	};

	let { class: _class }: Props = $props();

	type NavLink = { label: string; href: string };

	const navLinks: NavLink[] = [
		{ label: "Solutions", href: "/" },
		{ label: "Fermi Paradox", href: "/" },
		{ label: "About", href: "/about" },
	];
</script>

<header class={["container  mx-auto px-4 py-4 lg:px-8", _class]}>
	<nav class="flex flex-wrap items-center justify-between py-2 font-head">
		<a href="/" class="flex shrink-0 items-center gap-2 text-base font-medium text-gray-50">
			<img src="/logo.svg" width="26" height="14" alt="logo" class="h-4 w-auto" />
			<span class="">Aliens Quest</span>
		</a>

		<ul class="flex items-center gap-5 font-head font-medium text-gray-400 md:gap-8">
			{#each navLinks as link (link.label)}
				<li><a href={link.href} class="transition-colors hover:text-gray-100">{link.label}</a></li>
			{/each}
		</ul>
	</nav>
</header>
