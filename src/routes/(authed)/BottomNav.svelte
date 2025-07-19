<script lang="ts">
	import { page } from '$app/state';
	import NavButton from '$lib/components/NavButton.svelte';

	import { navLocations } from './utils';

	const navCurrentLocation = $derived(page.url.pathname.split('/')[1]);
</script>

<nav class="fixed bottom-0 left-0 z-1000 w-full bg-gray-100 p-3">
	<div class="flex h-[43px] justify-center">
		<ul class="flex w-xs flex-row items-center justify-around">
			{#each navLocations as { location, display, icon } (location)}
				<li>
					<NavButton {location} {display} {icon} currentLocation={navCurrentLocation} />
				</li>
			{/each}
		</ul>
	</div>
</nav>
