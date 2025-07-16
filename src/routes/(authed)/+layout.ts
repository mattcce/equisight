import { goto } from '$app/navigation';
import { page } from '$app/state';
import { authStore } from '$lib/states/auth.svelte';

export async function load(): Promise<void> {
	const isAuthenticated = authStore.isAuthenticated;

	if (!isAuthenticated) {
		goto(`/login?redirectTo=${page.url.pathname}`);
	}
}
