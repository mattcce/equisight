<script lang="ts">
	let {
		location,
		display,
		currentLocation,
		icon
	}: {
		location: string;
		display: string;
		currentLocation: string;
		icon: string;
	} = $props();

	let isSelected = $derived(currentLocation === display.toLowerCase());
	let isHovered = $state(false);
</script>

<a href={location}>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class={[
			'w-24 rounded-xl p-1.5 px-4.5 transition ease-in-out',
			isSelected && 'border bg-gray-300',
			isHovered && 'border shadow'
		]}
		onmouseover={() => (isHovered = true)}
		onmouseout={() => (isHovered = false)}
		onfocus={() => {}}
		onblur={() => {}}
	>
		<div class="flex flex-col items-center">
			<img class="" src={icon} alt="icon" />

			<span class="text-xs font-bold [font-variant:small-caps]">{display}</span>
		</div>
	</div>
</a>
