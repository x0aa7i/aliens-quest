import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import booksJson from "../../content/media/books.json";
import moviesJson from "../../content/media/movies.json";
import tvJson from "../../content/media/tv.json";

interface MediaResponse {
	title: string;
	year?: number | string;
	overview?: string;
}

interface MovieResponse extends MediaResponse {
	poster: string;
	runtime: string;
}

interface TvResponse extends MediaResponse {
	poster: string;
}

interface BookResponse extends MediaResponse {
	authors: string[];
	cover: string;
}

type MediaType = "movie" | "tv" | "book";

interface MediaFrontmatter {
	id: string;
	type: MediaType;
	badges: string[];
}

export type Movie = MovieResponse & MediaFrontmatter & { type: "movie" };
export type Tv = TvResponse & MediaFrontmatter & { type: "tv" };
export type Book = BookResponse & MediaFrontmatter & { type: "book" };

type MovieJson = Omit<MovieResponse, "id">;
type TvJson = Omit<TvResponse, "id">;
type BookJson = Omit<BookResponse, "id">;

interface TmdbResponse {
	poster_path: string;
	overview: string;
	genres: { name: string }[];
}

interface TmdbMovieResponse extends TmdbResponse {
	title: string;
	release_date: string;
	runtime: number;
}

interface TmdbTvResponse extends TmdbResponse {
	name: string;
	first_air_date: string;
	number_of_seasons: number;
}

interface OpenLibraryBookResponse {
	title: string;
	authors: { key: string }[];
	// json response schema is not consistent
	year_published?: number;
	first_publish_date?: string;
}

interface OpenLibraryAuthorResponse {
	name: string;
}

type BookData = {
	bySlug: { [key: string]: string };
	entries: { [key: string]: BookJson };
};

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";
const BOOK_COVER_BASE_URL = "https://bookcover.longitood.com/bookcover";

const __filename = fileURLToPath(import.meta.url);
const __root = join(dirname(__filename), "..");

const dataPaths = {
	movies: join(__root, "./src/content/media/movies.json"),
	books: join(__root, "./src/content/media/books.json"),
	tv: join(__root, "./src/content/media/tv.json"),
};

const cachedData = {
	movies: moviesJson as { [id: string]: MovieJson },
	books: booksJson as BookData,
	tv: tvJson as { [id: string]: TvJson },
};

async function cacheMedia<T>(
	id: string,
	cache: { [id: string]: T },
	filePath: string,
	fetcher: (id: string) => Promise<T | null>
): Promise<T | null> {
	if (!id) {
		throw new Error("ID is required");
	}

	if (cache[id]) return cache[id];

	const data = await fetcher(id);
	if (data) {
		cache[id] = data;
		await fs.writeFile(filePath, JSON.stringify(cache, null, 2));
	}
	return data;
}

async function cacheBook(
	slug: string,
	cache: BookData,
	filePath: string,
	fetcher: (id: string) => Promise<BookJson | null>
): Promise<BookResponse | null> {
	if (!slug) {
		throw new Error("Slug is required");
	}

	const id = cache.bySlug[slug];
	if (cache.entries[id]) return cache.entries[id];

	const data = await fetcher(id);
	if (data) {
		cache.entries[id] = data;
		console.dir(filePath);
		await fs.writeFile(filePath, JSON.stringify(cache, null, 2));
	}
	return data;
}

export async function getMovie(id: string): Promise<MovieResponse | null> {
	return cacheMedia(id, cachedData.movies, dataPaths.movies, fetchMovie);
}

async function fetchMovie(id: string): Promise<MovieJson | null> {
	try {
		const data = await fetchTmdbData<TmdbMovieResponse>(`movie/${id}`);
		return {
			poster: `${TMDB_POSTER_BASE_URL}/${data.poster_path}`,
			title: data.title,
			year: data.release_date.slice(0, 4),
			runtime: formatRuntime(data.runtime),
			overview: data.overview,
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getTv(id: string): Promise<TvResponse | null> {
	return cacheMedia(id, cachedData.tv, dataPaths.tv, fetchTv);
}

async function fetchTv(id: string): Promise<TvJson | null> {
	try {
		const data = await fetchTmdbData<TmdbTvResponse>(`tv/${id}`);
		return {
			poster: `${TMDB_POSTER_BASE_URL}/${data.poster_path}`,
			title: data.name,
			year: data.first_air_date.slice(0, 4),
			overview: data.overview,
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getBook(slug: string): Promise<BookResponse | null> {
	return cacheBook(slug, cachedData.books, dataPaths.books, fetchBook);
}

async function fetchBook(id: string): Promise<BookJson | null> {
	try {
		const data = await fetchBookData<OpenLibraryBookResponse>(`isbn/${id}`);

		const authors = await Promise.all(
			data.authors
				.slice(0, 3)
				.map((author) => fetchBookData<OpenLibraryAuthorResponse>(`${author.key}`))
		);

		const year =
			data.year_published ?? parseInt(data.first_publish_date?.split(" ").pop() ?? "", 10);

		return {
			title: data.title,
			authors: authors.map((author) => author.name),
			year: year,
			cover: await fetchBookCover(id),
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function fetchBookCover(id: string): Promise<string> {
	try {
		const response = await fetch(`${BOOK_COVER_BASE_URL}/${id}`);
		if (!response.ok) throw new Error(response.statusText);
		const jsonData: { url: string } = await response.json();
		return jsonData.url;
	} catch (error) {
		console.error(error);
		return `https://covers.openlibrary.org/b/olid/${id}-M.jpg`;
	}
}

async function fetchBookData<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${OPEN_LIBRARY_BASE_URL}/${endpoint}.json`);
	if (!response.ok) {
		throw new Error(`Failed to fetch book data: ${response.statusText}`);
	}
	return response.json();
}

async function fetchTmdbData<T>(endpoint: string): Promise<T> {
	if (!TMDB_API_KEY) {
		console.log(import.meta.env);
		console.log(process.env);
		throw new Error("TMDB API key is not set");
	}

	const url = `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}`;
	const response = await fetch(url);
	if (!response.ok) throw new Error(response.statusText);
	return response.json();
}

function formatRuntime(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return `${hours}h ${remainingMinutes.toString().padStart(2, "0")}min`;
}
