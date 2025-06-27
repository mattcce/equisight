import { apiClient } from '$lib/api/client';
import { type TickerInfo } from '$lib/classes/types';
import { userStore } from '$lib/states/user.svelte';

export async function load({ depends }): Promise<{
	info: { [ticker: string]: TickerInfo };
}> {
	depends('data:tickerInfo');

	const tickers: string[] = userStore.user!.watchlistTickers;

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
		info: Object.assign({}, ...tickersInfo)
	};
}
