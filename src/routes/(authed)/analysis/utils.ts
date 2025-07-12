export const tools = [
	{
		title: 'Backtesting',
		description:
			'Obtain theoretical gains based on investment strategy on a ticker with historical data.',
		route: '/analysis/backtesting'
	},
	{
		title: 'Fair Valuation (Damodaran)',
		description: "Get calculated fair value of a ticker based on Damodaran's models.",
		route: '/analysis/fair-value'
	},
	{
		title: 'Fair Valuation (Graham)',
		description:
			'Gets current market price to get implied growth rate, and uses that growth rate with the Graham Formula to obtain a fair value estimate.',
		route: '/analysis/graham-value'
	}
];
