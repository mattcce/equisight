import { apiClient } from '$lib/api/client';
import type { userWatchlistTickerPostPositionsResponsePayload } from '$lib/api/responses';
import { Direction, Position } from '$lib/classes/holding.svelte';
import { User } from '$lib/classes/user.svelte';

export const userStore: { user: User | undefined } = $state({ user: undefined });

export function clearUserData(): void {
	userStore.user = undefined;
}

export async function initialiseUser(): Promise<void> {
	const identifier = await apiClient(`/users/me`, { method: 'GET' })
		.then((r) => r.json())
		.then((r) => r.email);

	const user = new User(identifier);

	const watchlist = await apiClient(`/users/me/watchlist`, { method: 'GET' })
		.then((r) => r.json())
		.then((r) => r.tickers);

	watchlist.forEach((t) => user.addTicker(t));

	await Promise.all(
		watchlist.map((t) =>
			apiClient(`/users/me/watchlist/${t}/positions`, { method: 'GET' })
				.then((r) => r.json())
				.then((r) => r.positions)
				.then((ps) => {
					ps.forEach((p) => {
						const direction =
							p.direction === 'BUY'
								? Direction.BUY
								: p.direction === 'SELL'
									? Direction.SELL
									: (() => {
											throw new Error('Invalid direction');
										})();
						const { id, quantity, unitCost } = p;
						const createdAt = new Date(p.createdAt * 1000);

						user.addPosition(t, new Position(id, direction, quantity, unitCost, createdAt));
					});
				})
		)
	);

	userStore.user = user;
}

export async function commitAddTicker(ticker: string): Promise<boolean> {
	return apiClient(`/users/me/watchlist/${ticker}`, { method: 'POST' }).then((r) => r.ok);
}

export async function commitRemoveTicker(ticker: string): Promise<boolean> {
	return apiClient(`/users/me/watchlist/${ticker}`, { method: 'DELETE' }).then((r) => r.ok);
}

export async function commitAddPosition(
	ticker: string,
	direction: string,
	quantity: number,
	unitCost: number
): Promise<userWatchlistTickerPostPositionsResponsePayload | undefined> {
	return apiClient(`/users/me/watchlist/${ticker}/positions`, {
		method: 'POST',
		body: JSON.stringify({
			direction,
			quantity,
			unitCost
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((r) => {
		if (r.ok) {
			return r.json();
		} else {
			return undefined;
		}
	});
}

export async function commitRemovePosition(ticker: string, positionId: number): Promise<boolean> {
	return apiClient(`/users/me/watchlist/${ticker}/positions/${positionId}`, {
		method: 'DELETE'
	}).then((r) => r.ok);
}
