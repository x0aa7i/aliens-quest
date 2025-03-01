const m = 4294967296; // modulus = 2^32
const a = 1664525; // multiplier
const c = 1013904223; // increment

let lcgState: number;

function lcg(): number {
	lcgState = (a * lcgState + c) % m;
	return lcgState / m;
}

function lcgSetSeed(seed: number): void {
	lcgState = (seed == null ? Math.random() * m : seed) >>> 0;
}

/**
 * Sets the seed for the random number generator.
 * @param seed - Seed value
 */
export function setRandomSeed(seed: number): void {
	lcgSetSeed(seed);
}

/**
 * Generates random numbers with various input patterns
 * @param min - Minimum value or array to pick from
 * @param max - Maximum value (exclusive)
 * @returns Random number or array element
 * @throws Error if input parameters are invalid
 *
 * @example
 * // Returns float in [0, 1)
 * random()
 *
 * @example
 * // Returns float in [0, max)
 * random(5)
 *
 * @example
 * // Returns float in [min, max)
 * random(1, 10)
 *
 * @example
 * // Returns random element from array
 * random([1, 2, 3, 4, 5])
 */
export function random(): number;
export function random(min: number, max: number): number;
export function random<T>(array: T[]): T;
export function random<T>(min?: number | T[], max?: number): number | T {
	let rand: number;

	if (lcgState !== undefined) {
		rand = lcg(); // Use LCG if seeded
	} else {
		rand = Math.random(); // Fallback to Math.random
	}

	if (min === undefined) {
		return rand; // Return float in [0, 1)
	}

	if (Array.isArray(min)) {
		if (min.length === 0) {
			throw new Error("Cannot get random element from empty array");
		}
		return min[Math.floor(rand * min.length)];
	}

	if (max === undefined) {
		if (min < 0) {
			throw new Error("Upper bound must be non-negative when used as single parameter");
		}
		// Return float in [0, min)
		return rand * min;
	}

	// Validate numeric inputs
	if (!Number.isFinite(min) || !Number.isFinite(max)) {
		throw new Error("Both min and max must be finite numbers");
	}

	// Swap min and max if min > max
	if (min > max) {
		[min, max] = [max, min];
	}

	// Return float in [min, max)
	return rand * (max - min) + min;
}
