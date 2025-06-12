export type tickerNewsResponsePayload = {
	articles: {
		id: string;
		title: string;
		providerDisplayName: string;
		summary: string;
		canonicalUrl: string;
		thumbnailUrl: string;
		timestamp: number;
	}[];
};

export type tickerInfoResponsePayload = {
	symbol: string;
	fullExchangeName: string;
	shortName: string;
	regularMarketPrice: number;
	marketState: string;
	region: string;
	currency: string;
	previousClose: number;
};

export type tickerIntradayResponsePayload = {
	intraday: { timestamp: number; close: number }[];
	marketOpen: number;
	marketClose: number;
};

export type tickerQuarterlyReportsResposePayload = {
	quarterlyReports: {
		ticker: string;
		revenue: number;
		quarterEndDate: number;
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
	}[];
};

export type tickerAnnualReportsResposePayload = {
	annualReports: {
		ticker: string;
		revenue: number;
		yearEndDate: number;
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
	}[];
};
