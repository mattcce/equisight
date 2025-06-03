export type Article = {
	id: string;
	title: string;
	providerDisplayName: string;
	summary: string;
	canonicalUrl: string;
	thumbnailUrl: string;
	timestamp: string;
};

export type TickerInfo = {
	symbol: string;
	fullExchangeName: string;
	shortName: string;
	regularMarketPrice: number;
	marketState: string;
	region: string;
	currency: string;
	previousClose: number;
};

export type PriceHistoryEntry = {
	timestamp: string;
	close: number;
};
