<script lang="ts">
	import { page } from '$app/state';
	import NavButton from '$lib/components/NavButton.svelte';
	import '../app.css';

	let { children } = $props();

	let navLocations = [
		{ location: '/news', display: 'News', icon: '/icons/newspaper_20dp.svg' },
		{ location: '/holdings', display: 'Holdings', icon: '/icons/account_balance_20dp.svg' },
		{ location: '/analysis', display: 'Analysis', icon: '/icons/analytics_20dp.svg' }
	];

	let navCurrentLocation = $derived(page.url.pathname.split('/')[1]);
</script>

<div class="fixed top-0 left-0 z-1000 w-full bg-gray-100 p-3">
	<div class="flex h-[43px] items-end justify-center">
		{page.url.pathname}
	</div>
</div>

<div class="flex justify-center">
	<div class="my-20 flex w-xs flex-col space-y-2">
		<!-- main content goes here -->
		{@render children()}
	</div>
</div>

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
