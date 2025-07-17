<script lang="ts">
	import { scaleLinear, scaleTime } from 'd3-scale';
	import { Highlight, Chart, Svg, Axis, Spline, Grid, Tooltip, Text } from 'layerchart';

	import type { PriceDataFrame } from '$lib/classes/types';
	import { formatDateTime } from '$lib/utils';

	const { df }: { df: PriceDataFrame } = $props();
</script>

<div class="h-[300px]">
	<Chart
		data={df.priceData}
		x="timestamp"
		xScale={scaleTime()}
		xDomain={[df.marketOpen, df.marketClose]}
		xNice
		y="close"
		yScale={scaleLinear().nice()}
		yDomain={[df.minPrice, df.maxPrice]}
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
				value={`Min: ${df.minPrice.toFixed(2)}`}
			/>
			<Text
				class="text-[10px] font-light"
				x={320}
				y={-6}
				textAnchor="end"
				verticalAnchor="end"
				value={`Max: ${df.maxPrice.toFixed(2)}`}
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
				{formatDateTime(data.timestamp)}: {data.close.toFixed(2)}
			{/snippet}
		</Tooltip.Root>
	</Chart>
</div>
