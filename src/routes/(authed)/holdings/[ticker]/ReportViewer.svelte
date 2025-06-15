<script lang="ts">
	import type { FinancialReport } from '$lib/classes/types';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import { formatNumber } from '$lib/utils';

	const { reports }: { reports: FinancialReport[] } = $props();

	const displayRows = [
		{ key: 'revenue', display: 'Revenue' },
		{ key: 'eps', display: 'EPS' },
		{ key: 'ebitda', display: 'EBITDA' },
		{ key: 'netIncome', display: 'Net Income' },
		{ key: 'totalAssets', display: 'Total Assets' },
		{ key: 'totalLiabilities', display: 'Total Liabilities' },
		{ key: 'shareholderEquity', display: 'Shareholder Equity' },
		{ key: 'longTermDebt', display: 'Long Term Debt' },
		{ key: 'cashAndEquivalents', display: 'Cash and Equivalents' },
		{ key: 'operatingCashFlow', display: 'Operating Cash Flow' },
		{ key: 'freeCashFlow', display: 'Free Cash Flow' },
		{ key: 'grossMargin', display: 'Gross Margin' },
		{ key: 'roe', display: 'ROE' },
		{ key: 'roa', display: 'ROA' },
		{ key: 'debtToEquity', display: 'Debt : Equity' }
	];

	let key = $state(reports[0].title);
	let currentReport = $derived(reports.find((r) => r.title === key));
</script>

<Select.Root type="single" bind:value={key}>
	<Select.Trigger class="w-full py-2 text-xs">
		{key}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>End Date</Select.Label>
			{#each reports as report (report.title)}
				<Select.Item class="text-xs" value={report.title} label={report.title}>
					{report.title}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

<Table.Root class="mt-2">
	<Table.Body>
		{#each displayRows as row (row.key)}
			<Table.Row>
				<Table.Cell class="w-1/2 text-right text-xs text-gray-600">{row.display}</Table.Cell>
				<Table.Cell class="text-xs"
					>{formatNumber(currentReport![row.key as keyof FinancialReport] as number, 3)}</Table.Cell
				>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
