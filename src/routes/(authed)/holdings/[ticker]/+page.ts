import { apiClient } from '$lib/api/client';
import { type TickerInfo, type PriceHistoryEntry } from '$lib/api/types';
import { Holding } from '$lib/classes/holding';
import { getUser } from '$lib/mock/user';

const user = getUser();

export async function load({ params }): Promise<{
	ticker: string;
	info: TickerInfo;
	holding: Holding;
	marketOpen: Date;
	marketClose: Date;
	intradayPrices: PriceHistoryEntry[];
	intradayMin: number;
	intradayMax: number;
}> {
	const ticker = params.ticker;
	const holding = user.holdings[ticker];

	const info = await apiClient(`/ticker/${ticker}/info`, {
		method: 'GET'
	}).then((r) => r.json());

	const {
		marketOpen,
		marketClose,
		intraday
	}: { marketOpen: number; marketClose: number; intraday: { timestamp: number; close: number }[] } =
		await apiClient(`/ticker/${ticker}/intraday`, {
			method: 'GET'
		}).then((r) => r.json());

	const prices = intraday.map((e) => e.close);

	const resample = (
		x: { timestamp: Date; close: number }[]
	): { timestamp: Date; close: number }[] => {
		let currTS = undefined;
		let closeSum = 0.0;
		let count = 0;
		const limit = 1;
		const res = [];

		for (const o of x) {
			const { timestamp, close } = o;
			currTS = currTS ?? timestamp;
			closeSum += close;
			count += 1;

			if (count === limit + 1) {
				res.push({ timestamp: currTS, close: closeSum / (limit + 1) });

				closeSum = 0.0;
				currTS = undefined;
				count = 0;
			}
		}

		return res;
	};

	const intradayPrices = resample(
		intraday.map((e) => {
			return {
				timestamp: new Date(e.timestamp * 1000),
				close: e.close
			};
		})
	);

	const intradayMin = Math.min(...prices);
	const intradayMax = Math.max(...prices);

	return {
		ticker,
		info,
		holding,
		marketOpen: new Date(marketOpen * 1000),
		marketClose: new Date(marketClose * 1000),
		intradayPrices,
		intradayMin,
		intradayMax
	};
}
