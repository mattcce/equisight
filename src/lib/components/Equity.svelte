<script lang="ts">
	import { type TickerInfo } from '$lib/api/types';
	import { Holding } from '$lib/classes/holding';
	import ColouredIndicator from './ColouredIndicator.svelte';
	import BreathingIndicator from '$lib/components/BreathingIndicator.svelte';
	import { marketIsOpen } from '$lib/api/utils';

	const { tickerData, holding }: { tickerData: TickerInfo; holding: Holding } = $props();

	const dailyPercentageChange = tickerData.regularMarketPrice - tickerData.previousClose;
	const unrealisedPL =
		tickerData.regularMarketPrice * holding.totalQuantity - holding.totalInvestment;
</script>

<div>
	<div class="grid grid-cols-3 justify-between gap-y-[4px]">
		<div class="col-span-2">
			<span class="font-mono font-bold">{tickerData.symbol}</span>
			<BreathingIndicator
				isOn={marketIsOpen(tickerData.marketState)}
				display={tickerData.fullExchangeName}
			></BreathingIndicator>

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
