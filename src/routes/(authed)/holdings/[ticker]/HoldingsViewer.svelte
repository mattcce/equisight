<script lang="ts">
	import { ArrowDownUp, X } from '@lucide/svelte';

	import { slide } from 'svelte/transition';

	import { directionToString, Direction } from '$lib/classes/holding.svelte';
	import * as Table from '$lib/components/ui/table';
	import { user } from '$lib/states/user.svelte';
	import { formatDateTime } from '$lib/utils';

	const { ticker, isEditingHoldings }: { ticker: string; isEditingHoldings: boolean } = $props();

	let positions = $derived(user.getHolding(ticker).openPositions);
</script>

<Table.Root class="text-xs">
	{#if positions}
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-20 text-center">Created</Table.Head>
				<Table.Head
					><div class="flex flex-row justify-center">
						<ArrowDownUp class="size-4" />
					</div></Table.Head
				>
				<Table.Head class="text-right">U/C</Table.Head>
				<Table.Head>Qty</Table.Head>
			</Table.Row>
		</Table.Header>
		{#each positions as pos (pos)}
			<Table.Row>
				<Table.Cell class="w-24 text-center whitespace-normal"
					>{formatDateTime(pos.createdAt)}</Table.Cell
				>
				<Table.Cell
					class={[
						'w-16 text-center font-bold',
						pos.direction === Direction.BUY ? 'text-green-600' : 'text-red-600'
					]}>{directionToString[pos.direction]}</Table.Cell
				>
				<Table.Cell class="text-right">{pos.unitCost.toFixed(2)}</Table.Cell>
				<Table.Cell>{pos.quantity.toFixed(2)}</Table.Cell>
				<Table.Cell>
					{#if isEditingHoldings}
						<Table.Cell class="p-0">
							<div transition:slide={{ duration: 500, axis: 'x' }}>
								<button
									onclick={() => {
										user.removePosition(ticker, pos);
									}}
								>
									<X class="size-4" />
								</button>
							</div>
						</Table.Cell>
					{/if}
				</Table.Cell>
			</Table.Row>
		{/each}
	{:else}
		<div class="mt-6 text-center text-sm text-gray-600">No open position.</div>
	{/if}
</Table.Root>
