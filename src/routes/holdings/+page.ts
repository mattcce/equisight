import { API_DOMAIN } from '$lib/api/locations.js';
import { type TickerInfo } from '$lib/api/types';
import { Holding } from '$lib/classes/holding';
import { getUser } from '$lib/mock/user';

const user = getUser();

export async function load({ fetch }): Promise<{
	tickers: string[];
	info: { [ticker: string]: TickerInfo };
	holdings: { [ticker: string]: Holding };
}> {
	const tickers: string[] = user.getAllHoldingsTickers();

	const tickersInfo = await Promise.all(
		tickers.map((t) =>
			fetch(`http://${API_DOMAIN}/ticker/${t}/info`, { method: 'GET' })
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
