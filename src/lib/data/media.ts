import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import moviesJson from "../../../content/media/movies.json";
import novelsJson from "../../../content/media/novels.json";
import seriesJson from "../../../content/media/series.json";

// Constants

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";
const BOOK_COVER_BASE_URL = "https://bookcover.longitood.com/bookcover";
const OPEN_LIBRARY_FALLBACK_COVER = "https://covers.openlibrary.org/b/olid";

const __root = join(dirname(fileURLToPath(import.meta.url)), "..");

const DATA_PATHS = {
	movies: join(__root, "./content/media/movies.json"),
	novels: join(__root, "./content/media/novels.json"),
	series: join(__root, "./content/media/series.json"),
} as const;

// Types

type MediaType = "movie" | "series" | "novel";

interface BaseMediaResponse {
	title: string;
	year?: number | string;
	overview?: string;
	cover: string;
}

export interface MovieResponse extends BaseMediaResponse {
	runtime: string;
}

export interface SeriesResponse extends BaseMediaResponse {}

export interface BookResponse extends BaseMediaResponse {
	authors: string[];
}

interface MediaFrontmatter {
	id: string;
	type: MediaType;
	badges: string[];
}

export type Movie = MovieResponse & MediaFrontmatter & { type: "movie" };
export type Series = SeriesResponse & MediaFrontmatter & { type: "series" };
export type Novel = BookResponse & MediaFrontmatter & { type: "novel" };

// TMDB API Types

interface TmdbBaseResponse {
	poster_path: string;
	overview: string;
	genres: { name: string }[];
}

interface TmdbMovieResponse extends TmdbBaseResponse {
	title: string;
	release_date: string;
	runtime: number;
}

interface TmdbSeriesResponse extends TmdbBaseResponse {
	name: string;
	first_air_date: string;
	number_of_seasons: number;
}

// Open Library API Types

interface OpenLibraryBookResponse {
	title: string;
	authors: { key: string }[];
	year_published?: number;
	first_publish_date?: string;
}

interface OpenLibraryAuthorResponse {
	name: string;
}

// Cache Types

interface MediaCache<T> {
	[id: string]: Omit<T, "id">;
}

const cache = {
	movies: moviesJson as MediaCache<MovieResponse>,
	series: seriesJson as MediaCache<SeriesResponse>,
	novels: novelsJson as MediaCache<BookResponse>,
};

// HTTP Helpers

async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText} — ${url}`);
	return response.json();
}

async function fetchTmdb<T>(endpoint: string): Promise<T> {
	if (!TMDB_API_KEY) throw new Error("TMDB_API_KEY is not set in environment variables");
	return fetchJson<T>(`${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}`);
}

async function fetchOpenLibrary<T>(endpoint: string): Promise<T> {
	return fetchJson<T>(`${OPEN_LIBRARY_BASE_URL}/${endpoint}.json`);
}

// Cache Helpers

async function persistCache(filePath: string, data: unknown): Promise<void> {
	await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function withCache<T>(
	id: string,
	store: { [id: string]: T },
	filePath: string,
	fetcher: (id: string) => Promise<T | null>
): Promise<T | null> {
	if (!id) throw new Error("ID is required");
	if (store[id]) return store[id];

	const data = await fetcher(id);
	if (data) {
		store[id] = data;
		await persistCache(filePath, store);
	}
	return data;
}

// Formatters

function formatRuntime(minutes: number): string {
	const h = Math.floor(minutes / 60);
	const m = (minutes % 60).toString().padStart(2, "0");
	return `${h}h ${m}min`;
}

function extractYear(dateString: string): string {
	return dateString.slice(0, 4);
}

function parseBookYear(data: OpenLibraryBookResponse): number {
	return data.year_published ?? parseInt(data.first_publish_date?.split(" ").pop() ?? "", 10);
}

// Fetchers

async function fetchMovie(id: string): Promise<Omit<MovieResponse, "id"> | null> {
	try {
		const data = await fetchTmdb<TmdbMovieResponse>(`movie/${id}`);
		return {
			title: data.title,
			year: extractYear(data.release_date),
			runtime: formatRuntime(data.runtime),
			overview: data.overview,
			cover: `${TMDB_POSTER_BASE_URL}/${data.poster_path}`,
		};
	} catch (error) {
		console.error(`Failed to fetch movie ${id}:`, error);
		return null;
	}
}

async function fetchSeries(id: string): Promise<Omit<SeriesResponse, "id"> | null> {
	try {
		const data = await fetchTmdb<TmdbSeriesResponse>(`tv/${id}`);
		return {
			title: data.name,
			year: extractYear(data.first_air_date),
			overview: data.overview,
			cover: `${TMDB_POSTER_BASE_URL}/${data.poster_path}`,
		};
	} catch (error) {
		console.error(`Failed to fetch series ${id}:`, error);
		return null;
	}
}

async function fetchBookCover(isbn: string): Promise<string> {
	try {
		const { url } = await fetchJson<{ url: string }>(`${BOOK_COVER_BASE_URL}/${isbn}`);
		return url;
	} catch {
		return `${OPEN_LIBRARY_FALLBACK_COVER}/${isbn}-M.jpg`;
	}
}

async function fetchNovel(id: string): Promise<Omit<BookResponse, "id"> | null> {
	try {
		const book = await fetchOpenLibrary<OpenLibraryBookResponse>(`isbn/${id}`);

		const authorKeys = book.authors.slice(0, 3).map((a) => a.key);
		const authors = await Promise.all(
			authorKeys.map((key) => fetchOpenLibrary<OpenLibraryAuthorResponse>(key))
		);

		return {
			title: book.title,
			authors: authors.map((a) => a.name),
			year: parseBookYear(book),
			cover: await fetchBookCover(id),
		};
	} catch (error) {
		console.error(`Failed to fetch novel ${id}:`, error);
		return null;
	}
}

// Public API

export function getMovie(id: string): Promise<MovieResponse | null> {
	return withCache(id, cache.movies, DATA_PATHS.movies, fetchMovie);
}

export function getSeries(id: string): Promise<SeriesResponse | null> {
	return withCache(id, cache.series, DATA_PATHS.series, fetchSeries);
}

export function getNovel(slug: string): Promise<BookResponse | null> {
	return withCache(slug, cache.novels, DATA_PATHS.novels, fetchNovel);
}

export function getMedia(id: string, type: "movie"): Promise<MovieResponse | null>;
export function getMedia(id: string, type: "series"): Promise<SeriesResponse | null>;
export function getMedia(id: string, type: "novel"): Promise<BookResponse | null>;
export function getMedia(
	id: string,
	type: MediaType
): Promise<MovieResponse | SeriesResponse | BookResponse | null>;
export function getMedia(
	id: string,
	type: MediaType
): Promise<MovieResponse | SeriesResponse | BookResponse | null> {
	switch (type) {
		case "movie":
			return getMovie(id);
		case "series":
			return getSeries(id);
		case "novel":
			return getNovel(id);
	}
}
