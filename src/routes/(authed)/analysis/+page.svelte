<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';

	import { setNavContext } from '$lib/classes/nav.svelte';
	import * as Card from '$lib/components/ui/card';

	setNavContext({
		title: 'Analysis',
		route: '/analysis'
	});
</script>

<div class="text-sm font-semibold">Analysis Tools</div>

<a href="/analysis/backtesting"
	><Card.Root>
		<div class="flex flex-row items-center">
			<div>
				<Card.Header class="text-sm font-semibold">Backtesting</Card.Header>
				<Card.Content class="text-sm"
					>Obtain theoretical gains based on investment strategy on a ticker with historical data.</Card.Content
				>
			</div>
			<div class="mr-4"><ChevronRight /></div>
		</div>
	</Card.Root></a
>
