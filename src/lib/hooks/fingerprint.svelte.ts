import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const VISITOR_ID_COOKIE_NAME = "cosmicExplorerId";

export let visitorId = $state({ current: "" });

export async function initializeVisitorId(): Promise<void> {
	const existingId = getCookie(VISITOR_ID_COOKIE_NAME);
	if (existingId) visitorId.current = existingId;

	try {
		const fp = await FingerprintJS.load();
		const result = await fp.get();

		if (!result.visitorId) {
			throw new Error("FingerprintJS returned empty visitorId");
		}

		setCookie(VISITOR_ID_COOKIE_NAME, result.visitorId, 31536000); // 1 year
		visitorId.current = result.visitorId;
	} catch (err) {
		console.error(err);
	}
}

export function getCookie(name: string): string | null {
	if (typeof document === "undefined") return null;

	const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]+)`));
	return match?.[2] ?? null;
}

export function setCookie(name: string, value: string, maxAgeSeconds: number): void {
	if (typeof document === "undefined") return;

	const cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
	document.cookie = cookie;
}
