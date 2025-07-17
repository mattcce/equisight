<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { apiClient } from '$lib/api/client';
	import { setNavContext } from '$lib/classes/nav.svelte';
	import ClearAllButton from '$lib/components/ClearAllButton.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import { BACKTESTING_HISTORY, getLocalStorage, setLocalStorage } from '$lib/storage';
	import { debounce, formatDateNumeric, formatDateTime, formatNumber } from '$lib/utils';

	import { tools } from '../utils';

	setNavContext(
		{ title: 'Backtesting', supplement: 'Analysis Tool', route: '/analysis/backtesting' },
		{
			title: 'Analysis',
			route: '/analysis'
		}
	);

	const tool = tools.filter((t) => t.route === '/analysis/backtesting')[0];

	type BacktestQuery = {
		ticker: string;
		purchaseDate: string;
		currentDate: string;
		investmentType: string;
		lumpSumAmount?: number;
		dcaAmount?: number;
		dcaFrequency?: string;
	};
	type BacktestResult = BacktestQuery & {
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
	type BacktestReport = BacktestQuery &
		BacktestResult & {
			completedTimestamp: number;
		};
	let historicalQueries: BacktestReport[] = $state(getLocalStorage(BACKTESTING_HISTORY, []));
	$effect(() => {
		if (historicalQueries) {
			setLocalStorage(BACKTESTING_HISTORY, historicalQueries);
		}
	});

	let backtestingQueryOptions: {
		ticker: string;
		purchaseDate: string;
		investmentType: 'lumpSum' | 'dca';
		lumpSumAmount: string;
		dcaAmount: string;
		dcaFrequency: 'weekly' | 'monthly' | 'yearly';
	} = $state({
		ticker: '',
		purchaseDate: formatDateNumeric(new Date()),
		investmentType: 'lumpSum',
		lumpSumAmount: '1000',
		dcaAmount: '100',
		dcaFrequency: 'monthly'
	});

	let tickerCurrency: string = $state('???');
	let isInvalidTicker: boolean = $state(false);

	const getTickerCurrency = debounce(async () => {
		if (backtestingQueryOptions.ticker === '') {
			tickerCurrency = '???';
			return;
		}

		const response = await apiClient(`/ticker/${backtestingQueryOptions.ticker}/info`, {
			method: 'GET'
		});

		if (response.ok) {
			tickerCurrency = await response.json().then((r) => r.currency);
		} else {
			tickerCurrency = '???';
			isInvalidTicker = true;
		}
	}, 1000);

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let deps = [backtestingQueryOptions.ticker];

		getTickerCurrency();
	});

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let deps = [backtestingQueryOptions.ticker];

		isInvalidTicker = false;
	});

	function formatResult(result: BacktestResult): BacktestReport {
		if (result.investmentType === 'lumpSum') {
			result.investmentType = 'Lump Sum';
			delete result.dcaAmount;
			delete result.dcaFrequency;
		} else {
			result.investmentType = 'DCA';
			delete result.lumpSumAmount;
		}

		const report = result as BacktestReport;

		report.completedTimestamp = Date.now();

		return report;
	}

	async function submitBacktestingQuery(): Promise<void> {
		const response = await apiClient(
			`/backtester/calculate-return/${backtestingQueryOptions.ticker}?purchaseDate=${backtestingQueryOptions.purchaseDate}&investmentType=${backtestingQueryOptions.investmentType}&lumpSumAmount=${parseFloat(backtestingQueryOptions.lumpSumAmount)}&dcaAmount=${parseFloat(backtestingQueryOptions.dcaAmount)}&dcaFrequency=${backtestingQueryOptions.dcaFrequency}`,
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
		{ key: 'purchaseDate', display: 'Purchase Date' },
		{ key: 'currentDate', display: 'End Date' },
		{ key: 'investmentType', display: 'Investment Type' },
		{ key: 'lumpSumAmount', display: 'Lump Sum Amount' },
		{ key: 'dcaAmount', display: 'DCA Amount' },
		{ key: 'dcaFrequency', display: 'DCA Frequency' }
	];

	const displayReportRows = [
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
</script>

<div class="text-sm font-semibold">{tool.title}</div>

<div class="text-sm">{tool.description}</div>

<Separator />

<div class="text-sm font-semibold">New Query</div>

<div class="grid grid-cols-2 items-center gap-2 text-sm">
	<span>Ticker</span>
	<Input
		aria-invalid={isInvalidTicker}
		class="w-full"
		bind:value={backtestingQueryOptions.ticker}
	/>

	<span>Purchase Date</span>
	<Input
		class="w-full"
		bind:value={backtestingQueryOptions.purchaseDate}
		placeholder="YYYY-MM-DD"
	/>

	<span>Strategy</span>

	<div class="mx-auto">
		<Tabs.Root class="col-span-2 mx-auto" bind:value={backtestingQueryOptions.investmentType}>
			<Tabs.List>
				<Tabs.Trigger class="text-xs font-bold" value="lumpSum">Lump Sum</Tabs.Trigger>
				<Tabs.Trigger class="text-xs font-bold" value="dca">DCA</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</div>

	{#if backtestingQueryOptions.investmentType === 'lumpSum'}
		<span>Lump Sum Amount</span>
		<div class="flex flex-row items-baseline justify-between">
			<span class="text-xs text-gray-600">{tickerCurrency}</span>
			<Input class="inline-block w-[120px]" bind:value={backtestingQueryOptions.lumpSumAmount} />
		</div>
	{:else}
		<span>DCA Amount</span>
		<div class="flex flex-row items-baseline justify-between">
			<span class="text-xs text-gray-600">{tickerCurrency}</span>
			<Input class="inline-block w-[120px]" bind:value={backtestingQueryOptions.dcaAmount} />
		</div>

		<span>DCA Frequency</span>
		<div class="mx-auto">
			<Tabs.Root class="col-span-2 mx-auto" bind:value={backtestingQueryOptions.dcaFrequency}>
				<Tabs.List>
					<Tabs.Trigger class="text-xs font-bold" value="weekly">1W</Tabs.Trigger>
					<Tabs.Trigger class="text-xs font-bold" value="monthly">1M</Tabs.Trigger>
					<Tabs.Trigger class="text-xs font-bold" value="yearly">1Y</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>
		</div>
	{/if}
</div>

<Button onclick={submitBacktestingQuery}>Submit Query</Button>

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
							{#if historicalQuery[row.key as keyof BacktestQuery]}
								<Table.Row class="grid grid-cols-2">
									<Table.Cell class="text-right text-xs text-gray-600">{row.display}</Table.Cell>
									<Table.Cell class="text-xs"
										>{historicalQuery[row.key as keyof BacktestQuery]}</Table.Cell
									>
								</Table.Row>
							{/if}
						{/each}
					</Table.Root>

					<div class="text-center text-xs font-semibold">Result</div>
					<Table.Root>
						{#each displayReportRows as row (row.key)}
							{#if historicalQuery[row.key as keyof BacktestResult]}
								<Table.Row class="grid grid-cols-2">
									<Table.Cell class="text-right text-xs text-gray-600">{row.display}</Table.Cell>
									<Table.Cell class="text-xs"
										>{formatNumber(
											historicalQuery[row.key as keyof BacktestResult] as number,
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
