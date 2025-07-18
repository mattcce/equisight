import { apiClient } from '$lib/api/client';
import type { PriceDataFrame } from '$lib/classes/types';

export const tickerPriceHistoryRetrievers: {
	[period: string]: (ticker: string) => Promise<PriceDataFrame>;
} = {
	'1D': async (ticker: string) => {
		const {
			marketOpen,
			marketClose,
			intraday
		}: {
			marketOpen: number;
			marketClose: number;
			intraday: { timestamp: number; close: number }[];
		} = await apiClient(`/ticker/${ticker}/intraday`, {
			method: 'GET'
		}).then((r) => r.json());

		const priceData = intraday.map((e) => {
			return { timestamp: new Date(e.timestamp * 1000), close: e.close };
		});

		const prices = priceData.map((e) => e.close);
		const minPrice = Math.min(...prices);
		const maxPrice = Math.max(...prices);

		return {
			marketOpen: new Date(marketOpen * 1000),
			marketClose: new Date(marketClose * 1000),
			minPrice,
			maxPrice,
			priceData
		};
	},
	'1W': historyRouteRetrieverFactory(0, 0, 7),
	'1M': historyRouteRetrieverFactory(0, 1, 0),
	'1Y': historyRouteRetrieverFactory(1, 0, 0),
	'5Y': historyRouteRetrieverFactory(5, 0, 0),
	All: async (ticker: string) => {
		const {
			earliestDate,
			latestDate,
			allTimeHistory
		}: {
			earliestDate: number;
			latestDate: number;
			allTimeHistory: { timestamp: number; close: number }[];
		} = await apiClient(`/ticker/${ticker}/all-time`, {
			method: 'GET'
		}).then((r) => r.json());

		const priceData = allTimeHistory.map((e) => {
			return { timestamp: new Date(e.timestamp * 1000), close: e.close };
		});

		const prices = priceData.map((e) => e.close);
		const minPrice = Math.min(...prices);
		const maxPrice = Math.max(...prices);

		return {
			marketOpen: new Date(earliestDate * 1000),
			marketClose: new Date(latestDate * 1000),
			minPrice,
			maxPrice,
			priceData
		};
	}
};

function historyRouteRetrieverFactory(
	yearsAgo: number,
	monthsAgo: number,
	daysAgo: number
): (ticker: string) => Promise<PriceDataFrame> {
	return async (ticker: string) => {
		const { start, end } = getDateInterval(yearsAgo, monthsAgo, daysAgo);

		const { history } = await apiClient(`/ticker/${ticker}/history?start=${start}&end=${end}`, {
			method: 'GET'
		}).then((r) => r.json());

		console.log(history);
		const marketOpen = new Date(history[0].timestamp * 1000);
		const marketClose = new Date(history[history.length - 1].timestamp * 1000);

		const priceData = history.map((e) => {
			return { timestamp: new Date(e.timestamp * 1000), close: e.close };
		});

		const prices = priceData.map((e) => e.close);
		const minPrice = Math.min(...prices);
		const maxPrice = Math.max(...prices);

		return {
			marketOpen,
			marketClose,
			minPrice,
			maxPrice,
			priceData
		};
	};
}

function getDateInterval(
	yearsAgo: number,
	monthsAgo: number,
	daysAgo: number
): { start: string; end: string } {
	const date = new Date();

	const end = date.toISOString().split('T')[0];

	date.setFullYear(date.getFullYear() - yearsAgo);
	date.setMonth(date.getMonth() - monthsAgo);
	date.setDate(date.getDate() - daysAgo);

	const start = date.toISOString().split('T')[0];

	return { start, end };
}

export const displayRows = [
	{ key: 'revenue', display: 'Revenue' },
	{ key: 'eps', display: 'EPS' },
	{ key: 'ebitda', display: 'EBITDA' },
	{ key: 'netIncome', display: 'Net Income' },
	{ key: 'totalAssets', display: 'Total Assets' },
	{ key: 'totalLiabilities', display: 'Total Liabilities' },
	{ key: 'shareholderEquity', display: 'Shareholder Equity' },
	{ key: 'longTermDebt', display: 'Long Term Debt' },
	{ key: 'cashAndEquivalents', display: 'Cash and Equivalents' },
	{ key: 'operatingCashFlow', display: 'Operating Cash Flow' },
	{ key: 'freeCashFlow', display: 'Free Cash Flow' },
	{ key: 'grossMargin', display: 'Gross Margin' },
	{ key: 'roe', display: 'ROE' },
	{ key: 'roa', display: 'ROA' },
	{ key: 'debtToEquity', display: 'Debt : Equity' }
];
