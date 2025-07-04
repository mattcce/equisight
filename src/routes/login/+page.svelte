<script lang="ts">
	import { LoaderCircle } from '@lucide/svelte';

	import { Control } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { get } from 'svelte/store';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { login, register, LoginErrorCodes, RegisterErrorCodes } from '$lib/api/auth.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	import { formSchema } from './schema.js';

	let { data } = $props();

	let isLoggingIn = $state(false);
	let isRegistering = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});
	const { form: formData, enhance } = form;

	const loginFailedCallbacks = {
		[LoginErrorCodes.BAD_CREDENTIALS]: () => {
			formData.set({ username: get(formData).username, password: '' });
			toast.error('Bad credentials!');
		}
	};

	const registerFailedCallbacks = {
		[RegisterErrorCodes.BAD_REQUEST]: () => {
			formData.set({ username: get(formData).username, password: '' });
			toast.error(`Failed to register.`);
		}
	};
</script>

<div class="flex flex-col space-y-6">
	<div class="text-center">Login to EquiSight</div>

	<form
		method="POST"
		use:enhance
		onsubmit={(event) => {
			event.preventDefault();
		}}
	>
		<div class="flex flex-col space-y-2">
			<Form.Field {form} name="username">
				<Control>
					{#snippet children({ props })}
						<Form.Label>Username</Form.Label>
						<Input {...props} type="username" bind:value={$formData.username} />
					{/snippet}
				</Control>
			</Form.Field>

			<Form.Field {form} name="password">
				<Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input {...props} type="password" bind:value={$formData.password} />
					{/snippet}
				</Control>
			</Form.Field>
		</div>
	</form>

	<div class="flex flex-col space-y-2">
		<Button
			disabled={isLoggingIn || isRegistering}
			class="mt-6"
			onclick={async () => {
				isLoggingIn = true;

				const { username, password } = get(formData);
				await login(
					username,
					password,
					() => {
						goto(page.url.searchParams.get('redirectTo') ?? '/');
						toast.success('Logged in!');
					},
					loginFailedCallbacks
				);

				isLoggingIn = false;
			}}
			>Log In
			{#if isLoggingIn}
				<LoaderCircle class="animate-spin" />
			{/if}
		</Button>

		<Button
			disabled={isLoggingIn || isRegistering}
			variant="outline"
			onclick={async () => {
				isRegistering = true;

				const { username, password } = get(formData);
				await register(
					username,
					password,
					() => {
						formData.set({ username: get(formData).username, password: '' });
						toast.success('Registered!');
					},
					registerFailedCallbacks
				);

				isRegistering = false;
			}}
			>Register
			{#if isRegistering}
				<LoaderCircle class="animate-spin" />
			{/if}
		</Button>
	</div>
</div>
