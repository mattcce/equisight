import { apiClient } from '$lib/api/client';
import type { TickerInfo, FinancialReport } from '$lib/classes/types';
import { formatDate } from '$lib/utils';

export async function load({ params }): Promise<{
	ticker: string;
	info: TickerInfo;
	quarterlyReports: FinancialReport[];
	annualReports: FinancialReport[];
}> {
	const ticker = params.ticker;

	const info = await apiClient(`/ticker/${ticker}/info`, {
		method: 'GET'
	}).then((r) => r.json());

	const quarterlyReports: FinancialReport[] = await apiClient(
		`/ticker/${ticker}/quarterly-reports`,
		{
			method: 'GET'
		}
	)
		.then((r) => r.json())
		.then((r) => r.quarterlyReports)
		.then((rs) =>
			rs.map((r) => {
				r.date = new Date(r.quarterEndDate * 1000);
				r.title = formatDate(r.date);
				return r;
			})
		);

	const annualReports: FinancialReport[] = await apiClient(`/ticker/${ticker}/annual-reports`, {
		method: 'GET'
	})
		.then((r) => r.json())
		.then((r) => r.annualReports)
		.then((rs) =>
			rs.map((r) => {
				r.date = new Date(r.yearEndDate * 1000);
				r.title = formatDate(r.date);
				return r;
			})
		);

	return {
		ticker,
		info,
		quarterlyReports,
		annualReports
	};
}
