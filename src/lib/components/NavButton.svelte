<script lang="ts">
	import { goto } from '$app/navigation';

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

	let isSelected = $derived(currentLocation == display.toLowerCase());
	let isHovered = $state(false);
</script>

<button
	class={[
		'w-24 rounded-xl p-1.5 px-4.5 transition ease-in-out',
		isSelected && 'border bg-gray-300',
		isHovered && 'border shadow'
	]}
	onmouseover={() => (isHovered = true)}
	onmouseout={() => (isHovered = false)}
	onfocus={() => {}}
	onblur={() => {}}
	onclick={() => {
		goto(location);
	}}
>
	<div class="flex flex-col items-center">
		<img class="" src={icon} alt="icon" />

		<span class="text-xs font-bold [font-variant:small-caps]">{display}</span>
	</div>
</button>
