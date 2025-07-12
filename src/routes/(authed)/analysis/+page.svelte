<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';

	import { setNavContext } from '$lib/classes/nav.svelte';
	import * as Card from '$lib/components/ui/card';

	import { tools } from './utils';

	setNavContext({
		title: 'Analysis',
		route: '/analysis'
	});
</script>

<div class="text-sm font-semibold">Analysis Tools</div>

{#each tools as tool (tool.title)}
	<a href={tool.route}
		><Card.Root>
			<div class="flex flex-row items-center">
				<div>
					<Card.Header class="text-sm font-semibold">{tool.title}</Card.Header>
					<Card.Content class="text-sm">{tool.description}</Card.Content>
				</div>
				<div class="mr-4"><ChevronRight /></div>
			</div>
		</Card.Root></a
	>
{/each}
