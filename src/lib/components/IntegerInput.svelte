<script lang="ts">
	import { Minus, Plus } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';

	let {
		lowerLimit = 0,
		upperLimit = undefined,
		step = 1,
		value = $bindable()
	}: {
		lowerLimit: number;
		upperLimit?: number;
		step?: number;
		value: number;
	} = $props();

	function adjust(x: number): void {
		value = value + x;
	}
</script>

<div class="flex flex-row items-center justify-between">
	<Button variant="ghost" onclick={() => adjust(-step)} disabled={value <= lowerLimit}>
		<Minus />
	</Button>

	<div class="w-3 text-center">{value}</div>

	<Button variant="ghost" onclick={() => adjust(step)} disabled={upperLimit && value >= upperLimit}>
		<Plus />
	</Button>
</div>
