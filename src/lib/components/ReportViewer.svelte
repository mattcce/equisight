<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { formatNumber } from '$lib/utils';

	const {
		df,
		rows
	}: {
		df: { [key: string]: unknown };
		rows: { key: string; display: string; formatter?: (value: unknown) => string }[];
	} = $props();

	const defaultFormatter = (v: unknown): string => {
		switch (typeof v) {
			case 'number':
				return formatNumber(v, 3);
			default:
				return String(v);
		}
	};
</script>

<Table.Root>
	{#each rows as row (row.key)}
		{#if df[row.key]}
			<Table.Row class="grid grid-cols-2 items-center">
				<Table.Cell class="text-right text-xs text-gray-600"
					><span class="text-wrap">{row.display}</span></Table.Cell
				>
				<Table.Cell class="text-xs">{(row.formatter ?? defaultFormatter)(df[row.key])}</Table.Cell>
			</Table.Row>
		{/if}
	{/each}
</Table.Root>
