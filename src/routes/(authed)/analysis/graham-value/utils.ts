export type GrahamValueQuery = {
	ticker: string;
	terminal: number;
	growth: number;
};
export type GrahamValueResult = {
	wacc: number;
	impliedGrowthRate: number;
	grahamValue: number;
};
export type GrahamValueReport = GrahamValueQuery &
	GrahamValueResult & { completedTimestamp: number };

export const displayQueryParameterRows = [
	{ key: 'ticker', display: 'Ticker' },
	{ key: 'terminal', display: 'Assumed Terminal Growth Rate (%)' },
	{ key: 'growth', display: 'Assumed Continuous Growth Period (years)' }
];

export const displayReportRows = [
	{ key: 'wacc', display: 'WACC' },
	{ key: 'impliedGrowthRate', display: 'Implied Growth Rate (%)' },
	{ key: 'grahamValue', display: 'Graham Value' }
];
