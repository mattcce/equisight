import { error } from '@sveltejs/kit';

import { PUBLIC_API_DOMAIN } from '$env/static/public';
import { handleUnauthorised } from '$lib/api/auth.svelte';

export async function apiClient(route: string, requestInit: RequestInit): Promise<Response> {
	try {
		const response = await window.fetch(`http://${PUBLIC_API_DOMAIN}${route}`, {
			...requestInit,
			credentials: 'include'
		});

		if (response.status === 401) {
			handleUnauthorised();
		}

		return response;
	} catch (e) {
		throw error(400, JSON.stringify(e));
	}
}
