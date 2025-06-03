<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import Equity from '$lib/components/Equity.svelte';
	import ColouredIndicator from '$lib/components/ColouredIndicator.svelte';

	let { data } = $props();

	let currentHoldings = data.tickers
		.map((t) => data.holdings[t].totalMarketValueAtUnitPrice(data.info[t].regularMarketPrice))
		.reduce((x, y) => x + y, 0);
	let portfolioValueAtPreviousClose = data.tickers
		.map((t) => {
			const info = data.info[t];
			const holding = data.holdings[t];
			return holding.totalMarketValueAtUnitPrice(info.previousClose);
		})
		.reduce((x, y) => x + y, 0);
	let portfolioValueNow = data.tickers
		.map((t) => {
			const info = data.info[t];
			const holding = data.holdings[t];
			return holding.totalMarketValueAtUnitPrice(info.regularMarketPrice);
		})
		.reduce((x, y) => x + y, 0);
	let portfolioInitialInvestment = data.tickers
		.map((t) => data.holdings[t].totalInvestment)
		.reduce((x, y) => x + y);
	let portfolio1DDelta = portfolioValueNow - portfolioValueAtPreviousClose;
	let portfolioOverallDelta = portfolioValueNow - portfolioInitialInvestment;
</script>

<Card.Root>
	<Card.Header>
		<div class="text-center text-sm font-semibold [font-variant:small-caps]">Total Holdings</div>

		<div>
			<div class="text-center">
				<span class="align-[4px] text-sm">S$</span>
				<span class="text-xl">{currentHoldings.toFixed(2)}</span>
			</div>
		</div>
	</Card.Header>

	<Card.Content>
		<div class="grid grid-cols-3 items-baseline">
			<div class="text-sm [font-variant:small-caps]">1d</div>
			<div>
				<ColouredIndicator value={portfolio1DDelta / portfolioValueAtPreviousClose} suffix="%" />
			</div>
			<div><ColouredIndicator value={portfolio1DDelta} /></div>

			<div class="text-sm [font-variant:small-caps]">Overall</div>
			<div>
				<ColouredIndicator value={portfolioOverallDelta / portfolioInitialInvestment} suffix="%" />
			</div>
			<div><ColouredIndicator value={portfolioOverallDelta} /></div>
		</div>
	</Card.Content>
</Card.Root>

<Separator />

<div class="text-sm font-semibold [font-variant:small-caps]">Open Positions</div>

{#each data.tickers as ticker (ticker)}
	<Equity tickerData={data.info[ticker]} holding={data.holdings[ticker]} />
{/each}
