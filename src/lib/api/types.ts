export interface Article {
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

export type TickerInfo = {
	symbol: string;
	fullExchangeName: string;
	shortName: string;
	regularMarketPrice: number;
	marketState: string;
	region: string;
	currency: string;
};

export type PriceTimeSeries = { date: string; value: number }[];
