<script lang="ts">
	import { marketIsOpen } from '$lib/api/utils';
	import { type TickerInfo } from '$lib/classes/types';
	import BreathingIndicator from '$lib/components/BreathingIndicator.svelte';
	import ColouredIndicator from '$lib/components/ColouredIndicator.svelte';
	import { userStore } from '$lib/states/user.svelte';

	const { ticker, tickerData }: { ticker: string; tickerData: TickerInfo } = $props();

	const dailyPercentageChange =
		((tickerData?.regularMarketPrice ?? 0) - (tickerData?.previousClose ?? 0)) /
		(tickerData?.previousClose ?? 0) * 100;
	const unrealisedPL =
		(tickerData?.regularMarketPrice ?? 0) * userStore.user!.getHolding(ticker).totalQuantity -
		userStore.user!.getHolding(ticker).totalInvestment;
</script>

<div class="h-16 grow">
	{#if tickerData}
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
				{userStore
					.user!.getHolding(ticker)
					.totalMarketValueAtUnitPrice(tickerData.regularMarketPrice)
					.toFixed(2)}
			</div>
		</div>

		<div class="flex flex-row justify-between text-xs [font-variant:small-caps]"></div>
	{:else}
		<span class="font-mono font-bold">Loading...</span>
	{/if}
</div>
