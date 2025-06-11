<script>
	import { scaleTime } from 'd3-scale';
	import { Chart, Axis, Svg } from 'layerchart';
</script>

<div class="h-[300px] rounded-sm border p-4">
	<Chart
		xScale={scaleTime()}
		xDomain={[0, 100]}
		yDomain={[0, 100]}
		yNice
		padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
	>
		<Svg>
			<Axis
				placement="left"
				grid
				rule
				classes={{
					tickLabel: 'fill-white font-semibold',
					rule: 'stroke-primary'
				}}
			/>
			<Axis placement="bottom" grid rule />
		</Svg>
	</Chart>
</div>
