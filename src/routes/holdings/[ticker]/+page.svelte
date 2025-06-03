<script lang="ts">
	import { marketIsOpen } from '$lib/api/utils';
	import BreathingIndicator from '$lib/components/BreathingIndicator.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let { data } = $props();
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
