<script lang="ts">
	import { type TickerInfo } from '$lib/api/types';
	import { Holding } from '$lib/classes/holding';
	import { Badge } from '$lib/components/ui/badge';
	import ColouredIndicator from './ColouredIndicator.svelte';

	const { tickerData, holding }: { tickerData: TickerInfo; holding: Holding } = $props();

	function marketIsOpen(marketState: string): boolean {
		return marketState == 'REGULAR';
	}

	const dailyPercentageChange = tickerData.regularMarketPrice - tickerData.previousClose;
	const unrealisedPL =
		tickerData.regularMarketPrice * holding.totalQuantity - holding.totalInvestment;
</script>

<div>
	<div class="grid grid-cols-3 justify-between gap-y-[4px]">
		<div class="col-span-2">
			<span class="font-mono font-bold">{tickerData.symbol}</span>
			<Badge class="h-[20px]">
				<span
					class={[
						'mr-1 -ml-1 animate-pulse text-sm',
						(marketIsOpen(tickerData.marketState) && 'text-green-600') || 'text-red-600'
					]}>⦁</span
				>
				<span class="text-xs">{tickerData.fullExchangeName}</span>
			</Badge>

			<span class="text-xs font-semibold">{tickerData.region}</span>
		</div>

		<div class="ml-auto">
			<span class="text-xs [font-variant:smallcaps]">{tickerData.currency}</span>
			<span class="font-mono">{tickerData.regularMarketPrice.toFixed(2)}</span>
		</div>

		<div class="col-span-2">
			<span class="line-clamp-1 text-xs text-ellipsis">{tickerData.shortName}</span>
		</div>

		<div class="ml-auto flex items-center justify-items-end">
			<ColouredIndicator value={dailyPercentageChange} suffix="%" />
		</div>

		<div class="text-xs">Held ▶</div>

		<div class="col-span-2 ml-auto text-xs">
			<ColouredIndicator value={unrealisedPL} prefix="{tickerData.currency} " />
			{tickerData.currency}
			{holding.totalMarketValueAtUnitPrice(tickerData.regularMarketPrice).toFixed(2)}
		</div>
	</div>

	<div class="flex flex-row justify-between text-xs [font-variant:small-caps]"></div>
</div>
