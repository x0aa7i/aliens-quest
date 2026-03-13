<div class="mx-4 flex h-full w-full items-center overflow-hidden opacity-50" aria-hidden="true">
	<div class="animate-scroll flex h-7">
		{#each Array(2) as _, i (i)}
			<object data="/wave.svg" type="image/svg+xml" class="h-full" aria-hidden="true" title=""
			></object>
		{/each}
	</div>
</div>

<style>
	.animate-scroll {
		animation: scroll 90s linear infinite;
		will-change: transform;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
