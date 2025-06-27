<script lang="ts">
	import { X, Minus, Plus } from '@lucide/svelte';

	import { toast } from 'svelte-sonner';
	import { SvelteSet } from 'svelte/reactivity';

	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { userStore } from '$lib/states/user.svelte';

	const { requestCallback } = $props();

	let articlesPerTicker = $state(5);

	function adjustArticlesPerTicker(adjustment: number): void {
		articlesPerTicker = Math.max(1, Math.min(100, articlesPerTicker + adjustment));
	}

	let tickersToQuery: SvelteSet<string> = new SvelteSet(userStore.user!.watchlistTickers);

	function addTicker(ticker: string): void {
		ticker = ticker.trim();

		if (ticker === '') {
			toast.error('Cannot add empty ticker!');
		} else {
			tickersToQuery.add(ticker);
		}
	}

	function removeTicker(ticker: string): void {
		tickersToQuery.delete(ticker);
	}

	function clearTickers(): void {
		tickersToQuery.clear();
	}

	let tickerToAdd = $state('');

	const MAX_ARTICLE_LIMIT = 100;
	let articleCount = $derived(articlesPerTicker * tickersToQuery.size);
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>New News Query</Dialog.Trigger>
	<Dialog.Content class="mx-0 w-[320px]">
		<Dialog.Header>
			<Dialog.Title>New News Query</Dialog.Title>
			<Dialog.Description>Specify query parameters.</Dialog.Description>
		</Dialog.Header>

		<Separator />

		<form class="flex flex-col gap-2">
			<Label class="mx-auto" for="tickersToQuery">Tickers</Label>

			<ScrollArea class="h-36 w-full rounded-xl border">
				<div class="flex w-full flex-row flex-wrap gap-2 p-2">
					{#if tickersToQuery.size !== 0}
						{#each tickersToQuery as ticker (ticker)}
							<Badge variant="secondary"
								>{ticker}
								<Button variant="ghost" class="size-6" onclick={() => removeTicker(ticker)}
									><X /></Button
								></Badge
							>
						{/each}
					{:else}
						<div class="grow text-center text-sm text-gray-600">No tickers selected.</div>
					{/if}
				</div>
			</ScrollArea>

			<Button
				onclick={() => {
					userStore.user!.watchlistTickers.forEach((ticker) => {
						addTicker(ticker);
					});
				}}
				variant="secondary">Add Watchlisted</Button
			>

			<Button onclick={clearTickers} variant="destructive">Clear All Tickers</Button>

			<div class="col-span-2 mb-6 flex flex-row space-x-2">
				<Input bind:value={tickerToAdd} class="text-sm" placeholder="Add Ticker/Symbol" />
				<Button
					onclick={() => {
						addTicker(tickerToAdd.toUpperCase());
						tickerToAdd = '';
					}}
					variant="secondary"><Plus /></Button
				>
			</div>

			<Label class="mx-auto" for="count">Articles per Ticker</Label>
			<div class="flex flex-row items-center justify-center space-x-6">
				<Button
					variant="ghost"
					onclick={() => adjustArticlesPerTicker(-1)}
					disabled={articlesPerTicker <= 1}
				>
					<Minus />
				</Button>

				<div class="w-3 text-center">{articlesPerTicker}</div>

				<Button
					variant="ghost"
					onclick={() => adjustArticlesPerTicker(1)}
					disabled={articlesPerTicker >= MAX_ARTICLE_LIMIT}
				>
					<Plus />
				</Button>
			</div>

			<div
				class={[
					'col-span-2 text-center text-sm text-gray-600',
					articlesPerTicker > 10 ? 'visible' : 'invisible'
				]}
			>
				Articles may be out of date.
			</div>
		</form>

		<Separator />

		{#if articleCount > MAX_ARTICLE_LIMIT}
			<div class="text-center text-sm text-red-600">Too many articles: {articleCount} / 100</div>
		{:else}
			<div class="text-center text-sm">Articles queried: {articleCount} / 100</div>
		{/if}

		<Dialog.Close
			class={buttonVariants({ variant: 'default' })}
			onclick={() => {
				requestCallback(Array.from(tickersToQuery), articlesPerTicker);
			}}
			disabled={articleCount > MAX_ARTICLE_LIMIT || articleCount <= 0}
			>Submit Query
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
