<script lang="ts">
	import { Check, Edit, LoaderCircle, Plus } from '@lucide/svelte';

	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';

	import { marketIsOpen } from '$lib/api/utils';
	import { setNavContext } from '$lib/classes/nav.svelte';
	import type { PriceDataFrame } from '$lib/classes/types';
	import BreathingIndicator from '$lib/components/BreathingIndicator.svelte';
	import ReportViewer from '$lib/components/ReportViewer.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { commitAddPosition } from '$lib/states/user.svelte';
	import { toISOStringWithTZ } from '$lib/utils';

	import HoldingsViewer from './HoldingsViewer.svelte';
	import PriceDataViewer from './PriceDataViewer.svelte';
	import { displayRows, tickerPriceHistoryRetrievers } from './utils';

	const { data } = $props();
	const { ticker, info, quarterlyReports, annualReports } = data;

	setNavContext(
		{
			title: `${ticker}`,
			supplement: 'Ticker',
			route: `/holdings/${ticker}`
		},
		{
			title: 'Holdings',
			route: '/holdings'
		}
	);

	let priceHistoryDisplayPeriod = $state('1D');
	let cachedPriceData: { [period: string]: Promise<PriceDataFrame> } = {};

	let isEditingHoldings = $state(false);

	let financialReportDisplayPeriod = $state('quarterly');
	let quarterlyReportKey = $state(quarterlyReports[0]?.title);
	let annualReportKey = $state(annualReports[0]?.title);

	const now = new Date();
	let inputNewPosition = $state({
		direction: 'BUY',
		quantity: '0',
		unitCost: '0',
		createdAt: toISOStringWithTZ(now)
	});

	function resetInputNewPosition(): void {
		const now = new Date();
		inputNewPosition = {
			direction: 'BUY',
			quantity: '0',
			unitCost: '0',
			createdAt: toISOStringWithTZ(now)
		};
	}

	function getPriceData(period: string): Promise<PriceDataFrame> {
		if (period in cachedPriceData) {
			return cachedPriceData[period];
		}

		return (cachedPriceData[period] = tickerPriceHistoryRetrievers[period](ticker));
	}
</script>

<div class="flex flex-row items-center gap-x-1">
	<span class="font-mono text-xl font-bold">{ticker}</span>

	<BreathingIndicator isOn={marketIsOpen(info.marketState)} display={info.fullExchangeName}
	></BreathingIndicator>

	<span class="text-sm">{info.region}</span>
</div>

<div>{info.shortName}</div>

<Separator />

<div class="flex flex-row items-center justify-between">
	<span class="text-sm font-semibold">Price History</span>

	<Tabs.Root bind:value={priceHistoryDisplayPeriod}>
		<Tabs.List>
			<Tabs.Trigger class="text-xs" value="1D">1D</Tabs.Trigger>
			<Tabs.Trigger class="text-xs" value="1W">1W</Tabs.Trigger>
			<Tabs.Trigger class="text-xs" value="1M">1M</Tabs.Trigger>
			<Tabs.Trigger class="text-xs" value="1Y">1Y</Tabs.Trigger>
			<Tabs.Trigger class="text-xs" value="5Y">5Y</Tabs.Trigger>
			<Tabs.Trigger class="text-xs" value="All">All</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</div>

