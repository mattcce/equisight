import { apiClient } from '$lib/api/client';
import { type Article } from '$lib/api/types';
import { getUser } from '$lib/mock/user';

const user = getUser();

export async function load(): Promise<{ articles: Article[] }> {
	const tickers = user.getAllHoldingsTickers();

	const responses = await Promise.all(
		tickers.map((t) =>
			apiClient(`/ticker/${t}/news?count=5`, {
				method: 'GET'
			}).then((r) => r.json())
		)
	);

	const articles = responses.flatMap((a) => a.articles);
	articles.sort((a1, a2) => Number(a2.timestamp) - Number(a1.timestamp));

	return { articles };
}
