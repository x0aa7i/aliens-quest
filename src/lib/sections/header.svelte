<script>
	const navLinks = [
		{ label: "Solutions", href: "/#explore" },
		// { label: "About", href: "/about" },
	];
</script>

<header class="container mx-auto mt-4 bg-gray-900 px-8 py-4">
	<nav class="mx-auto flex items-center justify-between">
		<a href="/" class="text-xl font-bold">Logo</a>
		<ul class="flex items-center gap-8">
			{#each navLinks as link (link.label)}
				<li><a href={link.href}>{link.label}</a></li>
			{/each}
		</ul>
	</nav>
</header>
