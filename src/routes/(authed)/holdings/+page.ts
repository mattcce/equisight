import { apiClient } from '$lib/api/client';
import { type TickerInfo } from '$lib/api/types';
import { Holding } from '$lib/classes/holding';
import { getUser } from '$lib/mock/user';

const user = getUser();

export async function load(): Promise<{
	tickers: string[];
	info: { [ticker: string]: TickerInfo };
	holdings: { [ticker: string]: Holding };
}> {
	const tickers: string[] = user.getAllHoldingsTickers();

	const tickersInfo = await Promise.all(
		tickers.map((t) =>
			apiClient(`/ticker/${t}/info`, { method: 'GET', credentials: 'include' })
				.then((r) => r.json())
				.then((i) => {
					return { [t]: i };
				})
		)
	);

	return {
		tickers,
		info: Object.assign({}, ...tickersInfo),
		holdings: user.holdings
	};
}
