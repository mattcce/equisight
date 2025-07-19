<script lang="ts">
	import { Moon } from 'svelte-loading-spinners';

	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import { authStore } from '$lib/states/auth.svelte';

	import BottomNav from './BottomNav.svelte';
	import TopNav from './TopNav.svelte';

	const { children } = $props();

	let isAuthenticated = $derived(authStore.isAuthenticated);

	$effect(() => {
		if (!isAuthenticated) {
			goto(`/login?redirectTo=${page.url.pathname}`);
		}
	});
</script>

<TopNav />

{#if navigating.to}
	<div class="-my-20 flex h-screen flex-col items-center justify-center text-gray-500">
		<Moon size="60" color="#000000" unit="px" duration="1s" />
	</div>
{:else}
	{@render children()}
{/if}

<BottomNav />
