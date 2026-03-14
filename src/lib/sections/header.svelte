<script lang="ts">
	type NavLink = { label: string; href: string };

	const navLinks: NavLink[] = $derived([
		{ label: "Solutions", href: "/" }, // hidden on small screens
		{ label: "About", href: "/about" },
	]);
</script>

<header class="relative z-50 mx-auto w-full px-4 py-4 sm:px-8 md:container md:px-8 lg:px-10">
	<nav class="flex w-full flex-wrap items-center justify-between py-2 font-head">
		<a href="/" class="flex shrink-0 items-center gap-2 text-base font-medium text-primary">
			<img src="/logo.svg" width="26" height="14" alt="logo" class="h-4 w-auto" />
			<span class="">Aliens Quest</span>
		</a>

		<ul class="flex items-center gap-4 font-head font-medium text-tertiary md:gap-6">
			{#each navLinks as link (link.label)}
				<li class={link.label === "Solutions" ? "hidden sm:inline-block" : ""}>
					<a href={link.href} class="transition-colors hover:text-primary">{link.label}</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>
