import { redirect } from '@sveltejs/kit';

import { page } from '$app/state';
import { authStore } from '$lib/states/auth.svelte';

export const ssr = false;

export async function load(): Promise<void> {
	const isAuthenticated = authStore.isAuthenticated;

	if (!isAuthenticated) {
		redirect(303, `/login?redirectTo=${page.url.pathname}`);
	}
}
