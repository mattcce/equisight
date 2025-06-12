<script lang="ts">
	import { scaleLinear, scaleTime } from 'd3-scale';
	import { Highlight, Chart, Svg, Axis, Spline, Grid, Tooltip, Text } from 'layerchart';

	import { marketIsOpen } from '$lib/api/utils';
	import { setNavContext } from '$lib/classes/nav.svelte.js';
	import BreathingIndicator from '$lib/components/BreathingIndicator.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { formatDateTime } from '$lib/utils';

	import ReportViewer from './ReportViewer.svelte';

	const { data } = $props();
	const {
		ticker,
		info,
		// holding,
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
