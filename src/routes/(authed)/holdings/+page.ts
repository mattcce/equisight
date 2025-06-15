import { apiClient } from '$lib/api/client';
import { Holding } from '$lib/classes/holding';
import { type TickerInfo } from '$lib/classes/types';
import { initialiseCurrentUser, User, userStore } from '$lib/classes/user.svelte';

export async function load({ depends }): Promise<{
	user: User;
	info: { [ticker: string]: TickerInfo };
	watchlist: { [ticker: string]: Holding };
}> {
	depends('data:tickerInfo');

	await initialiseCurrentUser();
	const user = userStore.user;

	const tickers: string[] = user.watchlistTickers;

	const tickersInfo = await Promise.all(
		tickers.map((t) =>
			apiClient(`/ticker/${t}/info`, { method: 'GET' })
				.then((r) => r.json())
				.then((i) => {
					return { [t]: i };
				})
		)
	);

	return {
		user,
		info: Object.assign({}, ...tickersInfo)
	};
}
