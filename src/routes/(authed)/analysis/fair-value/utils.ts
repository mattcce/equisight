export type FairValueQuery = {
	ticker: string;
	high: number;
	stable: number;
};
export type FairValueResult = {
	costOfEquity: number;
	costOfDebt: number;
	wacc: number;
	roic: number;
	expectedGrowthRate: number;
	fairValue: number;
};
export type FairValueReport = FairValueQuery & FairValueResult & { completedTimestamp: number };

export const displayQueryParameterRows = [
	{ key: 'ticker', display: 'Ticker' },
	{ key: 'high', display: 'High Growth Years' },
	{ key: 'stable', display: 'Stable Growth Years' }
];

export const displayReportRows = [
	{ key: 'costOfEquity', display: 'Cost of Equity' },
	{ key: 'costOfDebt', display: 'Cost of Debt' },
	{ key: 'wacc', display: 'WACC' },
	{ key: 'roic', display: 'ROIC' },
	{ key: 'expectedGrowthRate', display: 'Expected Growth Rate' },
	{ key: 'fairValue', display: 'Fair Value' }
];
