<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	let { data } = $props();
</script>

{#each data.articles as article (article.id)}
	<Card.Root>
		<Card.Header class="-mb-4">
			<img
				class="h-24 rounded-sm object-cover"
				src={article.content.thumbnail.originalUrl}
				alt="thumbnail"
			/>
			<Card.Title
				><a href={article.content.clickThroughUrl.url}>{article.content.title}</a></Card.Title
			>
			<Card.Description>
				{article.content.provider.displayName}
			</Card.Description>
		</Card.Header>
		<Card.Content class="text-sm">{article.content.summary}</Card.Content>
	</Card.Root>
{/each}
