<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { type Article } from '$lib/api/types';
	let { data }: { data: { articles: Article[] } } = $props();
</script>

{#each data.articles as article (article.id)}
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
