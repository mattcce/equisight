<script lang="ts">
	import { CircleUser, LogOut, Settings } from '@lucide/svelte';

	import { toast } from 'svelte-sonner';

	import { logout } from '$lib/api/auth.svelte';
	import { navContext, setNavContextPrevious } from '$lib/classes/nav.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { userStore } from '$lib/states/user.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger><CircleUser /></Dialog.Trigger>
	<Dialog.Content class="mx-0 w-[320px]">
		<Dialog.Header>
			<Dialog.Title class="text-center">Profile</Dialog.Title>
		</Dialog.Header>

		<div class="mx-auto"><CircleUser /></div>
		<div class="mx-auto">{userStore.user!.identifier}</div>

		<Dialog.Close
			><a
				class={[buttonVariants({ variant: 'default' }), 'w-full']}
				onclick={() =>
					setNavContextPrevious(
						navContext.current?.route !== '/user' ? navContext.current : navContext.previous
					)}
				href="/user"><Settings /> Settings</a
			></Dialog.Close
		>
		<Dialog.Close>
			<Button
				class="w-full"
				variant="outline"
				onclick={() =>
					logout(() => {
						toast.info('Logged out.');
					})}><LogOut /> Log Out</Button
			></Dialog.Close
		>
	</Dialog.Content>
</Dialog.Root>
