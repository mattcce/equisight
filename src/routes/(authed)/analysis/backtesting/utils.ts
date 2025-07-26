export type BacktestQuery = {
	ticker: string;
	purchaseDate: string;
	currentDate: string;
	investmentType: string;
	lumpSumAmount?: number;
	dcaAmount?: number;
	dcaFrequency?: string;
};
export type BacktestResult = BacktestQuery & {
	totalInvested: number;
	totalSharesPurchased: number;
	averagePurchasePrice: number;
	currentPrice: number;
	currentValue: number;
	totalReturn: number;
	totalReturnPercentage: number;
	annualizedReturn: number;
	daysHeld: number;
	numberOfPurchases: number;
};
export type BacktestReport = BacktestQuery &
	BacktestResult & {
		completedTimestamp: number;
	};

export const displayQueryParameterRows = [
	{ key: 'ticker', display: 'Ticker' },
	{ key: 'purchaseDate', display: 'Purchase Date' },
	{ key: 'sellDate', display: 'Close Position Date' },
	{ key: 'currentDate', display: 'End Date' },
	{ key: 'investmentType', display: 'Investment Type' },
	{ key: 'lumpSumAmount', display: 'Lump Sum Amount' },
	{ key: 'dcaAmount', display: 'DCA Amount' },
	{ key: 'dcaFrequency', display: 'DCA Frequency' }
];

export const displayReportRows = [
	{ key: 'totalInvested', display: 'Total Invested' },
	{ key: 'totalSharesPurchased', display: 'Total Shares Purchased' },
	{ key: 'averagePurchasePrice', display: 'Average Purchase Price' },
	{ key: 'currentPrice', display: 'Current Price' },
	{ key: 'currentValue', display: 'Current Value' },
	{ key: 'totalReturn', display: 'Total Return' },
	{ key: 'totalReturnPercentage', display: 'Total Return (%)' },
	{ key: 'annualizedReturn', display: 'Annualised Return (%)' },
	{ key: 'daysHeld', display: 'Days Held' },
	{ key: 'numberOfPurchases', display: 'Number of Purchases' }
];
