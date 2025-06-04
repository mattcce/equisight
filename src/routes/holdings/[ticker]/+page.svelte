<script lang="ts">
	import { marketIsOpen } from '$lib/api/utils';
	import { setNavContext } from '$lib/classes/nav.svelte.js';
	import BreathingIndicator from '$lib/components/BreathingIndicator.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const { data } = $props();

	setNavContext(
		{
			display: `Ticker: ${data.ticker}`,
			route: `/holdings/${data.ticker}`
		},
		{
			display: 'Holdings',
			route: '/holdings'
		}
	);
</script>

<div class="flex flex-row items-center gap-x-1">
	<span class="font-mono text-xl font-bold">{data.ticker}</span>

	<BreathingIndicator
		isOn={marketIsOpen(data.info.marketState)}
		display={data.info.fullExchangeName}
	></BreathingIndicator>

	<span class="text-sm">{data.info.region}</span>
</div>

<div>{data.info.shortName}</div>

<Separator />
