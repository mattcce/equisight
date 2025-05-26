<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import NavButton from '$lib/components/NavButton.svelte';

	let { children } = $props();

	let navLocations = [
		{ location: '/news', display: 'News', icon: '/icons/newspaper_20dp.svg' },
		{ location: '/holdings', display: 'Holdings', icon: '/icons/account_balance_20dp.svg' },
		{ location: '/analysis', display: 'Analysis', icon: '/icons/analytics_20dp.svg' }
	];

	let navCurrentLocation = $state('News');
</script>

<div class="fixed top-0 left-0 w-full bg-gray-100 p-3">
	<div class="flex h-[43px] items-end justify-center">
		{page.url.pathname}
	</div>
</div>

<div class="flex justify-center">
	<div class="my-20 w-xs">
		<!-- main content goes here -->
	</div>
</div>

<nav class="fixed bottom-0 left-0 w-full bg-gray-100 p-3">
	<div class="flex h-[43px] justify-center">
		<ul class="flex w-xs flex-row items-center justify-around">
			{#each navLocations as { location, display, icon } (location)}
				<li>
					<NavButton {location} {display} {icon} bind:currentLocation={navCurrentLocation} />
				</li>
			{/each}
		</ul>
	</div>
</nav>

{@render children()}
