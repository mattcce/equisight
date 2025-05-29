interface Article {
	id: string;
	content: {
		thumbnail: {
			originalUrl: string;
		};
		clickThroughUrl: {
			url: string;
		};
		title: string;
		provider: {
			displayName: string;
		};
		summary: string;
	};
}

export async function load(): Promise<{ articles: Article[] }> {
	const response: Response = await fetch(`http://localhost:5173/api/mock/news`, {
		method: 'GET'
	});

	return { articles: await response.json() };
}
