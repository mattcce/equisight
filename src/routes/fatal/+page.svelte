<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { errorStore } from '$lib/states/error.svelte';

	const errMsg = errorStore.errMsg ?? page.url.searchParams.get('errMsg');
</script>

<Card.Root class="bg-red-200">
	<Card.Header class="text-sm font-semibold text-red-600">Fatal Error</Card.Header>

	<Card.Content class="text-xs">
		A fatal error has occurred.

		{#if errMsg}
			<div class="text-xs">{errMsg}</div>
		{/if}

		<div class="mt-2">
			<Button
				variant="link"
				class="w-full text-xs"
				onclick={() => {
					goto(page.url.searchParams.get('redirectTo') ?? '/');
				}}>Go Back</Button
			>
		</div>
	</Card.Content>
</Card.Root>
