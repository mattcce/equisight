<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { apiClient } from '$lib/api/client';
	import { setNavContext } from '$lib/classes/nav.svelte';
	import ClearAllButton from '$lib/components/ClearAllButton.svelte';
	import IntegerInput from '$lib/components/IntegerInput.svelte';
	import ReportViewer from '$lib/components/ReportViewer.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { getLocalStorage, GRAHAM_VALUE_HISTORY, setLocalStorage } from '$lib/storage';
	import { debounce, formatDateTime } from '$lib/utils';

	import { tools } from '../utils';
	import {
		type GrahamValueResult,
		type GrahamValueReport,
		displayQueryParameterRows,
		displayReportRows
	} from './utils';

	setNavContext(
		{ title: 'Fair Valuation', supplement: 'Analysis Tool', route: '/analysis/fair-value' },
		{
			title: 'Analysis',
			route: '/analysis'
		}
	);

	const tool = tools.filter((t) => t.route === '/analysis/graham-value')[0];

	let historicalQueries: GrahamValueReport[] = $state(getLocalStorage(GRAHAM_VALUE_HISTORY, []));
	$effect(() => {
		if (historicalQueries) {
			setLocalStorage(GRAHAM_VALUE_HISTORY, historicalQueries);
		}
	});

	let grahamValueQueryOptions: {
		ticker: string;
		terminal: string;
		growth: number;
	} = $state({
		ticker: '',
		terminal: '5.0',
		growth: 5
	});

	let isInvalidTicker: boolean = $state(false);

	const checkTickerValidity = debounce(async () => {
		if (grahamValueQueryOptions.ticker === '') {
			return;
		}

		const response = await apiClient(`/ticker/${grahamValueQueryOptions.ticker}/info`, {
			method: 'GET'
		});

		if (!response.ok) {
			isInvalidTicker = true;
		}
	}, 1000);

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let deps = [grahamValueQueryOptions.ticker];

		checkTickerValidity();
	});

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let deps = [grahamValueQueryOptions.ticker];

		isInvalidTicker = false;
	});

	function formatResult(result: GrahamValueResult): GrahamValueReport {
		const transformedQuery = {
			ticker: grahamValueQueryOptions.ticker,
			terminal: parseFloat(grahamValueQueryOptions.terminal),
			growth: grahamValueQueryOptions.growth
		};

		const report = Object.assign({}, transformedQuery, result, {
			completedTimestamp: Date.now()
		}) as GrahamValueReport;
		return report;
	}

	async function submitFairValuationQuery(): Promise<void> {
		const response = await apiClient(
			`/analysis/${grahamValueQueryOptions.ticker}/grahamvalue?terminal=${parseFloat(grahamValueQueryOptions.terminal)}&growth=${grahamValueQueryOptions.growth}`,
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

<div class="text-sm">
	{tool.description}
</div>

<Separator />

<div class="text-sm font-semibold">New Query</div>

<div class="grid grid-cols-2 items-center gap-2 text-sm">
	<span>Ticker</span>
	<Input
		aria-invalid={isInvalidTicker}
		class="w-full"
		bind:value={grahamValueQueryOptions.ticker}
	/>

	<span>Assumed Terminal Growth Rate (%)</span>
	<Input class="w-full" bind:value={grahamValueQueryOptions.terminal} />

	<span>Assumed Continuous Growth Period (years)</span>
	<div>
		<IntegerInput lowerLimit={0} bind:value={grahamValueQueryOptions.growth} />
	</div>
</div>

<Button onclick={submitFairValuationQuery}>Submit Query</Button>

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
