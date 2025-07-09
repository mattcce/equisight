<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { setNavContextCurrent } from '$lib/classes/nav.svelte';
	import { validatePreferences } from '$lib/classes/user.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { commitPreferences, userStore } from '$lib/states/user.svelte';

	setNavContextCurrent({ title: `Settings`, route: `/user` });

	let inputPreferences = $state(userStore.user!.preferences);
</script>

<div class="text-sm font-semibold">User Settings</div>

<div class="flex flex-row items-baseline justify-between gap-2 text-sm">
	<span>Home Currency</span>

	<Input class="w-1/2" bind:value={inputPreferences.homeCurrency} placeholder="Currency" />
</div>

<Button
	onclick={async () => {
		validatePreferences(inputPreferences);

		const success = await commitPreferences(inputPreferences);

		if (!success) {
			toast.error('Failed to update settings.');
			inputPreferences = userStore.user!.preferences;
			return;
		}

		userStore.user!.preferences = inputPreferences;
		toast.success('Settings updated!');
	}}>Save Settings</Button
>
