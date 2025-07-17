<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { apiClient } from '$lib/api/client';
	import { setNavContext } from '$lib/classes/nav.svelte';
	import ClearAllButton from '$lib/components/ClearAllButton.svelte';
	import IntegerInput from '$lib/components/IntegerInput.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import { FAIR_VALUATION_HISTORY, getLocalStorage, setLocalStorage } from '$lib/storage';
	import { debounce, formatDateTime, formatNumber } from '$lib/utils';

	import { tools } from '../utils';

	setNavContext(
		{ title: 'Fair Valuation', supplement: 'Analysis Tool', route: '/analysis/fair-value' },
		{
			title: 'Analysis',
			route: '/analysis'
		}
	);

	const tool = tools.filter((t) => t.route === '/analysis/fair-value')[0];

	type FairValueQuery = {
		ticker: string;
		high: number;
		stable: number;
	};
	type FairValueResult = {
		costOfEquity: number;
		costOfDebt: number;
		wacc: number;
		roic: number;
		expectedGrowthRate: number;
		fairValue: number;
	};
	type FairValueReport = FairValueQuery & FairValueResult & { completedTimestamp: number };
	let historicalQueries: FairValueReport[] = $state(getLocalStorage(FAIR_VALUATION_HISTORY, []));
	$effect(() => {
		if (historicalQueries) {
			setLocalStorage(FAIR_VALUATION_HISTORY, historicalQueries);
		}
	});

	let fairValueQueryOptions: {
		ticker: string;
		high: number;
		stable: number;
	} = $state({
		ticker: '',
		high: 5,
		stable: 5
	});

	let isInvalidTicker: boolean = $state(false);

	const checkTickerValidity = debounce(async () => {
		if (fairValueQueryOptions.ticker === '') {
			return;
		}

		const response = await apiClient(`/ticker/${fairValueQueryOptions.ticker}/info`, {
			method: 'GET'
		});

		if (!response.ok) {
			isInvalidTicker = true;
		}
	}, 1000);

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let deps = [fairValueQueryOptions.ticker];

		checkTickerValidity();
	});

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let deps = [fairValueQueryOptions.ticker];

		isInvalidTicker = false;
	});

	function formatResult(result: FairValueResult): FairValueReport {
		const report = Object.assign({}, fairValueQueryOptions, result, {
			completedTimestamp: Date.now()
		}) as FairValueReport;
		return report;
	}

	async function submitFairValuationQuery(): Promise<void> {
		const response = await apiClient(
			`/analysis/${fairValueQueryOptions.ticker}/fairvalue?high=${fairValueQueryOptions.high}&stable=${fairValueQueryOptions.stable}`,
			{ method: 'GET' }
		);

		if (!response.ok) {
			toast.error('Failed to submit query; check query parameters.');
			return;
		}

		toast.success('Query successful!');
		await response
			.json()
			.then((result) => (historicalQueries = [formatResult(result), ...historicalQueries]));
	}

	const displayQueryParameterRows = [
		{ key: 'ticker', display: 'Ticker' },
		{ key: 'high', display: 'High Growth Years' },
		{ key: 'stable', display: 'Stable Growth Years' }
	];

	const displayReportRows = [
		{ key: 'costOfEquity', display: 'Cost of Equity' },
		{ key: 'costOfDebt', display: 'Cost of Debt' },
		{ key: 'wacc', display: 'WACC' },
		{ key: 'roic', display: 'ROIC' },
		{ key: 'expectedGrowthRate', display: 'Expected Growth Rate' },
		{ key: 'fairValue', display: 'Fair Value' }
	];
</script>

<div class="text-sm font-semibold">{tool.title}</div>

<div class="text-sm">
	{tool.description}
</div>

<Separator />

<div class="text-sm font-semibold">New Query</div>

<div class="grid grid-cols-2 items-center gap-2 text-sm">
	<span>Ticker</span>
	<Input aria-invalid={isInvalidTicker} class="w-full" bind:value={fairValueQueryOptions.ticker} />

	<span>High Growth Years</span>
	<div>
		<IntegerInput lowerLimit={0} bind:value={fairValueQueryOptions.high} />
	</div>

	<span>Stable Growth Years</span>
	<div>
		<IntegerInput lowerLimit={0} bind:value={fairValueQueryOptions.stable} />
	</div>
</div>

<Button onclick={submitFairValuationQuery}>Submit Query</Button>

<Separator />

<div class="flex flex-row items-center justify-between text-sm">
	<span class="font-semibold">Past Queries</span>

	<ClearAllButton bind:target={historicalQueries} flushValueProducer={() => []} />
</div>

<Accordion.Root type="single" value="0">
	{#if historicalQueries.length !== 0}
		{#each historicalQueries as historicalQuery (historicalQuery.completedTimestamp)}
			<Accordion.Item>
				<Accordion.Trigger class="text-sm" value={historicalQuery.completedTimestamp.toString()}
					>{formatDateTime(new Date(historicalQuery.completedTimestamp))}</Accordion.Trigger
				>
				<Accordion.Content class="flex flex-col gap-2">
					<div class="text-center text-xs font-semibold">Parameters</div>
					<Table.Root>
						{#each displayQueryParameterRows as row (row.key)}
							{#if historicalQuery[row.key as keyof FairValueQuery]}
								<Table.Row class="grid grid-cols-2">
									<Table.Cell class="text-right text-xs text-gray-600">{row.display}</Table.Cell>
									<Table.Cell class="text-xs"
										>{historicalQuery[row.key as keyof FairValueQuery]}</Table.Cell
									>
								</Table.Row>
							{/if}
						{/each}
					</Table.Root>

					<div class="text-center text-xs font-semibold">Result</div>
					<Table.Root>
						{#each displayReportRows as row (row.key)}
							{#if historicalQuery[row.key as keyof FairValueResult]}
								<Table.Row class="grid grid-cols-2">
									<Table.Cell class="text-right text-xs text-gray-600">{row.display}</Table.Cell>
									<Table.Cell class="text-xs"
										>{formatNumber(
											historicalQuery[row.key as keyof FairValueResult] as number,
											3
										)}</Table.Cell
									>
								</Table.Row>
							{/if}
						{/each}
					</Table.Root>
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	{:else}
		<div class="text-sm text-gray-600">No queries found. Make a query to see the result here.</div>
	{/if}
</Accordion.Root>
