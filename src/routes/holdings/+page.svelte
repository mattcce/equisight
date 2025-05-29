<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	let {
		totals: {
			currentHoldings,
			dailyPercentageChange,
			dailyNominalChange,
			lifetimePercentageChange,
			lifetimeNominalChange
		}
	}: {
		totals: {
			currentHoldings: number;
			dailyPercentageChange: number;
			dailyNominalChange: number;
			lifetimePercentageChange: number;
			lifetimeNominalChange: number;
		};
	} = {
		totals: {
			currentHoldings: 10000.0,
			dailyPercentageChange: -10000, // fixed-point arithmetic, 2dp
			dailyNominalChange: 10000.0,
			lifetimePercentageChange: 10000, // fixed-point arithmetic, 2dp
			lifetimeNominalChange: 10000.0
		}
	};
</script>

<Card.Root>
	<Card.Header>
		<div class="text-center text-sm [font-variant:small-caps]">Total Holdings</div>

		<div>
			<div class="text-center">
				<span class="align-[4px] text-sm">S$</span>
				<span class="text-xl">{currentHoldings}</span>
			</div>
		</div>
	</Card.Header>

	<Card.Content>
		<div class="flex flex-col text-sm">
			<div class="flex flex-row justify-between">
				<span class="w-14 text-sm [font-variant:small-caps]">1d</span>
				<span
					class={[
						'inline-block w-18 text-right',
						dailyPercentageChange > 0
							? 'text-green-600'
							: dailyPercentageChange < 0
								? 'text-red-600'
								: 'text-gray-600'
					]}>{(dailyPercentageChange / 100.0).toFixed(2)}%</span
				>
				<span
					class={[
						'inline-block w-24 text-right',
						dailyPercentageChange > 0
							? 'text-green-600'
							: dailyPercentageChange < 0
								? 'text-red-600'
								: 'text-gray-600'
					]}>{dailyNominalChange.toFixed(2)}</span
				>
			</div>

			<div class="flex flex-row justify-between">
				<span class="w-14 text-sm [font-variant:small-caps]">Overall</span>
				<span
					class={[
						'inline-block w-18 text-right',
						dailyPercentageChange > 0
							? 'text-green-600'
							: dailyPercentageChange < 0
								? 'text-red-600'
								: 'text-gray-600'
					]}>{(lifetimePercentageChange / 100.0).toFixed(2)}%</span
				>
				<span
					class={[
						'inline-block w-24 text-right',
						dailyPercentageChange > 0
							? 'text-green-600'
							: dailyPercentageChange < 0
								? 'text-red-600'
								: 'text-gray-600'
					]}>{lifetimeNominalChange.toFixed(2)}</span
				>
			</div>
		</div>
	</Card.Content>
</Card.Root>
