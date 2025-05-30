<script lang="ts">
	import { type TickerInfo, type PriceTimeSeries } from '$lib/api/types';
	import { Badge } from '$lib/components/ui/badge';
	import { Chart, Svg, Spline } from 'layerchart';
	import { scaleTime } from 'd3-scale';

	const { tickerData, priceData }: { tickerData: TickerInfo; priceData: PriceTimeSeries } =
		$props();
	const pd = priceData.map(({ date, value }) => {
		return { date: new Date(date), value: value };
	});

	function marketIsOpen(marketState: string) {
		return marketState == 'REGULAR';
	}
</script>

<div>
	<div class="flex flex-row justify-between">
		<div>
			<span class="font-mono font-bold">{tickerData.symbol}</span>
			<Badge class="h-[20px]">
				<span
					class={[
						'mr-1 animate-pulse text-sm',
						(marketIsOpen(tickerData.marketState) && 'text-green-600') || 'text-red-600'
					]}>⦁</span
				>
				<span class="text-xs">{tickerData.fullExchangeName}</span>
			</Badge>

			<span class="text-xs font-semibold">{tickerData.region}</span>
		</div>

		<div class="w-36 text-right font-mono">
			<span class="-mr-1 text-xs [font-variant:smallcaps]">{tickerData.currency}</span>
			<span>{tickerData.regularMarketPrice.toFixed(2)}</span>
		</div>
	</div>

	<div class="text-sm"><span>{tickerData.shortName}</span></div>

	<!-- Maybe not conducive to show this here at all; takes up too much space. -->
	<div class="h-[100px] rounded-sm border p-2">
		<Chart
			data={pd}
			x="date"
			xScale={scaleTime()}
			y="value"
			yDomain={[null, null]}
			yNice
			debug={true}
		>
			<Svg>
				<Spline class="stroke-primary stroke-2" />
			</Svg>
		</Chart>
	</div>
</div>
