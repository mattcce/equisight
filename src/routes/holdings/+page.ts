import { type TickerInfo, type PriceTimeSeries } from '$lib/api/types';

const tickers = ['VTI', 'VTI', 'VTI', 'VTI', 'VTI', 'VTI'];

export async function load({
	fetch
}): Promise<{ tickers: TickerInfo[]; prices: { [ticker: string]: PriceTimeSeries } }> {
	const tickerInfoResponses: Response[] = await Promise.all(
		tickers.map((t) => fetch(`/api/mock/ticker/${t}`, { method: 'GET' }))
	);

	const tickerPriceTimeSeriesResponses: Response[] = await Promise.all(
		tickers.map((t) => fetch(`/api/mock/ticker/${t}/price`, { method: 'GET' }))
	);
	const prices: { [ticker: string]: PriceTimeSeries } = Object.assign(
		{},
		...(await Promise.all(tickerPriceTimeSeriesResponses.map((r) => r.json())))
	);

	return {
		tickers: await Promise.all(tickerInfoResponses.map((r) => r.json())),
		prices
	};
}
