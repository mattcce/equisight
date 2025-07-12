<script lang="ts" generics="T">
	import { Trash } from '@lucide/svelte';

	import { slide } from 'svelte/transition';

	import { buttonVariants } from './ui/button';

	let { target = $bindable(), flushValueProducer }: { target: T; flushValueProducer: () => T } =
		$props();

	let isConfirmingDelete = $state(false);
</script>

<button
	onclick={() => {
		if (isConfirmingDelete) {
			target = flushValueProducer();
		}

		isConfirmingDelete = !isConfirmingDelete;
	}}
	class={[
		'flex h-[2em] items-center overflow-hidden text-sm transition-all',
		isConfirmingDelete && buttonVariants({ variant: 'destructive' })
	]}
>
	<Trash class="mr-1 size-4 flex-shrink-0" />

	{#if isConfirmingDelete}
		<div transition:slide={{ duration: 500, axis: 'x' }}>
			<span class="font-semibold whitespace-nowrap">Clear All</span>
		</div>
	{/if}
</button>
