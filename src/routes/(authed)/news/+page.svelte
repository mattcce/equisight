<script lang="ts">
	import { setNavContext } from '$lib/classes/nav.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { formatDateTime } from '$lib/utils';

	import QueryPrompt from './QueryPrompt.svelte';
	import { type NewsQuery, executeNewsQuery } from './news-query';

	const lastNewsQueryFromStorage = localStorage.getItem('lastNewsQuery');
	let lastNewsQuery: NewsQuery | undefined = $state(
		lastNewsQueryFromStorage ? JSON.parse(lastNewsQueryFromStorage) : undefined
	);
	$effect(() => {
		if (lastNewsQuery) {
			localStorage.setItem('lastNewsQuery', JSON.stringify(lastNewsQuery));
		}
	});

	setNavContext({
		title: 'News',
		route: '/news'
	});
</script>

<QueryPrompt
	requestCallback={(tickers: string[], articlesPerTicker: number): void => {
		executeNewsQuery(tickers, articlesPerTicker).then((q) => {
			lastNewsQuery = q;
		});
	}}
/>

<div class="text-sm text-gray-600">Aggregator: Yahoo Finance</div>

<div class="-mt-2 text-sm text-gray-600">
	Last query completed: {lastNewsQuery
		? formatDateTime(new Date(lastNewsQuery.completedTimestamp))
		: 'No previous query found.'}
</div>

<Separator />

<div class="flex flex-col space-y-2">
	{#if lastNewsQuery}
		{#each lastNewsQuery.articles as article (article.id)}
			<Card.Root>
				<Card.Header class="-mb-4">
					<img class="h-24 rounded-sm object-cover" src={article.thumbnailUrl} alt="thumbnail" />
					<Card.Title><a href={article.canonicalUrl}>{article.title}</a></Card.Title>
					<Card.Description>
						{article.providerDisplayName}
					</Card.Description>
				</Card.Header>
				<Card.Content class="text-sm">{article.summary}</Card.Content>
			</Card.Root>
		{/each}
	{:else}
		<div class="text-center text-sm text-gray-600">Make a new query to view articles.</div>
	{/if}
</div>
