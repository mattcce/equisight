<script lang="ts">
	import { Check, Edit, Plus } from '@lucide/svelte';

	import { scaleLinear, scaleTime } from 'd3-scale';
	import { Highlight, Chart, Svg, Axis, Spline, Grid, Tooltip, Text } from 'layerchart';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';

	import { marketIsOpen } from '$lib/api/utils';
	import { Direction, Position } from '$lib/classes/holding.svelte';
	import { setNavContext } from '$lib/classes/nav.svelte';
	import BreathingIndicator from '$lib/components/BreathingIndicator.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { commitAddPosition, user } from '$lib/states/user.svelte';
	import { formatDateTime, toISOStringWithTZ } from '$lib/utils';

	import HoldingsViewer from './HoldingsViewer.svelte';
	import ReportViewer from './ReportViewer.svelte';

	const { data } = $props();
	const {
		ticker,
		info,
		marketOpen,
		marketClose,
		intradayPrices,
		intradayMin,
		intradayMax,
		quarterlyReports,
		annualReports
	} = data;

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
	let financialReportDisplayPeriod = $state('quarterly');
	let isEditingHoldings = $state(false);

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
			<Tabs.Trigger class="text-xs" value="5D">5D</Tabs.Trigger>
			<Tabs.Trigger class="text-xs" value="1M">1M</Tabs.Trigger>
			<Tabs.Trigger class="text-xs" value="1Y">1Y</Tabs.Trigger>
			<Tabs.Trigger class="text-xs" value="5Y">5Y</Tabs.Trigger>
			<Tabs.Trigger class="text-xs" value="All">All</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</div>

<div class="h-[300px]">
	<Chart
		data={intradayPrices}
		x="timestamp"
		xScale={scaleTime()}
		xDomain={[marketOpen, marketClose]}
		xNice
		y="close"
		yScale={scaleLinear().nice()}
		yDomain={[intradayMin, intradayMax]}
		padding={{ top: 24, bottom: 24 }}
		tooltip={{ mode: 'voronoi' }}
	>
		<Svg>
			<Grid
				y={{ class: 'stroke-gray-400 [stroke-dasharray:4]' }}
				yTicks={(scale) => scale.ticks?.().filter(Number.isInteger)}
			/>
			<Grid y={{ class: 'stroke-gray-400' }} yTicks={(scale) => scale.domain()} />
			<Axis placement="bottom" rule ticks={(scale) => scale.domain()} format={formatDateTime}>
				<svelte:fragment slot="tickLabel" let:labelProps let:index>
					<Text {...labelProps} textAnchor={index === 0 ? 'start' : 'end'} />
				</svelte:fragment>
			</Axis>
			<Text
				class="text-[10px] font-light"
				x={0}
				y={-6}
				textAnchor="start"
				verticalAnchor="end"
				value={`Min: ${intradayMin.toFixed(2)}`}
			/>
			<Text
				class="text-[10px] font-light"
				x={320}
				y={-6}
				textAnchor="end"
				verticalAnchor="end"
				value={`Max: ${intradayMax.toFixed(2)}`}
			/>
			<Spline class="stroke-primary stroke-1" />
			<Highlight points lines={{ stroke: 'grey' }} axis="both" />
		</Svg>

		<Tooltip.Root
			x="data"
			y={0}
			anchor="top"
			class="bg-surface-100 rounded-sm border border-primary px-2 py-[2px] text-[10px] font-semibold whitespace-nowrap text-primary"
		>
			{#snippet children({ data })}
				{formatDateTime(data.timestamp)}: {info.currency}
				{data.close.toFixed(2)}
			{/snippet}
		</Tooltip.Root>
	</Chart>
</div>

<Separator />

<div class="flex flex-row items-center justify-between">
	<span class="text-sm font-semibold">Holdings</span>
	<button onclick={() => (isEditingHoldings = !isEditingHoldings)} class="h-8 py-2 pl-2">
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

					const positionResponse = await commitAddPosition(ticker, direction, quantity, unitCost);

					if (!positionResponse) {
						toast.error('Failed to add position');
						resetInputNewPosition();
						return;
					}

					const id = positionResponse.id;
					const createdAt = new Date(positionResponse.createdAt * 1000);

					const newPosition = new Position(
						id,
						direction === 'BUY' ? Direction.BUY : Direction.SELL,
						quantity,
						unitCost,
						createdAt
					);

					user.addPosition(ticker, newPosition);

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
		<ReportViewer reports={quarterlyReports} />
	{:else if financialReportDisplayPeriod === 'annual' && annualReports.length !== 0}
		<ReportViewer reports={annualReports} />
	{:else}
		<div class="mt-6 text-center text-sm text-gray-600">No financial reports available.</div>
	{/if}
</div>
