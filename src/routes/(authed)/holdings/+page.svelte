<script lang="ts">
	import { Plus, X, Check, Edit } from '@lucide/svelte';

	import { toast } from 'svelte-sonner';
	import { slide, fade } from 'svelte/transition';

	import { invalidate } from '$app/navigation';
	import { PUBLIC_DATA_REFRESHING } from '$env/static/public';
	import { setNavContext } from '$lib/classes/nav.svelte.js';
	import ColouredIndicator from '$lib/components/ColouredIndicator.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Drawer from '$lib/components/ui/drawer';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { user } from '$lib/states/user.svelte';

	import Equity from './Equity.svelte';

	const { data } = $props();

	let tickers = $derived(user.watchlistTickers);
	let info = $derived(data.info);

	// effect: refresh data
	if (PUBLIC_DATA_REFRESHING === 'true') {
		$effect(() => {
			const refreshTickerInfo = setInterval(() => {
				invalidate('data:tickerInfo');
			}, 5000);

			return () => clearInterval(refreshTickerInfo);
		});
	}

	setNavContext({
		title: 'Holdings',
		route: '/holdings'
	});

	let isEditingWatchlist = $state(false);
	let inputNewTicker = $state('');

	// svelte-ignore state_referenced_locally
	const currentHoldings = tickers
		.map((t) => user.getHolding(t).totalMarketValueAtUnitPrice(info[t]?.regularMarketPrice ?? 0))
		.reduce((x, y) => x + y, 0);
	// svelte-ignore state_referenced_locally
	const portfolioValueAtPreviousClose = tickers
		.map((t) => {
			const tickerInfo = info[t];
			const holding = user.getHolding(t);
			return holding.totalMarketValueAtUnitPrice(tickerInfo?.previousClose ?? 0);
		})
		.reduce((x, y) => x + y, 0);
	// svelte-ignore state_referenced_locally
	const portfolioValueNow = tickers
		.map((t) => {
			const tickerInfo = info[t];
			const holding = user.getHolding(t);
			return holding.totalMarketValueAtUnitPrice(tickerInfo?.regularMarketPrice ?? 0);
		})
		.reduce((x, y) => x + y, 0);
	// svelte-ignore state_referenced_locally
	const portfolioInitialInvestment = tickers
		.map((t) => user.getHolding(t).totalInvestment)
		.reduce((x, y) => x + y, 0);
	const portfolio1DDelta = portfolioValueNow - portfolioValueAtPreviousClose;
	const portfolioOverallDelta = portfolioValueNow - portfolioInitialInvestment;
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

<div class="flex flex-row items-center justify-between">
	<span class="text-sm font-semibold">Watchlist</span>
	<button onclick={() => (isEditingWatchlist = !isEditingWatchlist)} class="h-8 py-2 pl-2">
		{#if isEditingWatchlist}
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

{#each tickers as ticker (ticker)}
	<div transition:slide={{ duration: 500, axis: 'y' }} class="flex flex-row items-center">
		<a
			class={['grow', isEditingWatchlist ? 'pointer-events-none' : 'pointer-events-auto']}
			href={`/holdings/${ticker}`}
		>
			<Equity {ticker} tickerData={info[ticker]} />
		</a>

		{#if isEditingWatchlist}
			<div class="h-full flex-shrink-0" transition:slide={{ duration: 500, axis: 'x' }}>
				<Button class="ml-2 h-full" variant="destructive" onclick={() => user.removeTicker(ticker)}
					><X /></Button
				>
			</div>
		{/if}
	</div>
{/each}

<Drawer.Root>
	<Drawer.Trigger>
		{#if isEditingWatchlist}
			<div
				transition:slide={{ duration: 500, axis: 'y' }}
				class="flex w-full flex-row items-center justify-center"
			>
				<Button class="grow" variant="ghost">
					<div class="flex flex-row items-center justify-center space-x-1 text-gray-600">
						<Plus class="size-4" /> <span class="inline-block text-xs">Add New</span>
					</div>
				</Button>
			</div>
		{/if}
	</Drawer.Trigger>

	<Drawer.Content class="z-1001 mx-auto w-xs">
		<Drawer.Header>
			<Drawer.Title>Add New Ticker</Drawer.Title>
			<Drawer.Description>Add a new ticker to your watchlist.</Drawer.Description>
		</Drawer.Header>

		<div class="p-4 pb-0">
			<Input bind:value={inputNewTicker} placeholder="Ticker" />
		</div>

		<Drawer.Footer>
			<Drawer.Close
				onclick={() => {
					const success = user.addTicker(inputNewTicker);

					if (!success) {
						toast.warning(`Ticker already in watchlist: ${inputNewTicker}.`);
					}

					inputNewTicker = '';
				}}
				class={buttonVariants({ variant: 'default' })}>Confirm</Drawer.Close
			>
			<Drawer.Close class="text-sm font-semibold">Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
