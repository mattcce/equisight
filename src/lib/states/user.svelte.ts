import { toast } from 'svelte-sonner';

import { apiClient } from '$lib/api/client';
import { Direction, Position } from '$lib/classes/holding.svelte';
import type { UserPreferences } from '$lib/classes/types';
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
		.then(async (r) => r.json())
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

	const preferences = await apiClient(`/users/me/preferences`, { method: 'GET' })
		.then((r) => r.json())
		.then((r) => {
			return {
				homeCurrency: r.currency
			};
		});
	user.preferences = preferences;

	userStore.user = user;
}

export async function commitAddTicker(ticker: string): Promise<boolean> {
	const response = await apiClient(`/users/me/watchlist/${ticker}`, { method: 'POST' });

	if (!response.ok) {
		toast.error(`Failed to add ticker: ${ticker}. This ticker may not exist.`);
		return false;
	}

	userStore.user!.addTicker(ticker);
	return true;
}

export async function commitRemoveTicker(ticker: string): Promise<boolean> {
	const response = await apiClient(`/users/me/watchlist/${ticker}`, { method: 'DELETE' });

	if (!response.ok) {
		toast.error(`Failed to remove ticker: ${ticker}.`);
		return false;
	}

	userStore.user!.removeTicker(ticker);
	return false;
}

export async function commitAddPosition(
	ticker: string,
	direction: string,
	quantity: number,
	unitCost: number
): Promise<boolean> {
	const response = await apiClient(`/users/me/watchlist/${ticker}/positions`, {
		method: 'POST',
		body: JSON.stringify({
			direction,
			quantity,
			unitCost
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		toast.error(`Failed to add position: inputs may be invalid.`);
		return false;
	}

	const result = await response.json();
	const id = result.id;
	const createdAt = new Date(result.createdAt * 1000);

	const newPosition = new Position(
		id,
		direction === 'BUY' ? Direction.BUY : Direction.SELL,
		quantity,
		unitCost,
		createdAt
	);

	userStore.user!.addPosition(ticker, newPosition);
	return true;
}

export async function commitRemovePosition(ticker: string, positionId: number): Promise<boolean> {
	const response = await apiClient(`/users/me/watchlist/${ticker}/positions/${positionId}`, {
		method: 'DELETE'
	});

	if (!response.ok) {
		toast.error(`Failed to remove position for ticker ${ticker}.`);
		return false;
	}

	userStore.user!.removePosition(ticker, positionId);
	return true;
}

export async function commitPreferences(preferences: UserPreferences): Promise<boolean> {
	const response = await apiClient(`/users/me/preferences`, {
		method: 'PUT',
		body: JSON.stringify({
			currency: preferences.homeCurrency
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		toast.error('Failed to update settings.');
		return false;
	}

	userStore.user!.preferences = preferences;
	toast.success('Settings updated!');
	return true;
}
