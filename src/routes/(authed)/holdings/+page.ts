import { apiClient } from '$lib/api/client';
import { type TickerInfo } from '$lib/classes/types';
import { userStore } from '$lib/states/user.svelte';

export async function load({ depends }): Promise<{
	info: { [ticker: string]: TickerInfo };
	homeCurrency: string;
	forexRates: {
		[sourceCurrency: string]: number;
	};
}> {
	depends('data:holdings');

	let tickers: string[] = userStore.user!.watchlistTickers;

	const info = Object.assign(
		{},
		...(await Promise.all(
			tickers.map((t) =>
				apiClient(`/ticker/${t}/info`, { method: 'GET' }).then((r) => {
					if (r.ok) {
						return r.json().then((i) => {
							return { [t]: i };
						});
					} else {
						return {};
					}
				})
			)
		))
	);

	tickers = tickers.filter((t) => t in info); // remove invalid tickers

	// extract and deduplicate source currencies
	const seen = new Set();
	const sourceCurrencies = [];

	for (const t of tickers) {
		const currency = info[t].currency;
		if (seen.has(currency)) {
			continue;
		}

		sourceCurrencies.push(currency);
		seen.add(currency);
	}

	const homeCurrency = userStore.user!.homeCurrency;

	const forexRates = await Promise.all(
		sourceCurrencies.map((c) =>
			apiClient(`/forex?fromCur=${c}&toCur=${homeCurrency}`, { method: 'GET' })
				.then((r) => r.json())
				.then((r) => r.forexRate)
				.then((r) => {
					return { [c]: r };
				})
		)
	);

	return {
		info,
		homeCurrency,
		forexRates: Object.assign({}, ...forexRates)
	};
}
