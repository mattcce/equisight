import { apiClient } from '$lib/api/client';
import type { Article } from '$lib/classes/types';

export type NewsQuery = {
	completedTimestamp: number;
	requestParameters: {
		tickers: string[];
		articlesPerTicker: number;
	};
	articles: Article[];
};

export async function executeNewsQuery(
	tickers: string[],
	articlesPerTicker: number
): Promise<NewsQuery> {
	const responses = await Promise.all(
		tickers.map((t) =>
			apiClient(`/ticker/${t}/news?count=${articlesPerTicker}`, {
				method: 'GET'
			}).then((r) => r.json())
		)
	);

	const pooledArticles = responses.flatMap((a) => a.articles);

	// deduplicate list of articles
	const seen = new Set();
	const articles = [];

	for (const a of pooledArticles) {
		const key = a.id;
		if (seen.has(key)) {
			continue;
		}

		articles.push(a);
		seen.add(key);
	}

	articles.sort((a1, a2) => Number(a2.timestamp) - Number(a1.timestamp));

	const newsQuery = {
		completedTimestamp: Date.now(),
		requestParameters: {
			tickers,
			articlesPerTicker
		},
		articles
	};

	return newsQuery;
}
