import type { Article } from '$lib/api/types';

export async function load(): Promise<{ articles: Article[] }> {
	const response: Response = await fetch(`http://localhost:5173/api/mock/news`, {
		method: 'GET'
	});

	return { articles: await response.json() };
}
