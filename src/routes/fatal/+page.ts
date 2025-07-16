import { handleUnauthorised } from '$lib/api/auth.svelte';

export async function load(): Promise<void> {
	handleUnauthorised();
}
