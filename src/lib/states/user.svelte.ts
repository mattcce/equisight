import { apiClient } from '$lib/api/mock-client';
import { Holding, Direction, Position } from '$lib/classes/holding.svelte';
import { User } from '$lib/classes/user.svelte';

export const user: User = $state(await initialiseUser());

async function initialiseUser(): Promise<User> {
	const user = new User('mock');

	const watchlist = await apiClient(`/users/me/watchlist`, { method: 'GET' })
		.then((r) => r.json())
		.then((r) => r.watchlist);

	await Promise.all(
		watchlist.map((t) =>
			apiClient(`/users/me/watchlist/${t}`, { method: 'GET' })
				.then((r) => r.json())
				.then((r) => r.positions)
				.then((ps) => {
					const holding = new Holding(t);

					ps.forEach((p) => {
						const direction =
							p.direction === 'BUY'
								? Direction.BUY
								: p.direction === 'SELL'
									? Direction.SELL
									: (() => {
											throw new Error('Invalid direction');
										})();
						const { quantity, unitCost } = p;
						const createdAt = new Date(p.createdAt);

						user.addPosition(t, new Position(direction, quantity, unitCost, createdAt));
					});

					return holding;
				})
		)
	);

	return user;
}
