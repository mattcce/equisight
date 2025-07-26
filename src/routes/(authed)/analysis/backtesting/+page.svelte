<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { apiClient } from '$lib/api/client';
	import { setNavContext } from '$lib/classes/nav.svelte';
	import ClearAllButton from '$lib/components/ClearAllButton.svelte';
	import ReportViewer from '$lib/components/ReportViewer.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs';
	import { BACKTESTING_HISTORY, getLocalStorage, setLocalStorage } from '$lib/storage';
	import { debounce, formatDateTime } from '$lib/utils';

	import { tools } from '../utils';
	import {
		type BacktestResult,
		type BacktestReport,
		displayQueryParameterRows,
		displayReportRows
	} from './utils';

	setNavContext(
		{ title: 'Backtesting', supplement: 'Analysis Tool', route: '/analysis/backtesting' },
		{
			title: 'Analysis',
			route: '/analysis'
		}
	);

	const tool = tools.filter((t) => t.route === '/analysis/backtesting')[0];

	let historicalQueries: BacktestReport[] = $state(getLocalStorage(BACKTESTING_HISTORY, []));
	$effect(() => {
		if (historicalQueries) {
			setLocalStorage(BACKTESTING_HISTORY, historicalQueries);
		}
	});

	let backtestingQueryOptions: {
		ticker: string;
		purchaseDate: string;
		sellDate: string;
		investmentType: 'lumpSum' | 'dca';
		lumpSumAmount: string;
		dcaAmount: string;
		dcaFrequency: 'weekly' | 'monthly' | 'yearly';
	} = $state({
		ticker: '',
		purchaseDate: '',
		sellDate: '',
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
			`/backtester/calculate-return/${backtestingQueryOptions.ticker}?purchaseDate=${backtestingQueryOptions.purchaseDate}&sellDate=${backtestingQueryOptions.sellDate}&investmentType=${backtestingQueryOptions.investmentType}&lumpSumAmount=${parseFloat(backtestingQueryOptions.lumpSumAmount)}&dcaAmount=${parseFloat(backtestingQueryOptions.dcaAmount)}&dcaFrequency=${backtestingQueryOptions.dcaFrequency}`,
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

	<span>Close Position Date</span>
	<Input class="w-full" bind:value={backtestingQueryOptions.sellDate} placeholder="YYYY-MM-DD" />

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

<Accordion.Root
	type="single"
	value={historicalQueries[0]?.completedTimestamp.toString() ?? undefined}
>
	{#if historicalQueries.length !== 0}
		{#each historicalQueries as historicalQuery (historicalQuery.completedTimestamp)}
			<Accordion.Item value={historicalQuery.completedTimestamp.toString()}>
				<Accordion.Trigger class="text-sm">
					{formatDateTime(new Date(historicalQuery.completedTimestamp))}</Accordion.Trigger
				>
				<Accordion.Content class="flex flex-col gap-2">
					<div class="text-center text-xs font-semibold">Parameters</div>
					<ReportViewer df={historicalQuery} rows={displayQueryParameterRows} />

					<div class="text-center text-xs font-semibold">Result</div>
					<ReportViewer df={historicalQuery} rows={displayReportRows} />
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	{:else}
		<div class="text-sm text-gray-600">No queries found. Make a query to see the result here.</div>
	{/if}
</Accordion.Root>