{#await getPriceData(priceHistoryDisplayPeriod)}
	<div
		class="flex h-[300px] flex-col justify-center text-center text-sm font-semibold text-gray-600"
	>
		<div>Retrieving price data. <LoaderCircle class="inline-block size-3 animate-spin" /></div>
	</div>
{:then df}
	<PriceDataViewer {df} />
{:catch err}
	<div
		class="flex h-[300px] flex-col justify-center text-center text-sm font-semibold text-red-600"
	>
		Failed to retrieve price data: {err}
	</div>
{/await}
<Separator />

<div class="flex flex-row items-center justify-between">
	<span class="text-sm font-semibold">Holdings</span>
	<button
		onclick={() => (isEditingHoldings = !isEditingHoldings)}
		class="toggle-edit h-8 py-2 pl-2"
	>
		{#if isEditingHoldings}
			<span in:fade={{ delay: 250, duration: 250 }} out:fade={{ duration: 250 }}>
				<Check class="size-4" />
			</span>
		{:else}
			<span in:fade={{ delay: 250, duration: 250 }} out:fade={{ duration: 250 }}>
				<Edit class="size-4" />
			</span>
		{/if}
	</button>
</div>

<div>
	<HoldingsViewer {isEditingHoldings} {ticker} />
</div>

<Drawer.Root>
	<Drawer.Trigger>
		<div class="flex w-xs flex-row items-center justify-center">
			<Button class="grow" variant="ghost">
				<div class="flex flex-row items-center justify-center space-x-1 text-gray-600">
					<Plus class="size-4" /> <span class="inline-block text-xs">Add New</span>
				</div>
			</Button>
		</div>
	</Drawer.Trigger>

	<Drawer.Content class="z-1001 mx-auto w-xs">
		<Drawer.Header>
			<Drawer.Title>Add New Position</Drawer.Title>
			<Drawer.Description>Add new position for ticker {ticker}.</Drawer.Description>
		</Drawer.Header>

		<div class="grid grid-cols-3 items-center justify-center gap-2 p-4">
			<Label class="mx-auto" for="direction">Direction</Label>

			<Tabs.Root class="col-span-2 mx-auto" bind:value={inputNewPosition.direction}>
				<Tabs.List>
					<Tabs.Trigger class="text-xs font-bold text-green-600" value="BUY">BUY</Tabs.Trigger>
					<Tabs.Trigger class="text-xs font-bold text-red-600" value="SELL">SELL</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>

			<Label class="mx-auto" for="quantity">Quantity</Label>

			<Input class="col-span-2" bind:value={inputNewPosition.quantity} />

			<Label class="mx-auto" for="unit-cost">Unit Cost</Label>

			<Input class="col-span-2" bind:value={inputNewPosition.unitCost} />

			<Label class="mx-auto" for="Created At">Created At</Label>

			<Input class="col-span-2" bind:value={inputNewPosition.createdAt} />
			<p class="col-span-3 text-right text-xs text-muted-foreground">
				Format: ISO8601 <br />

				YYYY-MM-DDTHH:MM:SS+OO:OO
			</p>
		</div>

		<div class="p-4 pb-0"></div>
		<Drawer.Footer>
			<Drawer.Close
				onclick={async () => {
					const direction = inputNewPosition.direction;
					const quantity = Number(inputNewPosition.quantity);
					const unitCost = Number(inputNewPosition.unitCost);

					if (quantity === 0) {
						toast.error('Quantity cannot be 0.');
						return;
					}

					if (unitCost === 0) {
						toast.error('Quantity cannot be 0.');
						return;
					}

					await commitAddPosition(ticker, direction, quantity, unitCost);

					resetInputNewPosition();
				}}
				class={buttonVariants({ variant: 'default' })}>Confirm</Drawer.Close
			>
			<Drawer.Close class="text-sm font-semibold">Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<Separator />

<div class="flex flex-row items-center justify-between">
	<span class="text-sm font-semibold">Financial Reports</span>

	<Tabs.Root bind:value={financialReportDisplayPeriod}>
		<Tabs.List>
			<Tabs.Trigger class="text-xs" value="quarterly">Quarterly</Tabs.Trigger>
			<Tabs.Trigger class="text-xs" value="annual">Annual</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</div>

<div>
	{#if financialReportDisplayPeriod === 'quarterly' && quarterlyReports.length !== 0}
		<Select.Root type="single" bind:value={quarterlyReportKey}>
			<Select.Trigger class="w-full py-2 text-xs">
				{quarterlyReports.find((fr) => fr.title === quarterlyReportKey)!.title}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>End Date</Select.Label>
					{#each quarterlyReports as report (report.title)}
						<Select.Item class="text-xs" value={report.title} label={report.title}>
							{report.title}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>

		<ReportViewer
			df={quarterlyReports.find((fr) => fr.title === quarterlyReportKey)!}
			rows={displayRows}
		/>
	{:else if financialReportDisplayPeriod === 'annual' && annualReports.length !== 0}
		<Select.Root type="single" bind:value={annualReportKey}>
			<Select.Trigger class="w-full py-2 text-xs">
				{annualReports.find((fr) => fr.title === annualReportKey)!.title}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>End Date</Select.Label>
					{#each annualReports as report (report.title)}
						<Select.Item class="text-xs" value={report.title} label={report.title}>
							{report.title}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>

		<ReportViewer
			df={annualReports.find((fr) => fr.title === annualReportKey)!}
			rows={displayRows}
		/>
	{:else}
		<div class="mt-6 text-center text-sm text-gray-600">No financial reports available.</div>
	{/if}
</div>
