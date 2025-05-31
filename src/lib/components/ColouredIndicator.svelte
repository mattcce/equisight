<script lang="ts">
	let {
		value,
		prefix = '',
		suffix = '',
		dp = 2
	}: {
		value: number;
		prefix?: string;
		suffix?: string;
		dp?: number;
	} = $props();

	// threshold below which to consider value as 0 or 'no change'
	const NO_CHANGE_THRESHOLD = 1e-2 / 2;
	const fgColour =
		Math.abs(value) < NO_CHANGE_THRESHOLD
			? 'text-gray-600'
			: value > 0
				? 'text-green-600'
				: 'text-red-600';
	const bgColour =
		Math.abs(value) < NO_CHANGE_THRESHOLD
			? 'bg-gray-100'
			: value > 0
				? 'bg-green-100'
				: 'bg-red-100';
</script>

<div class={['inline-block h-4 w-fit rounded-xs px-1 text-xs', fgColour, bgColour]}>
	{#if Math.abs(value) < NO_CHANGE_THRESHOLD}
		●
	{:else if value > 0}
		▲
	{:else}
		▼
	{/if}
	{prefix}{value.toFixed(dp)}{suffix}
</div>
