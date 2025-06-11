import { apiClient } from '$lib/api/client';
import { type TickerInfo } from '$lib/api/types';
import { Holding } from '$lib/classes/holding';
import { getUser } from '$lib/mock/user';

const user = getUser();

export async function load({ params }): Promise<{
	ticker: string;
	info: TickerInfo;
	holding: Holding;
}> {
	const ticker = params.ticker;
	const holding = user.holdings[ticker];

	const tickerInfo = await apiClient(`/ticker/${ticker}/info`, {
		method: 'GET'
	}).then((r) => r.json());

	return {
		ticker,
		info: tickerInfo,
		holding
	};
}
