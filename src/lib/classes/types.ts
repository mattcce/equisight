export type Article = {
	id: string;
	title: string;
	providerDisplayName: string;
	summary: string;
	canonicalUrl: string;
	thumbnailUrl: string;
	timestamp: Date;
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
	timestamp: Date;
	close: number;
};

export type FinancialReport = {
	title: string;
	revenue: number;
	date: Date;
	eps: number;
	ebitda: number;
	netIncome: number;
	totalAssets: number;
	totalLiabilities: number;
	shareholderEquity: number;
	longTermDebt: number;
	cashAndEquivalents: number;
	operatingCashFlow: number;
	freeCashFlow: number;
	grossMargin: number;
	roe: number;
	roa: number;
	debtToEquity: number;
};

export type UserPreferences = {
	homeCurrency: string;
};
