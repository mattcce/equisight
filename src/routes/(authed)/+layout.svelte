<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authStore } from '$lib/api/auth.svelte';
	import { initNavContext } from '$lib/classes/nav.svelte';
	import NavButton from '$lib/components/NavButton.svelte';

	import TopNav from './TopNav.svelte';

	const { children } = $props();

	const navLocations = [
		{ location: '/news', display: 'News', icon: '/icons/newspaper_20dp.svg' },
		{ location: '/holdings', display: 'Holdings', icon: '/icons/account_balance_20dp.svg' },
		{ location: '/analysis', display: 'Analysis', icon: '/icons/analytics_20dp.svg' }
	];

	const navCurrentLocation = $derived(page.url.pathname.split('/')[1]);

	initNavContext();

	let isAuthenticated = $derived(authStore.isAuthenticated);

	$effect(() => {
		if (!isAuthenticated) {
			goto(`/login?redirectTo=${page.url.pathname}`);
		}
	});
</script>

<TopNav />

{@render children()}

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
