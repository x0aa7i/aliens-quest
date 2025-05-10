<script lang="ts">
	import type { CardProps } from ".";
	import type { Book, Movie, Tv } from "$lib/utils/media";

	import Calendar from "~icons/ri/calendar-line";
	import Timer from "~icons/ri/timer-line";
	import User from "~icons/ri/user-3-line";

	import MediaCard from "./media-card.svelte";

	type Media = Movie | Tv | Book;

	interface Props {
		media: Media[];
	}

	let { media }: Props = $props();

	const getCardProps = (data: Media): CardProps => {
		if (!data) throw new Error("Data is required");

		const type = data.type;
		const commonProps = {
			title: data.title,
			poster: "poster" in data ? data.poster : data.cover,
			overview: data.overview,
			badges: data.badges,
		};

		switch (data.type) {
			case "movie":
				return {
					...commonProps,
					metadata: [
						{ Icon: Calendar, value: data.year, label: "Year" },
						{ Icon: Timer, value: data.runtime, label: "Runtime" },
					],
				};
			case "tv":
				return {
					...commonProps,
					metadata: [{ Icon: Calendar, value: data.year, label: "Year" }],
				};
			case "book":
				return {
					...commonProps,
					metadata: [
						{ Icon: Calendar, value: data.year, label: "First Published" },
						{ Icon: User, value: data.authors?.join(", "), label: "Authors" },
					],
				};
			default:
				throw new Error(`Unsupported media type: ${type}`);
		}
	};
</script>

<div class="mt-4 flex flex-wrap gap-4">
	{#each media as data (data.id)}
		<MediaCard {...getCardProps(data)} />
	{/each}
</div>
